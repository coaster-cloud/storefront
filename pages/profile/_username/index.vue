<template>
  <div>
    <div v-if="!account" class="main-content">
      <breadcrumb :items="[{label: $t('loading')}]" />
      <skeleton-content />
    </div>

    <div v-else class="main-content">
      <breadcrumb :items="breadcrumbs" />

      <b-row>
        <b-col>
          <!-- Filter Header -->
          <b-row align-h="between" class="mb-2">
            <b-col cols="12" class="text-right">
              <b-button v-b-toggle.profile-filter variant="light">
                <b-icon icon="sliders" aria-hidden="true" /> <span class="when-open">{{ $t('hide_filters') }}</span><span class="when-closed">{{ $t('show_filters') }}</span>
              </b-button>
            </b-col>
          </b-row>

          <!-- Expanded filter -->
          <b-collapse id="profile-filter" v-model="showFilter" class="mt-4 mb-2">
            <h5>{{ $t('filter') }}</h5>
            <div class="row mb-2">
              <!-- Year -->
              <div class="col-md-6 col-lg-4 col-xl-4 mb-2">
                <select-input
                  id="filter-profile-date"
                  v-model="selectedDate"
                  :placeholder="$t('any_year')"
                  :options="dateOptions"
                  erasable
                  class="mb-0"
                >
                  <template v-if="typeof selectedDate === 'string' && selectedDate.length > 4">
                    <b-form-select-option :value="selectedDate">
                      {{ selectedDate }}
                    </b-form-select-option>
                  </template>
                </select-input>
              </div>

              <!-- Park -->
              <div class="col-md-6 col-lg-4 col-xl-4 mb-2">
                <select-input
                  id="filter-profile-park"
                  v-model="selectedPark"
                  :placeholder="$t('any_park')"
                  :options="parkOptions"
                  erasable
                  class="mb-0"
                />
              </div>

              <!-- Category -->
              <div class="col-md-6 col-lg-4 col-xl-4 mb-2">
                <select-input
                  id="filter-profile-category"
                  v-model="selectedCategory"
                  :placeholder="$t('any_category')"
                  :options="categoryOptions"
                  erasable
                  class="mb-0"
                />
              </div>
            </div>
          </b-collapse>
        </b-col>
      </b-row>

      <b-row class="mb-5">
        <!-- Heatmap -->
        <b-col offset-md="2" md="8">
          <client-only>
            <div class="text-center">
              <h5>{{ $t('heatmap') }}</h5>
              <p>{{ $t('last_count_activities') }}</p>

              <calendar-heatmap
                :values="heatmap.items"
                :end-date="heatmap.endDate"
                :tooltip-unit="$t('rides')"
                :range-color="['#ebedf0', '#dbc9ed', '#b48ed9', '#9762ca', '#663399']"
                @day-click="filterDay"
              />
            </div>
          </client-only>
        </b-col>
      </b-row>

      <b-row class="mb-5">
        <b-col cols="12">
          <div class="text-center">
            <h5>{{ $t('ride_facts') }}</h5>
          </div>
        </b-col>

        <b-col v-for="(rideFact, index) in account.rideStatistic.rideFacts" :key="index" lg="3" md="4" sm="6">
          <div class="text-center mt-4">
            <p class="mb-1">
              {{ rideFact.label }}
            </p>
            <span class="text-muted">{{ rideFact.valueAsString }}</span>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <!-- Attractions -->
        <b-col lg="4">
          <div class="content-block">
            <h5>{{ $t('attractions') }}</h5>
            <p>{{ $t('counted_attractions') }}</p>

            <template v-if="account.rideStatistic.attractionRides.items.length === 0">
              <no-data />
            </template>

            <template v-else>
              <b-list-group flush>
                <template v-for="(attractionRide, index) in account.rideStatistic.attractionRides.items">
                  <b-list-group-item :key="index" class="flex-column align-items-start">
                    <div class="d-flex w-100 justify-content-between">
                      <nuxt-link class="text-truncate" :to="localePath({name: 'attractions-attraction', params: {attraction: attractionRide.attraction.fullSlug}})">
                        {{ attractionRide.attraction.name }}
                      </nuxt-link>
                    </div>

                    <small>{{ $tc('n_rides', attractionRide.rides, {'count': attractionRide.rides}) }}</small>
                  </b-list-group-item>
                </template>
              </b-list-group>

              <b-pagination
                v-if="account.rideStatistic.attractionRides.pagination.totalItems > itemsPerPage"
                v-model="attractionPage"
                :limit="3"
                align="center"
                class="align-items-center"
                :total-rows="account.rideStatistic.attractionRides.pagination.totalItems"
                :per-page="itemsPerPage"
              />
            </template>
          </div>
        </b-col>

        <!-- Parks -->
        <b-col lg="4">
          <div class="content-block">
            <h5>{{ $t('parks') }}</h5>
            <p>{{ $t('counted_parks') }}</p>

            <template v-if="account.rideStatistic.parkVisits.items.length === 0">
              <no-data />
            </template>

            <template v-else>
              <b-list-group flush>
                <template v-for="(parkVisits, index) in account.rideStatistic.parkVisits.items">
                  <b-list-group-item :key="index" class="flex-column align-items-start">
                    <div class="d-flex w-100 justify-content-between">
                      <nuxt-link class="text-truncate" :to="localePath({name: 'parks-park', params: {park: parkVisits.park.fullSlug}})">
                        {{ parkVisits.park.name }}
                      </nuxt-link>
                    </div>

                    <small>{{ $tc('n_visits', parkVisits.visits, {'count': parkVisits.visits}) }}</small>
                  </b-list-group-item>
                </template>
              </b-list-group>

              <b-pagination
                v-if="account.rideStatistic.parkVisits.pagination.totalItems > itemsPerPage"
                v-model="parkPage"
                :limit="3"
                align="center"
                class="align-items-center"
                :total-rows="account.rideStatistic.parkVisits.pagination.totalItems"
                :per-page="itemsPerPage"
              />
            </template>
          </div>
        </b-col>

        <!-- Manufacturers -->
        <b-col lg="4">
          <div class="content-block">
            <h5>{{ $t('manufacturers') }}</h5>
            <p>{{ $t('counted_manufacturers') }}</p>

            <template v-if="account.rideStatistic.parkVisits.items.length === 0">
              <no-data />
            </template>

            <template v-else>
              <b-list-group flush>
                <template v-for="(manufacturerRide, index) in account.rideStatistic.manufacturerRides.items">
                  <b-list-group-item :key="index" class="flex-column align-items-start">
                    <div class="d-flex w-100 justify-content-between">
                      <nuxt-link class="text-truncate" :to="localePath({ name: 'attractions', query: { manufacturer: manufacturerRide.manufacturer.id } })">
                        {{ manufacturerRide.manufacturer.name }}
                      </nuxt-link>
                    </div>

                    <small>{{ $tc('n_rides', manufacturerRide.totalRides, {'count': manufacturerRide.totalRides}) }}</small>
                  </b-list-group-item>
                </template>
              </b-list-group>

              <b-pagination
                v-if="account.rideStatistic.manufacturerRides.pagination.totalItems > itemsPerPage"
                v-model="manufacturerPage"
                :limit="3"
                align="center"
                class="align-items-center"
                :total-rows="account.rideStatistic.manufacturerRides.pagination.totalItems"
                :per-page="itemsPerPage"
              />
            </template>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Moment from 'moment'

