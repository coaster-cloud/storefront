<template>
  <div>
    <!-- Filter Header -->
    <client-only>
      <b-row align-h="between" class="mb-2">
        <b-col cols="6" lg="4" xl="3">
          <text-input
            id="filter-attractions-name"
            v-model="selectedName"
            :placeholder="$t('search_attraction')"
            lazy
            erasable
            class="mb-0"
          />
        </b-col>
        <b-col cols="6" class="text-right">
          <b-button v-b-toggle.attraction-filter variant="light">
            <b-icon icon="sliders" aria-hidden="true" /> <span class="when-open">{{ $t('hide_filters') }}</span><span class="when-closed">{{ $t('show_filters') }}</span>
          </b-button>
        </b-col>
      </b-row>

      <!-- Expanded filter -->
      <b-collapse id="attraction-filter" v-model="showFilter" class="mt-4 mb-2">
        <h5>{{ $t('filter') }}</h5>
        <div class="row mb-2">
          <!-- Sorting -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <select-input
              id="sort-attractions"
              v-model="selectedSort"
              :placeholder="false"
              :options="sortOptions"
              class="mb-0"
            />
          </div>

          <!-- Category -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <select-input
              id="filter-attractions-category"
              v-model="selectedCategory"
              :placeholder="$t('any_category')"
              :options="categoryOptions"
              erasable
              class="mb-0"
            />
          </div>

          <!-- Thrill -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <select-input
              id="filter-attractions-thrill"
              v-model="selectedThrill"
              :placeholder="$t('any_thrill')"
              :options="thrillOptions"
              erasable
              class="mb-0"
            />
          </div>

          <!-- Manufacturer -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <select-input
              id="filter-attractions-manufacturer"
              v-model="selectedManufacturer"
              :placeholder="$t('any_manufacturer')"
              :options="manufacturerOptions"
              erasable
              class="mb-0"
            />
          </div>

          <!-- State -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <select-input
              id="filter-attractions-state"
              v-model="selectedState"
              :placeholder="$t('any_status')"
              :options="stateOptions"
              erasable
              class="mb-0"
            />
          </div>

          <!-- Elements -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <select-input
              id="filter-attractions-elements"
              v-model="selectedElement"
              :placeholder="$t('any_element')"
              :options="elementOptions"
              erasable
              class="mb-0"
            />
          </div>

          <!-- Tag -->
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <select-input
              id="filter-attractions-tag"
              v-model="selectedTag"
              :placeholder="$t('any_tag')"
              :options="tagOptions"
              erasable
              class="mb-0"
            />
          </div>

          <!-- Park zone -->
          <div v-if="zoneOptions.length > 0" class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <select-input
              id="filter-attractions-zone"
              v-model="selectedZone"
              :placeholder="$t('any_zone')"
              :options="zoneOptions"
              erasable
              class="mb-0"
            />
          </div>
        </div>

        <h5>{{ $t('safety_regulations') }}</h5>
        <div class="row mb-2 align-items-center">
          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <text-input
              id="filter-attractions-size"
              v-model="selectedSize"
              type="number"
              :step="1"
              :placeholder="$t('size_of_child')"
              :append="$t('cm')"
              lazy
              erasable
              class="mb-0"
            />
          </div>

          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <text-input
              id="filter-attractions-age"
              v-model="selectedAge"
              type="number"
              :step="1"
              :placeholder="$t('age_of_child')"
              :append="$t('years')"
              lazy
              erasable
              class="mb-0"
            />
          </div>

          <div class="col-md-6 col-lg-3 col-xl-3 mb-2">
            <switch-input
              id="filter-attractions-accompanied"
              v-model="selectedAccompanied"
              :label="$t('child_is_accompanied')"
              class="mb-0"
            />
          </div>
        </div>
      </b-collapse>
    </client-only>

    <!-- Listing -->
    <div v-if="$store.getters['common/isLoading']">
      <skeleton-card-list />
    </div>

    <div v-else-if="normalizedAttractions.length === 0">
      <no-data />
    </div>

    <b-row v-else>
      <template v-for="(attraction, index) in normalizedAttractions">
        <b-col :key="index" md="6" lg="4" xl="3" class="mb-3">
          <b-card class="card-list" no-body>
            <nuxt-link :to="localePath(attraction.route)">
              <b-card-img :src="attraction.image" :alt="attraction.name" top />
            </nuxt-link>

            <div class="card-body">
              <nuxt-link :to="localePath(attraction.route)" class="w-40 w-sm-100">
                <div class="item-title text-center text-truncate">
                  {{ attraction.name }}
                </div>
              </nuxt-link>

              <div class="pt-2 text-muted text-small text-center">
                {{ attraction.types }}
              </div>

              <template v-if="attraction.feature">
                <div class="pt-2 text-center">
                  <span class="badge badge-pill badge-primary">{{ attraction.feature }}</span>
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
          :total-rows="totalAttractions"
          :per-page="itemsPerPage"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import _ from 'lodash'
