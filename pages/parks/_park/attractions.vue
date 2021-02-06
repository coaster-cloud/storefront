<template>
  <div>
    <div v-if="!park" class="main-content">
      <breadcrumb :items="[{label: $t('loading')}]" />
      <skeleton-card-list />
    </div>

    <div v-else class="main-content">
      <breadcrumb :items="breadcrumbs" />

      <!-- Attraction add -->
      <div class="text-center mb-3">
        <action-button v-b-modal.create-attraction-form add-icon>
          {{ $t('add.attraction') }}
        </action-button>

        <create-attraction-form :park-id="park.id" @finish="onAttractionCreated" />
      </div>

      <attractions :park-id="park.id" @refreshed="afterRefresh" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  async fetch () {
    await this.loadPark()
  },

  data () {
    return {
      park: null,
      totalAttractions: 0
    }
  },

  computed: {
    breadcrumbs () {
      return [
        {
          label: this.$t('home'),
          route: 'index'
        },
        {
          label: this.$t('parks'),
          route: 'parks'
        },
        {
          label: this.park.name,
          route: { name: 'parks-park', params: { park: this.park.fullSlug } }
        },
        {
          label: `${this.$t('overview')} (${this.totalAttractions})`
        }
      ]
    }
  },

  methods: {
    async loadPark () {
      const me = this

      const result = await me.$graphql(me.$options.__query, {
        parkSlug: me.$route.params.park,
        locale: me.$i18n.locale
      })

      if (!result.park) {
        me.$nuxt.error({ statusCode: 404 })

        return
      }

      this.park = result.park
    },

    afterRefresh (result) {
      const me = this

      me.totalAttractions = result.totalAttractions

      if (!result.initial) {
        me.$scrollTo('.breadcrumb')
      }
    },

    onAttractionCreated (attraction) {
      // this.$trackEvent('Park created');
      this.$router.push(this.localePath({
        name: 'attractions-attraction',
        params: { attraction: attraction.fullSlug }
      }))
    }
  },

  head () {
    return this.$createHead({
      title: _.get(this.park, 'name', null),
      description: _.get(this.park, 'shortDescription', null)
    })
  }
}
</script>

<query>
query ($parkSlug: String!, $locale: String!) {
    park(id: $parkSlug) {
        id
        name
        shortDescription(locale: $locale)
        fullSlug
    }
}
</query>
