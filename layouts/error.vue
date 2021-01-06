<template>
  <div>
    <div class="main-content">
      <div class="error-page text-center">
        <h1 class="text-60">
          {{ error.statusCode }}
        </h1>

        <p class="mb-5 text-muted text-18">
          <markdown-text :text="error.statusCode === 404 ? $t('error.404_message') : $t('error.message')" />
        </p>

        <a href="/" class="btn btn-lg btn-primary btn-rounded">{{ $t('go_home') }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true
    }
  },

  layout: 'error',

  head () {
    return this.$createHead({
      title: this.$t('error')
    })
  }
}
</script>