export default {
  async fetch () {
    await this.loadAccount()
  },

  data () {
    return {
      itemsPerPage: 5,
      account: null,
      showFilter: Object.keys(this.$route.query).length > 0,
      dateOptions: [],
      categoryOptions: [],
      parkOptions: []
    }
  },

  computed: {
    selectedDate: {
      get () {
        return _.get(this.$route.query, 'date', null)
      },

      set (value) {
        this.updateRoute({ date: value })
      }
    },

    selectedCategory: {
      get () {
        return _.get(this.$route.query, 'category', null)
      },

      set (value) {
        this.updateRoute({ category: value })
      }
    },

    selectedPark: {
      get () {
        return _.get(this.$route.query, 'park', null)
      },

      set (value) {
        this.updateRoute({ park: value })
      }
    },

    attractionPage: {
      get () {
        return parseInt(_.get(this.$route.query, 'apage', 1))
      },

      set (value) {
        this.updateRoute({ apage: value === 1 ? null : value })
      }
    },

    parkPage: {
      get () {
        return parseInt(_.get(this.$route.query, 'ppage', 1))
      },

      set (value) {
        this.updateRoute({ ppage: value === 1 ? null : value })
      }
    },

    manufacturerPage: {
      get () {
        return parseInt(_.get(this.$route.query, 'mpage', 1))
      },

      set (value) {
        this.updateRoute({ mpage: value === 1 ? null : value })
      }
    },

    heatmap () {
      const me = this

      let endDate = new Date()
      let year = me.selectedDate

      if (typeof year === 'string' && year.length > 4) {
        year = year.substring(0, 4)
      }

      if (year !== null && parseInt(endDate.getFullYear()) !== parseInt(year)) {
        endDate = `${year}-12-31`
      }

      return {
        items: me.account.rideStatistic.heatmap.map(item => ({ date: Moment(item.date).toDate(), count: item.rides })),
        endDate
      }
    },

    breadcrumbs () {
      return [
        {
          label: this.$t('home'),
          route: 'index'
        },
        {
          label: this.account.username
        }
      ]
    }
  },

  // Mounted
  mounted () {
    this.$watch('$route.query', () => this.loadAccount())
  },

  methods: {
    updateRoute (fields) {
      this.$router.replace({
        query: _.omitBy({ ...this.$route.query, ...fields }, _.isNil)
      })
    },

    filterDay (day) {
      if (day.count > 0) {
        const date = Moment(day.date)

        this.showFilter = true
        this.selectedDate = date.format('YYYY-MM-DD')
      }
    },

    async loadAccount () {
      const me = this

      const result = await me.$graphql(me.$options.__query, {
        username: me.$route.params.username,
        locale: me.$i18n.locale,
        attractionPage: me.attractionPage,
        parkPage: me.parkPage,
        manufacturerPage: me.manufacturerPage,
        itemsPerPage: me.itemsPerPage,
        filter: {
          date: me.selectedDate,
          category: me.selectedCategory,
          park: me.selectedPark
        }
      })

      if (!result) {
        me.$nuxt.error({ statusCode: 404 })

        return
      }

      this.categoryOptions = result.account.rideStatistic.categories.map(function (category) {
        return { text: category.category.label, value: category.category.key }
      })

      this.dateOptions = result.account.rideStatistic.years.map(function (year) {
        return { text: year.year, value: year.year }
      })

      this.parkOptions = result.account.rideStatistic.parks.items.map(function (item) {
        return { text: item.park.name, value: item.park.id }
      })

      this.account = result.account
    }
  },

  head () {
    if (this.account) {
      let attractions = 0
      let rides = 0
      let length = 0

      this.account.rideStatistic.rideFacts.forEach(function (rideFact) {
        if (rideFact.key === 'totalAttractions') {
          attractions = rideFact.value
        }

        if (rideFact.key === 'totalRides') {
          rides = rideFact.value
        }

        if (rideFact.key === 'totalRideLength') {
          length = rideFact.valueAsString
        }
      })

      return this.$createHead({
        title: this.account.username,
        description: attractions > 0 ? this.$t('account_social_teaser', {
          username: this.account.username,
          attractions,
          rides,
          length
        }) : this.$t('discover_features'),
        index: false
      })
    }

    return this.$createHead({
      description: this.$t('discover_features'),
      index: false
    })
  }
}
</script>

