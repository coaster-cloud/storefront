<template>
  <div>
    <div class="main-content">
      <breadcrumb :items="breadcrumbs" />

      <!-- Park add -->
      <div class="text-center mb-3">
        <action-button v-b-modal.create-park-form add-icon>
          {{ $t('add.park') }}
        </action-button>

        <create-park-form @finish="onParkCreated" />
      </div>

      <parks @refreshed="afterRefresh" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      totalParks: 0
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
          label: `${this.$t('parks')} (${this.totalParks})`
        }
      ]
    }
  },

  methods: {
    afterRefresh (result) {
      const me = this

      me.totalParks = result.totalParks

      if (!result.initial) {
        me.$scrollTo('.breadcrumb')
      }
    },

    onParkCreated (park) {
      this.$trackEvent('Park created')
      this.$router.push(this.localePath({
        name: 'parks-park',
        params: { park: park.fullSlug }
      }))
    }
  },

  head () {
    return this.$createHead({
      title: this.$t('parks'),
      description: this.$t('discover_features')
    })
  }
}
</script>
