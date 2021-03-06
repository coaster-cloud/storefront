<template>
  <div>
    <div class="main-content">
      <breadcrumb :items="breadcrumbs" />

      <b-row>
        <b-col sm="8">
          <markdown-text :text="$t('help.count_attraction')" />
        </b-col>

        <b-col sm="4">
          <img src="~/assets/images/help/count_attraction.png" class="img-fluid">
        </b-col>
      </b-row>

      <b-row class="mt-4">
        <b-col sm="8">
          <markdown-text :text="$t('help.rate_attraction')" />
        </b-col>

        <b-col sm="4">
          <img src="~/assets/images/help/rate_attraction.png" class="img-fluid">
        </b-col>
      </b-row>

      <b-row class="mt-4">
        <b-col sm="8">
          <markdown-text :text="$t('help.update_resource')" />
        </b-col>

        <b-col sm="4">
          <img src="~/assets/images/help/update_resource.png" class="img-fluid">
        </b-col>
      </b-row>

      <b-row class="mt-4">
        <b-col sm="8">
          <markdown-text :text="$t('help.create_resource')" />
        </b-col>

        <b-col sm="4">
          <img src="~/assets/images/help/create_resource.png" class="img-fluid">
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    breadcrumbs () {
      return [
        { label: this.$t('home'), route: 'index' },
        { label: this.$t('help') }
      ]
    }
  },

  head () {
    return this.$createHead({
      title: this.$t('help'),
      description: this.$t('discover_features')
    })
  }
}
</script>