<query>
query ($username: String!, $locale: String!, $filter: RideStatisticFilter!, $itemsPerPage: Int!, $attractionPage: Int!, $parkPage: Int!, $manufacturerPage: Int!) {
  account(id: $username) {
    username
    rideStatistic(filter: $filter) {
      heatmap {
        date
        rides
      }
      categories {
        category { key, label(locale: $locale) }
        totalRides
        totalUniqueRides
      }
      years {
        year
        totalRides
        totalUniqueRides
        totalVisits
        totalUniqueVisits
      }
      parks: parkVisits(itemsPerPage: 100) {
        items {
          park {
            id
            name
          }
        }
      }
      parkVisits(page: $parkPage, itemsPerPage: $itemsPerPage) {
        pagination { totalItems }
        items {
          park {
            id
            name
            fullSlug
          }
          visits
        }
      }
      attractionRides(page: $attractionPage, itemsPerPage: $itemsPerPage) {
        pagination { totalItems }
        items {
          attraction {
            id
            name
            fullSlug
          }
          rides
        }
      }
      manufacturerRides(page: $manufacturerPage, itemsPerPage: $itemsPerPage) {
        pagination { totalItems }
        items {
          manufacturer {
            id
            name
          }
          totalRides
          totalUniqueRides
        }
      }
      rideFacts { key, label(locale: $locale), value, valueAsString(locale: $locale) }
    }
  }
}
</query>
