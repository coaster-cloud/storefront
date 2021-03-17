<template>
  <div>
    <div class="main-content">
      <breadcrumb :items="breadcrumbs" />

      <b-row>
        <template v-if="$store.getters['common/isLoading']">
          <b-skeleton-table :table-props="{ borderless: true }" :rows="20" :columns="5" />
        </template>

        <template v-else>
          <b-col md="8" order="2" order-md="1">
            <div class="text-center">
              <h5>{{ $t('last_changes') }}</h5>
            </div>

            <no-data v-if="items.length === 0" />

            <b-table
              v-else
              :fields="tableFields"
              borderless
              small
              responsive="sm"
              :items="items"
            >
              <template #cell(date)="data">
                {{ data.value | timestamp($i18n.locale) }}
              </template>

              <template #cell(resource)="data">
                <div>
                  <nuxt-link
                    v-if="data.item.event.resource.__typename === 'Attraction'"
                    :to="localePath({name: 'attractions-attraction', params: {attraction: data.item.event.resource.fullSlug}})"
                  >
                    {{ data.item.event.resource.name }}
                  </nuxt-link>

                  <nuxt-link
                    v-if="data.item.event.resource.__typename === 'Park'"
                    :to="localePath({name: 'parks-park', params: {park: data.item.event.resource.fullSlug}})"
                  >
                    {{ data.item.event.resource.name }}
                  </nuxt-link>

                  <nuxt-link
                    v-if="data.item.event.resource.__typename === 'Manufacturer'"
                    :to="localePath({name: 'manufacturers-manufacturer', params: {manufacturer: data.item.event.resource.fullSlug}})"
                  >
                    {{ data.item.event.resource.name }}
                  </nuxt-link>
                </div>

                <div>
                  <small>{{ $t(eventMapping[data.item.event.type].text) }}</small>
                </div>
              </template>

              <template #cell(contributor)="data">
                <nuxt-link :to="localePath({name: 'profile-username', params: {username: data.value}})">
                  {{ data.value }}
                </nuxt-link>
              </template>

              <template #cell(actions)="data">
                <b-button size="sm" variant="light" @click="data.toggleDetails">
                  {{ data.detailsShowing ? $t('hide_details') : $t('show_details') }}
                </b-button>
              </template>

              <template #row-details="data">
                <b-card>
                  <pre class="patch m-0">{{ JSON.stringify(JSON.parse(data.item.event.payload), null, 2) }}</pre>
                </b-card>
              </template>
            </b-table>

            <b-col cols="12">
              <b-pagination
                v-model="selectedPage"
                :limit="3"
                align="center"
                class="align-items-center"
                :total-rows="totalEvents"
                :per-page="itemsPerPage"
              />
            </b-col>
          </b-col>

          <b-col md="4" order="1" order-md="2" class="mb-5 mb-md-0 left-separator">
            <div class="content-block">
              <div class="text-center">
                <h5>{{ $t('top_contributor') }}</h5>
              </div>

              <div class="list-group">
                <div v-for="(contributor, index) in contributors" :key="index" class="list-group-item d-flex justify-content-between align-items-center no-border">
                  <div>
                    {{ index + 1 }}.
                    <nuxt-link :to="localePath({name: 'profile-username', params: {username: contributor.username}})">
                      {{ contributor.username }}
                    </nuxt-link>
                  </div>
                  <span class="badge badge-primary badge-pill">{{ contributor.totalContributions }}</span>
                </div>
              </div>
            </div>
          </b-col>
        </template>
      </b-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  async fetch () {
    await this.loadEvents()
  },

  data () {
    return {
      events: [],
      contributors: [],
      itemsPerPage: 20,
      totalEvents: 0,
      openEvent: null,
      tableFields: [
        { key: 'date', label: this.$t('date'), class: 'align-middle' },
        { key: 'resource', label: this.$t('change') },
        { key: 'contributor', label: this.$t('contributor'), class: 'align-middle' },
        { key: 'actions', label: this.$t('actions'), class: 'text-right' }
      ],
      eventMapping: {
        AttractionCreated: { text: 'attraction_created' },
        ParkCreated: { text: 'park_created' },
        ManufacturerCreated: { text: 'manufacturer_created' },
        LegacyAttractionAdded: { text: 'attraction_created' },
        LegacyParkAdded: { text: 'park_created' },

        AttractionDeleted: { text: 'attraction_deleted' },
        ParkDeleted: { text: 'park_deleted' },
        ManufacturerDeleted: { text: 'manufacturer_deleted' },
        LegacyAttractionDeleted: { text: 'attraction_deleted' },
        LegacyParkDeleted: { text: 'park_deleted' },

        AttractionUpdated: { text: 'attraction_updated' },
        ParkUpdated: { text: 'park_updated' },
        ManufacturerUpdated: { text: 'manufacturer_updated' },
        LegacyAttractionModified: { text: 'attraction_updated' },
        LegacyParkModified: { text: 'park_updated' }
      }
    }
  },

  computed: {
    selectedPage: {
      get () {
        return parseInt(_.get(this.$route.query, 'page', 1))
      },

      set (value) {
        this.updateRoute({ page: value === 1 ? null : value })
      }
    },

    selectedReference: {
      get () {
        return _.get(this.$route.query, 'reference', null)
      },

      set (value) {
        this.updateRoute({ reference: value })
      }
    },

    items () {
      return this.events.map(function (item) {
        return {
          date: item.createdAt,
          contributor: item.contributor.username,
          event: item
        }
      })
    },

    breadcrumbs () {
      return [
        {
          label: this.$t('home'),
          text: this.$t('home'),
          route: 'index'
        },
        {
          label: this.$t('activities'), text: this.$t('activities')
        }
      ]
    }
  },

  mounted () {
    this.$watch('$route.query', () => this.loadEvents())
  },

  methods: {
    updateRoute (fields) {
      this.$router.replace({
        query: _.omitBy({ ...this.$route.query, ...fields }, _.isNil)
      })

      this.$scrollTo('.breadcrumb')
    },

    async loadEvents () {
      const me = this

      const filter = {
        type: Object.keys(me.eventMapping)
      }

      if (me.selectedReference) {
        filter.reference = me.selectedReference
      }

      const result = await me.$graphql(me.$options.__query, {
        itemsPerPage: me.itemsPerPage,
        page: me.selectedPage,
        filter
      })

      this.contributors = result.accounts.items
      this.events = result.events.items
      this.totalEvents = result.events.pagination.totalItems
    }
  },

  head () {
    return this.$createHead({
      title: this.$t('activities'),
      description: this.$t('discover_features')
    })
  }
}
</script>

<style lang="scss" scoped>
.no-border {
  border: none;
}
</style>

<query>
query ($itemsPerPage: Int!, $page: Int!, $filter: EventFilter!) {
  events (page: $page, itemsPerPage: $itemsPerPage, filter: $filter) {
    pagination {
        totalItems
    }
    items {
      id
      type
      contributor { username }
      payload
      createdAt { format, value }
      resource {
        __typename
        ... on Park {
          name
          fullSlug
        }
        ... on Attraction {
          name
          fullSlug
        }
        ... on Manufacturer {
          name
          fullSlug
        }
      }
    }
  }
  accounts(sort: TOTAL_CONTRIBUTIONS_DESC, itemsPerPage: 20) {
    items {
      username
      totalContributions
    }
  }
}
</query>

<style lang="scss" scoped>
.patch {
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
</style>
