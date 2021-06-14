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

      <attractions :park-id="park.id" :fixed-states="['out_of_operation', 'not_existing']" @refreshed="afterRefresh" />
    </div>
  </div>
</template>

<script>
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
          label: `${this.$t('former_attractions')} (${this.totalAttractions})`
        }
      ]
    }
  },

  methods: {
    async loadPark () {
      const me = this

      const result = await me.$graphql('71a626c3-b3c8-49e8-8892-ce5ee3e52823', {
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
      this.$trackEvent('Park created')
      this.$router.push(this.localePath({
        name: 'attractions-attraction',
        params: { attraction: attraction.fullSlug }
      }))
    }
  },

  head () {
    if (this.park) {
      return this.$createHead({
        title: this.park.name,
        description: this.park.shortDescription ?? this.$t('generic_park_description', { park: this.park.name }),
        image: this.park.images.length > 0 ? this.park.images[0].large : null
      })
    }

    return {}
  }
}
</script>
