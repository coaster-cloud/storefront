<template>
  <div>
    <div class="main-content">
      <!-- <breadcrumb :items="breadcrumbs" /> -->

      <div class="markdown-content-list">
        <markdown-text :text="$t('terms.main')" />
        <markdown-text :text="$t('terms.fundamentals')" />
        <markdown-text :text="$t('terms.responsibility')" />
        <markdown-text :text="$t('terms.changes')" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head () {
    return this.$createHead({
      title: this.$t('terms'),
      description: this.$t('meta.description')
    })
  }
}
</script>