import PlaceholderImage from '~/assets/images/placeholder.middle.jpg'

export default {
  props: {
    parkId: {
      type: String,
      default: null
    }
  },

  async fetch () {
    await this.loadAttractions(true)
  },

  data () {
    return {
      showFilter: Object.keys(this.$route.query).length > 0,
      attractions: [],
      totalAttractions: 0,
      itemsPerPage: 24,
      categoryOptions: [],
      thrillOptions: [],
      manufacturerOptions: [],
      stateOptions: [],
      elementOptions: [],
      tagOptions: [],
      zoneOptions: [],
      sortOptions: [
        { value: null, text: this.$t('standard_sorting'), attribute: null },
        { value: 'NAME_ASC'.toLowerCase(), text: this.$t('alphabetical'), attribute: null },
        { value: 'LENGTH_DESC'.toLowerCase(), text: this.$t('length'), attribute: 'length' },
        { value: 'HEIGHT_DESC'.toLowerCase(), text: this.$t('height'), attribute: 'height' },
        { value: 'RIDE_TIME_DESC'.toLowerCase(), text: this.$t('ride_time'), attribute: 'ride_time' },
        { value: 'SPEED_DESC'.toLowerCase(), text: this.$t('speed'), attribute: 'speed' },
        { value: 'SPEED_UP_DESC'.toLowerCase(), text: this.$t('speedup'), attribute: 'speedup' },
        { value: 'MAX_GFORCE_DESC'.toLowerCase(), text: this.$t('max_gforce'), attribute: 'max_gforce' },
        { value: 'CAPACITY_DESC'.toLowerCase(), text: this.$t('capacity'), attribute: 'capacity' },
        { value: 'MAX_TILT_DESC'.toLowerCase(), text: this.$t('max_tilt'), attribute: 'max_tilt' }
      ],
      facetMap: {
        CATEGORY: 'categoryOptions',
        MANUFACTURER: 'manufacturerOptions',
        STATE: 'stateOptions',
        THRILL: 'thrillOptions',
        ELEMENT: 'elementOptions',
        TAG: 'tagOptions',
        ZONE: this.parkId ? 'zoneOptions' : null
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

    selectedThrill: {
      get () {
        return _.get(this.$route.query, 'thrill', null)
      },

      set (value) {
        this.updateRoute({ thrill: value, page: null })
      }
    },

    selectedManufacturer: {
      get () {
        return _.get(this.$route.query, 'manufacturer', null)
      },

      set (value) {
        this.updateRoute({ manufacturer: value, page: null })
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

    selectedElement: {
      get () {
        return _.get(this.$route.query, 'element', null)
      },

      set (value) {
        this.updateRoute({ element: value, page: null })
      }
    },

    selectedTag: {
      get () {
        return _.get(this.$route.query, 'tag', null)
      },

      set (value) {
        this.updateRoute({ tag: value, page: null })
      }
    },

    selectedSize: {
      get () {
        const size = _.get(this.$route.query, 'size', null)

        return this.isEmpty(size) ? null : parseInt(size)
      },

      set (value) {
        this.updateRoute({ size: this.isEmpty(value) ? null : value, page: null })
      }
    },

    selectedAge: {
      get () {
        const age = _.get(this.$route.query, 'age', null)

        return this.isEmpty(age) ? null : parseInt(age)
      },

      set (value) {
        this.updateRoute({ age: this.isEmpty(value) ? null : value, page: null })
      }
    },

    selectedAccompanied: {
      get () {
        const accompanied = _.get(this.$route.query, 'accompanied', false)

        return accompanied === 'true' || accompanied === true
      },

      set (value) {
        this.updateRoute({ accompanied: value === false ? null : value, page: null })
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

    selectedZone: {
      get () {
        return _.get(this.$route.query, 'zone', null)
      },

      set (value) {
        this.updateRoute({ zone: value, page: null })
      }
    },

    normalizedAttractions () {
      const list = []
      const me = this

      this.attractions.forEach(function (attraction) {
        let feature = null

        const matchedSort = _.get(me.sortOptions.filter(option => option.value === me.selectedSort), 0, null)
        if (matchedSort && matchedSort.attribute) {
          feature = _.get(attraction, `${matchedSort.attribute}.valueAsString`, null)
        }

        list.push({
          name: attraction.name,
          types: attraction.category.label,
          feature,
          image: _.get(attraction, 'images[0].url', PlaceholderImage),
          route: {
            name: 'attractions-attraction',
            params: {
              attraction: attraction.fullSlug
            }
          }
        })
      })

      return list
    }
  },

  // Mounted
  mounted () {
    this.$watch('$route.query', () => this.loadAttractions())
  },

  // Methods
  methods: {
    isEmpty (value) {
      return value === null || (typeof value === 'string' && value.trim().length === 0)
    },

    updateRoute (fields) {
      this.$router.replace({
        query: _.omitBy({ ...this.$route.query, ...fields }, _.isNil)
      })
    },

    async loadAttractions (initial = false) {
      const me = this

      let safetyRegulation = null
      if (me.selectedSize || me.selectedAge) {
        safetyRegulation = {
          size: me.selectedSize,
          age: me.selectedAge,
          accompanied: me.selectedAccompanied
        }
      }

      const variables = {
        page: me.selectedPage,
        itemsPerPage: me.itemsPerPage,
        sort: me.selectedSort === null ? 'RELEVANCE' : me.selectedSort.toUpperCase(),
        locale: me.$i18n.locale,
        facet: Object.keys(me.facetMap).filter(key => me.facetMap[key] !== null),
        filter: _.omitBy({
          park: me.parkId,
          zone: me.selectedZone,
          search: me.selectedName,
          category: me.selectedCategory,
          thrill: me.selectedThrill,
          manufacturer: me.selectedManufacturer,
          state: me.selectedState,
          element: me.selectedElement,
          tag: me.selectedTag,
          safetyRegulation
        }, _.isNil)
      }

      const result = await me.$graphql(me.$options.__query, variables)

      result.attractions.facets.forEach(function (facet) {
        me.$set(me, me.facetMap[facet.key], facet.terms.map(term => ({ value: term.key, text: term.label })))
      })

      me.attractions = result.attractions.items
      me.totalAttractions = result.attractions.pagination.totalItems

      me.$emit('refreshed', {
        totalAttractions: me.totalAttractions,
        initial
      })
    }
  }
}
</script>

<query>
query ($locale: String, $facet: [AttractionFacet]!, $itemsPerPage: Int!, $page: Int!, $filter: AttractionFilter, $sort: AttractionSort!) {
    attractions(facet: $facet, itemsPerPage: $itemsPerPage, page: $page, filter: $filter, sort: $sort) {
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
            category {
                label(locale: $locale)
            }
            length: attribute(key: "length") { valueAsString(locale: $locale) }
            height: attribute(key: "height") { valueAsString(locale: $locale) }
            ride_time: attribute(key: "ride_time") { valueAsString(locale: $locale) }
            speed: attribute(key: "speed") { valueAsString(locale: $locale) }
            speedup: attribute(key: "speedup") { valueAsString(locale: $locale) }
            max_gforce: attribute(key: "max_gforce") { valueAsString(locale: $locale) }
            capacity: attribute(key: "capacity") { valueAsString(locale: $locale) }
            max_tilt: attribute(key: "max_tilt") { valueAsString(locale: $locale) }
        }
    }
}
</query>
