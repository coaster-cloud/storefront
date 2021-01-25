<template>
  <div>
    <div v-if="account" class="main-content">
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
                <select-filter v-model="selectedDate" :placeholder="$t('any_year')" :options="dateOptions">
                  <template v-if="typeof selectedDate === 'string' && selectedDate.length > 4">
                    <b-form-select-option :value="selectedDate">
                      {{ selectedDate }}
                    </b-form-select-option>
                  </template>
                </select-filter>
              </div>

              <!-- Park -->
              <div class="col-md-6 col-lg-4 col-xl-4 mb-2">
                <select-filter v-model="selectedPark" :placeholder="$t('any_park')" :options="parkOptions" />
              </div>

              <!-- Category -->
              <div class="col-md-6 col-lg-4 col-xl-4 mb-2">
                <select-filter v-model="selectedCategory" :placeholder="$t('any_category')" :options="categoryOptions" />
              </div>
            </div>
          </b-collapse>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="8">
          <!-- Heatmap -->
          <client-only>
            <div class="content-block">
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

        <b-col md="4" />
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
    return this.$createHead({
      title: this.account?.username ?? null
    })
  }
}
</script>

<query>
query ($username: String!, $locale: String!, $filter: RideStatisticFilter!) {
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
    }
  }
}
</query>
