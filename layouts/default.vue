<template>
  <div>
    <loading
      :active.sync="$store.getters['common/isLoading']"
      :is-full-page="true"
      loader="dots"
      color="#4A4090"
      background-color="#D3D3D3"
      :opacity="0.7"
    />

    <b-container>
      <div class="container-shadow">
        <navigation />
        <Nuxt />
        <bottom />
      </div>
    </b-container>

    <login-form />
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import Navigation from '~/components/organisms/navigation'
import Bottom from '~/components/organisms/bottom'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
  components: {
    Navigation,
    Bottom,
    Loading
  }
}
</script>

<style lang="scss">
.container-shadow {
  box-shadow: 0 4px 20px 1px rgba(0, 0, 0, .06), 0 1px 4px rgba(0, 0, 0, .08);
  background-color: #fff;
}
</style>
