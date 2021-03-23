<template>
  <div>
    <!-- Filter Header -->
    <client-only>
      <b-row class="mb-4">
        <b-col cols="12" class="text-center">
          <b-button-group>
            <b-button :pressed="selectedViewMode === 'list'" variant="light" @click="selectedViewMode = 'list'">
              <b-icon icon="list-ul" />
              {{ $t('list') }}
            </b-button>
            <b-button :pressed="selectedViewMode === 'map'" variant="light" @click="selectedViewMode = 'map'">
              <b-icon icon="map" />
              {{ $t('map') }}
            </b-button>
          </b-button-group>
        </b-col>
      </b-row>

      <b-row align-h="between" class="mb-2">
        <b-col cols="6" lg="4" xl="3">
          <text-input
            id="filter-parks-name"
            v-model="selectedName"
            :placeholder="$t('search_park')"
            lazy
            erasable
          />
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

          <!-- Category -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <select-filter v-model="selectedCategory" :placeholder="$t('all_parks')" :options="categoryOptions" />
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
    <div v-if="$store.getters['common/isLoading']">
      <skeleton-card-list />
    </div>

    <div v-else-if="normalizedParks.length === 0">
      <no-data />
    </div>

    <template v-else>
      <b-row v-if="selectedViewMode === 'list'">
        <template v-for="(park, index) in normalizedParks">
          <b-col :key="index" md="6" lg="4" xl="3" class="mb-3">
            <b-card class="card-list" no-body>
              <nuxt-link :to="localePath(park.route)">
                <b-card-img :src="park.image" :alt="park.name" top />
              </nuxt-link>

              <div class="card-body">
                <nuxt-link :to="localePath(park.route)" class="w-40 w-sm-100">
                  <div class="item-title text-center text-truncate">
                    {{ park.name }}
                  </div>
                </nuxt-link>

                <div class="pt-2 text-muted text-small text-center">
                  {{ park.categories }}
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

      <template v-if="selectedViewMode === 'map'">
        <client-only>
          <leaflet-map :items="mapParks" />
        </client-only>
      </template>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import PlaceholderImage from '~/assets/images/placeholder.middle.jpg'
import NoData from '~/components/atoms/no-data'
import SelectFilter from '~/components/atoms/select-filter'

export default {
  components: {
    SelectFilter,
    NoData
  },

  async fetch () {
    await this.loadParks(true)
  },

  data () {
    return {
      showFilter: Object.keys(this.$route.query).length > 0,
      parks: [],
      mapParks: [],
      totalParks: 0,
      itemsPerPage: 24,
      categoryOptions: [],
      countryOptions: [],
      stateOptions: [],
      sortOptions: [
        { value: null, text: this.$t('standard_sorting') },
        { value: 'NAME_ASC'.toLowerCase(), text: this.$t('alphabetical') },
        { value: 'TOTAL_ATTRACTIONS_DESC'.toLowerCase(), text: this.$t('total_attractions') }
      ],
      facetMap: {
        CATEGORY: 'categoryOptions',
        COUNTRY: 'countryOptions',
        STATE: 'stateOptions'
      }
    }
  },

  // Computed
  computed: {
    selectedViewMode: {
      get () {
        return _.get(this.$route.query, 'view', 'list')
      },

      set (value) {
        this.updateRoute({ view: value === 'list' ? null : value })
      }
    },

    selectedPage: {
      get () {
        return parseInt(_.get(this.$route.query, 'page', 1))
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
        this.updateRoute({ name: this.isEmpty(value) ? null : value, page: null })
      }
    },

    selectedCategory: {
      get () {
        return _.get(this.$route.query, 'category', null)
      },

      set (value) {
        this.updateRoute({ category: value, page: null })
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
        const categories = park.categories.map(v => v.label)

        let feature = null
        if (me.selectedSort === 'TOTAL_ATTRACTIONS_DESC'.toLowerCase()) {
          feature = me.$t('n_attractions', { value: park.attractions.totalItems })
        }

        list.push({
          name: park.name,
          categories: categories.join(' / '),
          feature,
          image: _.get(park, 'images[0].url', PlaceholderImage),
          route: { name: 'parks-park', params: { park: park.fullSlug } }
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
      this.$router.replace({
        query: _.omitBy({ ...this.$route.query, ...fields }, _.isNil)
      })
    },

    isEmpty (value) {
      return value === null || (typeof value === 'string' && value.trim().length === 0)
    },

    async loadParks (initial = false) {
      const me = this

      const variables = {
        includeMap: me.selectedViewMode === 'map',
        page: me.selectedPage,
        itemsPerPage: me.itemsPerPage,
        sort: me.selectedSort === null ? 'RELEVANCE' : me.selectedSort.toUpperCase(),
        locale: me.$i18n.locale,
        facet: Object.keys(me.facetMap),
        filter: _.omitBy({
          search: me.selectedName,
          category: me.selectedCategory,
          country: me.selectedCountry,
          state: me.selectedState
        }, _.isNil)
      }

      const result = await me.$graphql(me.$options.__query, variables)

      result.parks.facets.forEach(function (facet) {
        me.$set(me, me.facetMap[facet.key], facet.terms.map(term => ({ value: term.key, text: term.label })))
      })

      me.parks = result.parks.items
      me.totalParks = result.parks.pagination.totalItems

      if (me.selectedViewMode === 'map') {
        me.mapParks = result.mapParks.items
          .filter(item => item.latitude && item.longitude)
          .map(function (item) {
            const detailUrl = me.$router
              .resolve(me.localePath({ name: 'parks-park', params: { park: item.fullSlug } }))
              .resolved
              .fullPath

            return {
              latitude: item.latitude,
              longitude: item.longitude,
              popup: `<a href="${detailUrl}"><b>${item.name}</b></a>
              <br />
              ${item.categories.map(category => category.label).join(' | ')}
              <br />
              ${me.$t('attractions')}: ${item.attractions.totalItems}`
            }
          })
      }

      me.$emit('refreshed', {
        totalParks: me.totalParks,
        initial
      })
    }
  }
}
</script>

<query>
query ($locale: String, $facet: [ParkFacet]!, $itemsPerPage: Int!, $page: Int!, $filter: ParkFilter, $sort: ParkSort!, $includeMap: Boolean!) {
    parks: parks(facet: $facet, itemsPerPage: $itemsPerPage, page: $page, filter: $filter, sort: $sort) {
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
            fullSlug
            images {
                url(size: MIDDLE)
            }
            categories {
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
    mapParks: parks(itemsPerPage: 1000, filter: $filter) @include(if: $includeMap) {
        items {
            id
            name
            fullSlug
            latitude
            longitude
            attractions { totalItems }
            categories { label(locale: $locale) }
        }
    }
}
</query>
