<template>
  <div>
    <!-- Filter Header -->
    <client-only>
      <b-row align-h="between" class="mb-2">
        <b-col cols="6" lg="4" xl="3">
          <text-filter v-model="selectedName" :placeholder="$t('search_park')" />
        </b-col>
        <b-col cols="6" class="text-right">
          <b-button v-b-toggle.park-filter variant="light">
            <b-icon icon="sliders" aria-hidden="true" /> <span class="when-open">{{ $t('hide_filters') }}</span><span class="when-closed">{{ $t('show_filters') }}</span>
          </b-button>
        </b-col>
      </b-row>

      <!-- Expanded filter -->
      <b-collapse id="park-filter" v-model="showFilter" class="mt-4 mb-2">
        <h5>{{ $t('filter') }}</h5>
        <div class="row mb-2">
          <!-- Sorting -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <b-form-select v-model="selectedSort" :options="sortOptions" />
          </div>

          <!-- Type -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <select-filter v-model="selectedType" :placeholder="$t('all_parks')" :options="typeOptions" />
          </div>

          <!-- Country -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <select-filter v-model="selectedCountry" :placeholder="$t('all_countries')" :options="countryOptions" />
          </div>

          <!-- State -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <select-filter v-model="selectedState" :placeholder="$t('any_status')" :options="stateOptions" />
          </div>
        </div>
      </b-collapse>
    </client-only>

    <!-- Listing -->
    <div v-if="normalizedParks.length === 0">
      <no-data />
    </div>
    <b-row v-else>
      <template v-for="(park, index) in normalizedParks">
        <b-col :key="index" md="6" lg="4" xl="3" class="mb-3">
          <b-card class="card-list" no-body>
            <NuxtLink :to="localePath(park.route)">
              <b-card-img :src="park.image" top />
            </NuxtLink>

            <div class="card-body">
              <NuxtLink :to="localePath(park.route)" class="w-40 w-sm-100">
                <div class="item-title text-center text-truncate">
                  {{ park.name }}
                </div>
              </NuxtLink>

              <div class="pt-2 text-muted text-small text-center">
                {{ park.types }}
              </div>

              <template v-if="park.feature">
                <div class="pt-2 text-center">
                  <span class="badge badge-pill badge-primary">{{ park.feature }}</span>
                </div>
              </template>
            </div>
          </b-card>
        </b-col>
      </template>

      <b-col cols="12">
        <b-pagination
          v-model="selectedPage"
          :limit="3"
          align="center"
          class="align-items-center"
          :total-rows="totalParks"
          :per-page="itemsPerPage"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import _ from 'lodash'
import PlaceholderImage from '~/assets/images/placeholder.middle.jpg'
import NoData from '~/components/atoms/no-data'
import TextFilter from '~/components/atoms/text-filter'
import SelectFilter from '~/components/atoms/select-filter'

