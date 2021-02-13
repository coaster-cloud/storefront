<template>
  <div>
    <div class="main-content">
      <breadcrumb :items="breadcrumbs" />

      <attractions @refreshed="afterRefresh" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
          label: `${this.$t('overview')} (${this.totalAttractions})`
        }
      ]
    }
  },

  methods: {
    afterRefresh (result) {
      const me = this

      me.totalAttractions = result.totalAttractions

      if (!result.initial) {
        me.$scrollTo('.breadcrumb')
      }
    }
  },

  head () {
    return this.$createHead({
      title: this.$t('attractions'),
      description: this.$t('discover_features')
    })
  }
}
</script>
