<template>
  <div>
    <div class="main-content">
      <breadcrumb :items="breadcrumbs" />

      <div class="markdown-content-list">
        <markdown-text :text="$t('imprint.owner')" />
        <markdown-text :text="$t('imprint.disclaimer.warranty')" />
        <markdown-text :text="$t('imprint.disclaimer.copyright')" />
        <markdown-text :text="$t('imprint.disclaimer.external_links')" />
        <markdown-text :text="$t('imprint.list_of_origins')" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    breadcrumbs () {
      return [
        { label: this.$t('home'), route: 'index' },
        { label: this.$t('imprint') }
      ]
    }
  },

  head () {
    return this.$createHead({
      title: this.$t('imprint'),
      description: this.$t('discover_features')
    })
  }
}
</script>
