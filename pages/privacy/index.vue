<template>
  <div>
    <div class="main-content">
      <!-- <breadcrumb :items="breadcrumbs" /> -->

      <div class="markdown-content-list">
        <markdown-text :text="$t('privacy.preamble')" />
        <markdown-text :text="$t('privacy.owner')" />
        <markdown-text :text="$t('privacy.glossary')" />
        <markdown-text :text="$t('privacy.user_rights')" />
        <markdown-text :text="$t('privacy.cookies')" />
        <markdown-text :text="$t('privacy.signup')" />
        <markdown-text :text="$t('privacy.contribution')" />
        <markdown-text :text="$t('privacy.image_upload')" />
        <markdown-text :text="$t('privacy.log_file')" />
        <markdown-text :text="$t('privacy.sentry')" />
        <markdown-text :text="$t('privacy.webfonts')" />
        <markdown-text :text="$t('privacy.cloudflare')" />
        <markdown-text :text="$t('privacy.youtube')" />
        <markdown-text :text="$t('privacy.analytics')" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head () {
    return this.$createHead({
      title: this.$t('privacy'),
      description: this.$t('meta.description')
    })
  }
}
</script>