export default {
  components: {
    SelectFilter,
    TextFilter,
    NoData
  },

  async fetch () {
    await this.loadParks(true)
  },

  data () {
    return {
      showFilter: Object.keys(this.$route.query).length > 0,
      parks: [],
      totalParks: 0,
      itemsPerPage: 24,
      typeOptions: [],
      countryOptions: [],
      stateOptions: [],
      sortOptions: [
        { value: null, text: this.$t('standard_sorting') },
        { value: 'NAME_ASC'.toLowerCase(), text: this.$t('alphabetical') },
        { value: 'TOTAL_ATTRACTIONS_DESC'.toLowerCase(), text: this.$t('total_attractions') }
      ],
      facetMap: {
        TYPE: 'typeOptions',
        COUNTRY: 'countryOptions',
        STATE: 'stateOptions'
      }
    }
  },

  // Computed
  computed: {
    selectedPage: {
      get () {
        return _.get(this.$route.query, 'page', 1)
      },

      set (value) {
        this.updateRoute({ page: value === 1 ? null : value })
      }
    },

    selectedName: {
      get () {
        return _.get(this.$route.query, 'name', null)
      },

      set (value) {
        this.updateRoute({ name: value, page: null })
      }
    },

    selectedType: {
      get () {
        return _.get(this.$route.query, 'type', null)
      },

      set (value) {
        this.updateRoute({ type: value, page: null })
      }
    },

    selectedCountry: {
      get () {
        return _.get(this.$route.query, 'country', null)
      },

      set (value) {
        this.updateRoute({ country: value, page: null })
      }
    },

    selectedState: {
      get () {
        return _.get(this.$route.query, 'state', null)
      },

      set (value) {
        this.updateRoute({ state: value, page: null })
      }
    },

    selectedSort: {
      get () {
        return _.get(this.$route.query, 'sort', null)
      },

      set (value) {
        this.updateRoute({ sort: value, page: null })
      }
    },

    normalizedParks () {
      const list = []
      const me = this

      this.parks.forEach(function (park) {
        const types = park.types.map(v => v.label)

        let feature = null
        if (me.selectedSort === 'TOTAL_ATTRACTIONS_DESC'.toLowerCase()) {
          feature = me.$t('n_attractions', { value: park.attractions.totalItems })
        }

        let imageUrl = PlaceholderImage
        if (park.images.length > 0) {
          imageUrl = me.$image(me.$config.imageUrl, park.images[0].fileId, 'middle')
        }

        list.push({
          name: park.name,
          types: types.join(' / '),
          feature,
          image: imageUrl,
          route: { name: 'parks-park', params: { park: park.slug } }
        })
      })

      return list
    }
  },

  // Mounted
  mounted () {
    this.$watch('$route.query', () => this.loadParks())
  },

  // Methods
  methods: {
    updateRoute (fields) {
      // Always set page to null if page is one
      if (Object.prototype.hasOwnProperty.call(fields, 'page')) {
        // fields.page = fields.page === 1 ? null : fields.page
      }

      this.$router.replace({
        query: _.omitBy({ ...this.$route.query, ...fields }, _.isNil)
      })
    },

    async loadParks (initial = false) {
      const me = this

      me.$store.commit('common/setLoading', true)

      const variables = {
        page: me.selectedPage,
        itemsPerPage: me.itemsPerPage,
        sort: me.selectedSort === null ? 'RELEVANCE' : me.selectedSort.toUpperCase(),
        locale: me.$i18n.locale,
        facet: Object.keys(me.facetMap),
        filter: _.omitBy({
          search: me.selectedName,
          type: me.selectedType,
          country: me.selectedCountry,
          state: me.selectedState
        }, _.isNil)
      }

      const result = await me.$axios.post(me.$config.dataServiceUrl, {
        query: me.$options.__query, variables
      }).then(res => res.data.data)

      result.parks.facets.forEach(function (facet) {
        me.$set(me, me.facetMap[facet.key], facet.terms.map(term => ({ value: term.key, text: term.label })))
      })

      me.parks = result.parks.items
      me.totalParks = result.parks.pagination.totalItems

      me.$store.commit('common/setLoading', false)

      me.$emit('refreshed', {
        totalParks: me.totalParks,
        initial
      })
    }
  }
}
</script>

<query>
query ($locale: String, $facet: [ParkFacet]!, $itemsPerPage: Int!, $page: Int!, $filter: ParkFilter, $sort: ParkSort!) {
    parks(facet: $facet, itemsPerPage: $itemsPerPage, page: $page, filter: $filter, sort: $sort) {
        pagination {
            totalItems
        }
        facets {
            key
            terms {
                key
                label(locale: $locale)
                quantity
            }
        }
        items {
            id
            name
            slug
            images {
                fileId
            }
            types {
                label(locale: $locale)
            }
            address {
                country {
                    label(locale: $locale)
                }
            }
            attractions {
                totalItems
            }
        }
    }
}
</query>
