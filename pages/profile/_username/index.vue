<template>
  <div>
    <div v-if="!account" class="main-content">
      <breadcrumb :items="[{label: $t('loading')}]" />
      <skeleton-content />
    </div>

    <div v-else class="main-content">
      <breadcrumb :items="breadcrumbs" />

      <b-row v-if="selectedParkTrip !== null" class="mb-2">
        <b-col cols="12" class="text-center">
          <h3>{{ account.rideStatistic.parkTrips.items[0].park.name }} am {{ account.rideStatistic.parkTrips.items[0].date | timestamp($i18n.locale) }}</h3>
        </b-col>
      </b-row>

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
              <div v-if="selectedParkTrip === null" class="col-md-6 col-lg-4 col-xl-4 mb-2">
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
              <div v-if="selectedParkTrip === null" class="col-md-6 col-lg-4 col-xl-4 mb-2">
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
        <b-col cols="12">
          <div class="text-center">
            <h5>{{ $t('my_records') }}</h5>
          </div>
        </b-col>

        <template v-if="rideRecords.length > 0">
          <b-col v-for="(record, index) in rideRecords" :key="index" lg="3" md="4" sm="6">
            <b-card
              border-variant="primary"
              :header="record.label"
              header-bg-variant="primary"
              header-text-variant="white"
              align="center"
              class="mt-4"
            >
              <div>
                <nuxt-link class="text-truncate" :to="localePath({name: 'attractions-attraction', params: {attraction: record.attraction.fullSlug}})">
                  {{ record.attraction.name }}
                </nuxt-link>
              </div>

              <small>{{ record.attraction.attribute.valueAsString }}</small>
            </b-card>
          </b-col>
        </template>

        <template v-else>
          <b-col cols="12">
            <no-data />
          </b-col>
        </template>
      </b-row>

      <b-row class="mb-5">
        <b-col cols="12">
          <div class="text-center">
            <h5>{{ $t('my_counts') }}</h5>
          </div>
        </b-col>

        <b-col v-for="(rideFact, index) in account.rideStatistic.counts" :key="index" lg="3" md="4" sm="6">
          <div class="text-center mt-4">
            <p class="mb-1">
              {{ rideFact.label }}
            </p>
            <span class="text-muted">{{ rideFact.value }}</span>
          </div>
        </b-col>
      </b-row>

      <b-row class="mb-5">
        <b-col cols="12">
          <div class="text-center">
            <h5>{{ $t('ride_facts') }}</h5>
          </div>
        </b-col>

        <template v-if="account.rideStatistic.rideFacts.length > 0">
          <b-col v-for="(rideFact, index) in account.rideStatistic.rideFacts" :key="index" lg="3" md="4" sm="6">
            <div class="text-center mt-4">
              <p class="mb-1">
                {{ rideFact.label }}
              </p>
              <span class="text-muted">{{ rideFact.valueAsString }}</span>
            </div>
          </b-col>
        </template>

        <template v-else>
          <b-col cols="12">
            <no-data />
          </b-col>
        </template>
      </b-row>

      <b-row>
        <!-- Attractions -->
        <b-col lg="4" offset-md="1" class="mb-5">
          <div class="content-block">
            <div class="text-center">
              <h5>{{ $t('attractions') }}</h5>
            </div>

            <template v-if="account.rideStatistic.attractionRides.items.length === 0">
              <no-data />
            </template>

            <template v-else>
              <b-list-group flush>
                <list-item v-for="(attractionRide, index) in account.rideStatistic.attractionRides.items" :key="index" :title="attractionRide.attraction.name" :description="$tc('n_rides', attractionRide.totalRides, {'count': attractionRide.totalRides})">
                  <nuxt-link class="text-truncate" :to="localePath({name: 'attractions-attraction', params: {attraction: attractionRide.attraction.fullSlug}})">
                    <b-button size="sm" variant="link">
                      <b-icon icon="arrow-right-square-fill" aria-hidden="true" />
                    </b-button>
                  </nuxt-link>
                </list-item>
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
        <b-col v-if="selectedParkTrip === null" lg="4" offset-md="1" class="mb-5">
          <div class="content-block">
            <div class="text-center">
              <h5>{{ $t('parks') }}</h5>
            </div>

            <template v-if="account.rideStatistic.parkVisits.items.length === 0">
              <no-data />
            </template>

            <template v-else>
              <b-list-group flush>
                <list-item v-for="(parkVisits, index) in account.rideStatistic.parkVisits.items" :key="index" :title="parkVisits.park.name" :description="$tc('n_visits', parkVisits.totalVisits, {'count': parkVisits.totalVisits})">
                  <nuxt-link class="text-truncate" :to="localePath({name: 'parks-park', params: {park: parkVisits.park.fullSlug}})">
                    <b-button size="sm" variant="link">
                      <b-icon icon="arrow-right-square-fill" aria-hidden="true" />
                    </b-button>
                  </nuxt-link>
                </list-item>
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
        <b-col lg="4" offset-md="1" class="mb-5">
          <div class="content-block">
            <div class="text-center">
              <h5>{{ $t('manufacturers') }}</h5>
            </div>

            <template v-if="account.rideStatistic.parkVisits.items.length === 0">
              <no-data />
            </template>

            <template v-else>
              <b-list-group flush>
                <list-item v-for="(manufacturerRide, index) in account.rideStatistic.manufacturerRides.items" :key="index" :title="manufacturerRide.manufacturer.name" :description="$tc('n_rides', manufacturerRide.totalRides, {'count': manufacturerRide.totalRides})">
                  <nuxt-link class="text-truncate" :to="localePath({ name: 'manufacturers-manufacturer', params: { manufacturer: manufacturerRide.manufacturer.fullSlug } })">
                    <b-button size="sm" variant="link">
                      <b-icon icon="arrow-right-square-fill" aria-hidden="true" />
                    </b-button>
                  </nuxt-link>
                </list-item>
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

        <!-- My trips -->
        <b-col v-if="selectedParkTrip === null" lg="4" offset-md="1" class="mb-5">
          <div class="content-block">
            <div class="text-center">
              <h5>{{ $t('my_trips') }}</h5>
            </div>

            <template v-if="account.rideStatistic.parkTrips.items.length === 0">
              <no-data />
            </template>

            <template v-else>
              <b-list-group flush>
                <list-item v-for="(parkTrip, index) in account.rideStatistic.parkTrips.items" :key="index" :title="parkTrip.date | timestamp($i18n.locale)" :description="parkTrip.park.name">
                  <b-button size="sm" variant="link" @click="selectedParkTrip = `${parkTrip.date.value}-${parkTrip.park.id}`">
                    <b-icon icon="arrow-right-square-fill" aria-hidden="true" />
                  </b-button>
                </list-item>
              </b-list-group>

              <b-pagination
                v-if="account.rideStatistic.parkTrips.pagination.totalItems > itemsPerPage"
                v-model="parkTripPage"
                :limit="3"
                align="center"
                class="align-items-center"
                :total-rows="account.rideStatistic.parkTrips.pagination.totalItems"
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
        this.updateRoute({
          date: value,
          apage: null,
          ppage: null,
          mpage: null,
          tpage: null
        })
      }
    },

    selectedCategory: {
      get () {
        return _.get(this.$route.query, 'category', null)
      },

      set (value) {
        this.updateRoute({
          category: value,
          apage: null,
          ppage: null,
          mpage: null,
          tpage: null
        })
      }
    },

    selectedPark: {
      get () {
        return _.get(this.$route.query, 'park', null)
      },

      set (value) {
        this.updateRoute({
          park: value,
          apage: null,
          ppage: null,
          mpage: null,
          tpage: null
        })
      }
    },

    selectedParkTrip: {
      get () {
        return _.get(this.$route.query, 'trip', null)
      },

      set (value) {
        this.updateRoute({
          trip: value,
          park: null,
          date: null,
          apage: null,
          ppage: null,
          mpage: null,
          tpage: null
        })
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

    parkTripPage: {
      get () {
        return parseInt(_.get(this.$route.query, 'tpage', 1))
      },

      set (value) {
        this.updateRoute({ tpage: value === 1 ? null : value })
      }
    },

    rideRecords () {
      const me = this

      const records = [
        { field: 'fastestRide', label: 'fastest_ride' },
        { field: 'highestRide', label: 'highest_ride' },
        { field: 'longestRide', label: 'longest_ride' },
        { field: 'strongestRide', label: 'strongest_ride' }
      ]

      const result = []

      records.forEach(function (record) {
        const items = me.account.rideStatistic[record.field].items

        if (items.length > 0 && items[0].attraction.attribute !== null) {
          result.push({ label: me.$t(record.label), attraction: items[0].attraction })
        }
      })

      return result
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
      this.$router.push({
        query: _.omitBy({ ...this.$route.query, ...fields }, _.isNil)
      })
    },

    async loadAccount () {
      const me = this

      const result = await me.$graphql('4c3782ba-c118-4fca-ae22-fbb4a9fade00', {
        username: me.$route.params.username,
        locale: me.$i18n.locale,
        attractionPage: me.attractionPage,
        parkPage: me.parkPage,
        manufacturerPage: me.manufacturerPage,
        parkTripPage: me.parkTripPage,
        itemsPerPage: me.itemsPerPage,
        filter: {
          date: me.selectedParkTrip ? me.selectedParkTrip.substr(0, 10) : me.selectedDate,
          category: me.selectedCategory,
          park: me.selectedParkTrip ? me.selectedParkTrip.substr(11) : me.selectedPark
        }
      })

      if (!result) {
        me.$nuxt.error({ statusCode: 404 })

        return
      }

      this.categoryOptions = result.account.rideStatistic.categories.map(function (category) {
        return { text: category.category.label, value: category.category.key }
      })

      this.dateOptions = result.account.rideStatistic.years
        .map(function (year) {
          return { text: year.year, value: year.year }
        })
        .sort(function (a, b) {
          return parseInt(b.value) - parseInt(a.value)
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
