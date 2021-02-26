<template>
  <div>
    <div class="main-content">
      <breadcrumb :items="breadcrumbs" />

      <!-- Manufacturer add -->
      <div class="text-center mb-3">
        <action-button v-b-modal.create-manufacturer-form add-icon>
          {{ $t('add.manufacturer') }}
        </action-button>

        <create-manufacturer-form @finish="onManufacturerCreated" />
      </div>

      <manufacturers @refreshed="afterRefresh" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      totalManufacturers: 0
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
          label: `${this.$t('overview')} (${this.totalManufacturers})`
        }
      ]
    }
  },

  methods: {
    afterRefresh (result) {
      const me = this

      me.totalManufacturers = result.totalManufacturers

      if (!result.initial) {
        me.$scrollTo('.breadcrumb')
      }
    },

    onManufacturerCreated (manufacturer) {
      this.$trackEvent('Manufacturer created')
      this.$router.push(this.localePath({
        name: 'manufacturers-manufacturer',
        params: { manufacturer: manufacturer.fullSlug }
      }))
    }
  },

  head () {
    return this.$createHead({
      title: this.$t('manufacturers'),
      description: this.$t('discover_features')
    })
  }
}
</script>
