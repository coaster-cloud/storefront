<template>
  <div>
    <div class="main-content">
      <breadcrumb :items="breadcrumbs" />

      <b-row>
        <b-col md="8">
          <b-skeleton-table v-if="$store.getters['common/isLoading']" :rows="20" :columns="4" />

          <no-data v-else-if="items.length === 0" />

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
                <NuxtLink
                  v-if="data.item.event.resource.__typename === 'Attraction'"
                  :to="localePath({name: 'parks-park-attractions-attraction', params: {attraction: data.item.event.resource.slug, park: data.item.event.resource.park.slug}})"
                >
                  {{ data.item.event.resource.name }}
                </NuxtLink>

                <NuxtLink
                  v-if="data.item.event.resource.__typename === 'Park'"
                  :to="localePath({name: 'parks-park', params: {park: data.item.event.resource.slug}})"
                >
                  {{ data.item.event.resource.name }}
                </NuxtLink>

                <div v-if="data.item.event.resource.__typename === 'Manufacturer'">
                  {{ data.item.event.resource.name }}
                </div>
              </div>

              <div>
                <small>{{ $t(eventMapping[data.item.event.type].text) }}</small>
              </div>
            </template>

            <template #cell(contributor)="data">
              <NuxtLink :to="localePath({name: 'profile-username', params: {username: data.value}})">
                {{ data.value }}
              </NuxtLink>
            </template>

            <template #cell(actions)="data">
              <b-button size="sm" variant="light" @click="data.toggleDetails">
                {{ data.detailsShowing ? $t('hide_details') : $t('show_details') }}
              </b-button>
            </template>

            <template #row-details="data">
              <b-card>
                <pre class="m-0">{{ JSON.stringify(JSON.parse(data.item.event.payload), null, 2) }}</pre>
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

        <b-col md="4" class="mb-5 mb-md-0 left-separator">
          <div class="content-block">
            <h5>{{ $t('top_contributor') }}</h5>

            <!--
            <div class="list-group">
              <div class="list-group-item d-flex justify-content-between align-items-center no-border" v-for="(contributor, index) in contributors" :key="index">
                <router-link :to="{name: 'app_account_showprofile', params: {account: contributor.username.toLowerCase()}}">{{ contributor.username }}</router-link>
                <span class="badge badge-primary badge-pill">{{ contributor.total }}</span>
              </div>
            </div>
            -->
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
        ManufacturerDeleted: { text: 'manufacturer_updated' },
        LegacyAttractionDeleted: { text: 'attraction_deleted' },
        LegacyParkDeleted: { text: 'park_deleted' },

        AttractionUpdated: { text: 'attraction_updated' },
        ParkUpdated: { text: 'park_updated' },
        ManufacturerUpdated: { text: 'manufacturer_deleted' },
        LegacyAttractionModified: { text: 'attraction_updated' },
        LegacyParkModified: { text: 'park_updated' }
      }
    }
  },

  computed: {
    selectedPage: {
      get () {
        return _.get(this.$route.query, 'page', 1)
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

      this.events = result.events.items
      this.totalEvents = result.events.pagination.totalItems
    }
  },

  head () {
    return this.$createHead({
      title: this.$t('activities'),
      description: null
    })
  }
}
</script>

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
          slug
        }
        ... on Attraction {
          name
          slug
          park { slug }
        }
        ... on Manufacturer {
          name
        }
      }
    }
  }
}
</query>
