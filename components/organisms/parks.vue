<template>
  <div>
    <!-- Filter Header -->
    <client-only>
      <b-row align-h="between" class="mb-2">
        <b-col cols="6" lg="4" xl="3">
          <text-filter v-model="filter.name" :placeholder="$t('search_park')" />
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
            <b-form-select v-model="sorting.selected" :options="sorting.options" />
          </div>

          <!-- Type -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <select-filter v-model="filter.type.selected" :placeholder="$t('all_parks')" :options="filter.type.options" />
          </div>

          <!-- Country -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <select-filter v-model="filter.country.selected" :placeholder="$t('all_countries')" :options="filter.country.options" />
          </div>

          <!-- State -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <select-filter v-model="filter.state.selected" :placeholder="$t('any_status')" :options="filter.state.options" />
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
          v-model="paging.currentPage"
          :limit="3"
          align="center"
          class="align-items-center"
          :total-rows="totalParks"
          :per-page="paging.itemsPerPage"
          @change="(page) => loadParks(true, page)"
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
    await this.loadParks()
  },

  data () {
    return {
      showFilter: Object.keys(this.$route.query).length > 0,
      parks: [],
      totalParks: 0,
      paging: {
        itemsPerPage: 24,
        currentPage: _.get(this.$route.query, 'page', 1)
      },
      filter: {
        name: _.get(this.$route.query, 'name', null),
        type: {
          selected: _.get(this.$route.query, 'type', null),
          options: []
        },
        country: {
          selected: _.get(this.$route.query, 'country', null),
          options: []
        },
        state: {
          selected: _.get(this.$route.query, 'state', null),
          options: []
        }
      },
      sorting: {
        selected: _.get(this.$route.query, 'sort', 'RELEVANCE').toUpperCase(),
        options: [
          { value: 'RELEVANCE', text: this.$t('standard_sorting') },
          { value: 'NAME_ASC', text: this.$t('alphabetical') },
          { value: 'TOTAL_ATTRACTIONS_DESC', text: this.$t('total_attractions') }
        ]
      }
    }
  },

  // Computed
  computed: {
    normalizedParks () {
      const list = []
      const me = this

      this.parks.forEach(function (park) {
        const types = park.types.map(v => v.label)

        let feature = null
        if (me.sorting.selected === 'TOTAL_ATTRACTIONS_DESC') {
          feature = me.$t('n_attractions', { '{value}': park.totalAttractions })
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
    },

    urlQuery () {
      const me = this
      const query = []

      query.push({ field: 'page', value: me.paging.currentPage !== 1 ? me.paging.currentPage : null })
      query.push({ field: 'sort', value: me.sorting.selected !== 'RELEVANCE' ? me.sorting.selected.toLowerCase() : null })
      query.push({ field: 'name', value: me.filter.name !== null && me.filter.name.length > 0 ? me.filter.name : null })
      query.push({ field: 'type', value: me.filter.type.selected !== null ? me.filter.type.selected : null })
      query.push({ field: 'country', value: me.filter.country.selected !== null ? me.filter.country.selected : null })
      query.push({ field: 'state', value: me.filter.state.selected !== null ? me.filter.state.selected : null })

      const result = {}
      query.filter(item => item.value !== null).forEach(function (item) {
        result[item.field] = item.value
      })

      return result
    }
  },

  // Mounted
  mounted () {
    const me = this

    me.$watch('filter.name', () => me.loadParks(true, 1))
    me.$watch('filter.type.selected', () => me.loadParks(true, 1))
    me.$watch('filter.country.selected', () => me.loadParks(true, 1))
    me.$watch('filter.state.selected', () => me.loadParks(true, 1))
    me.$watch('sorting.selected', () => me.loadParks(true, 1))
  },

  // Methods
  methods: {
    async loadParks (scroll = false, page = null) {
      const me = this

      me.$store.commit('common/setLoading', true)

      if (page !== null) {
        me.paging.currentPage = page
      }

      const variables = {
        page: me.paging.currentPage,
        itemsPerPage: me.paging.itemsPerPage,
        sort: me.sorting.selected,
        locale: me.$i18n.locale,
        facet: ['TYPE', 'COUNTRY', 'STATE'],
        filter: {}
      }

      if (me.filter.name) {
        variables.filter.search = me.filter.name
      }

      if (me.filter.type.selected) {
        variables.filter.type = me.filter.type.selected
      }

      if (me.filter.country.selected) {
        variables.filter.country = me.filter.country.selected
      }

      if (me.filter.state.selected) {
        variables.filter.state = me.filter.state.selected
      }

      const result = await me.$axios.post(me.$config.dataServiceUrl, {
        query: me.$options.__query, variables
      }).then(res => res.data.data)

      // Add filter options
      result.parks.facets.forEach(function (facet) {
        const facetKey = facet.key.toLowerCase()

        if (Object.prototype.hasOwnProperty.call(me.filter, facetKey)) {
          me.filter[facetKey].options = []

          facet.terms.forEach(function (term) {
            me.filter[facetKey].options.push({
              value: term.key,
              text: term.label
            })
          })
        }
      })

      // Set parks
      me.parks = result.parks.items
      me.totalParks = result.parks.pagination.totalItems

      if (scroll === true) {
        me.$scrollTo('.breadcrumb')
      }

      me.$emit('refreshed', {
        totalParks: me.totalParks,
        queryParams: me.urlQuery
      })

      me.$store.commit('common/setLoading', false)
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
        }
    }
}
</query>
