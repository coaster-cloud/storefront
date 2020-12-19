<template>
  <div>
    <div class="main-content">
      <breadcrumb :items="breadcrumbs" />
      <parks @refreshed="afterRefresh" />
    </div>
  </div>
</template>

<script>
import Parks from '~/components/organisms/parks'

export default {
  components: {
    Parks
  },

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
          label: `${this.$t('overview')} (${this.totalParks})`
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
    }
  },

  head () {
    return this.$createHead({
      title: this.$t('parks'),
      description: this.$t('meta.description')
    })
  }
}
</script>
