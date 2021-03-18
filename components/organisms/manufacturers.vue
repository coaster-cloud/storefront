<template>
  <div>
    <!-- Filter Header -->
    <client-only>
      <b-row align-h="between" class="mb-2">
        <b-col cols="6" lg="4" xl="3">
          <text-filter v-model="selectedName" :placeholder="$t('search_manufacturer')" />
        </b-col>
        <b-col cols="6" class="text-right">
          <b-button v-b-toggle.manufacturer-filter variant="light">
            <b-icon icon="sliders" aria-hidden="true" /> <span class="when-open">{{ $t('hide_filters') }}</span><span class="when-closed">{{ $t('show_filters') }}</span>
          </b-button>
        </b-col>
      </b-row>

      <!-- Expanded filter -->
      <b-collapse id="manufacturer-filter" v-model="showFilter" class="mt-4 mb-2">
        <h5>{{ $t('filter') }}</h5>
        <div class="row mb-2">
          <!-- Sorting -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <b-form-select v-model="selectedSort" :options="sortOptions" />
          </div>

          <!-- Category -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <select-filter v-model="selectedCategory" :placeholder="$t('any_category')" :options="categoryOptions" />
          </div>

          <!-- Country -->
          <div v-if="countryOptions.length > 0" class="col-md-6 col-lg-3 col-xl-3 mb-2">
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

    <div v-else-if="normalizedManufacturers.length === 0">
      <no-data />
    </div>

    <b-row v-else>
      <template v-for="(manufacturer, index) in normalizedManufacturers">
        <b-col :key="index" md="6" lg="4" xl="3" class="mb-3">
          <b-card class="card-list" no-body>
            <div class="card-body">
              <nuxt-link :to="localePath(manufacturer.route)" class="w-40 w-sm-100">
                <div class="item-title text-center text-truncate">
                  {{ manufacturer.name }}
                </div>
              </nuxt-link>

              <div class="pt-2 text-muted text-small text-center">
                {{ manufacturer.categories }}
              </div>
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
          :total-rows="totalManufacturers"
          :per-page="itemsPerPage"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import _ from 'lodash'
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
    await this.loadManufacturers(true)
  },

  data () {
    return {
      showFilter: Object.keys(this.$route.query).length > 0,
      manufacturers: [],
      totalManufacturers: 0,
      itemsPerPage: 24,
      categoryOptions: [],
      countryOptions: [],
      stateOptions: [],
      sortOptions: [
        { value: null, text: this.$t('standard_sorting') },
        { value: 'NAME_ASC'.toLowerCase(), text: this.$t('alphabetical') }
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

    normalizedManufacturers () {
      const list = []

      this.manufacturers.forEach(function (manufacturer) {
        const categories = manufacturer.categories.map(v => v.label)

        // Address
        const street = [manufacturer.address.street, manufacturer.address.houseNumber].filter(item => item !== null)
        const city = [manufacturer.address.postalCode, manufacturer.address.city].filter(item => item !== null)

        const address = [
          street.length > 0 ? street.join(' ') : null,
          city.length > 0 ? city.join(' ') : null,
          manufacturer.address.province,
          manufacturer.address.country ? manufacturer.address.country.label : null
        ].filter(item => item !== null && item.length > 0).join(', ').trim()

        list.push({
          name: manufacturer.name,
          categories: categories.join(' / '),
          address,
          route: { name: 'manufacturers-manufacturer', params: { manufacturer: manufacturer.fullSlug } }
        })
      })

      return list
    }
  },

  // Mounted
  mounted () {
    this.$watch('$route.query', () => this.loadManufacturers())
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

    async loadManufacturers (initial = false) {
      const me = this

      const variables = {
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

      result.manufacturers.facets.forEach(function (facet) {
        me.$set(me, me.facetMap[facet.key], facet.terms.map(term => ({ value: term.key, text: term.label })))
      })

      me.manufacturers = result.manufacturers.items
      me.totalManufacturers = result.manufacturers.pagination.totalItems

      me.$emit('refreshed', {
        totalManufacturers: me.totalManufacturers,
        initial
      })
    }
  }
}
</script>

<query>
query ($locale: String, $facet: [ManufacturerFacet]!, $itemsPerPage: Int!, $page: Int!, $filter: ManufacturerFilter, $sort: ManufacturerSort!) {
    manufacturers(facet: $facet, itemsPerPage: $itemsPerPage, page: $page, filter: $filter, sort: $sort) {
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
            categories {
                label(locale: $locale)
            }
            address {
              street
              houseNumber
              city
              postalCode
              province
              country { label(locale: $locale) }
            }
        }
    }
}
</query>
