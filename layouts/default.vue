<template>
  <div>
    <b-container>
      <div class="container-shadow">
        <navigation />
        <Nuxt />
        <bottom />
      </div>
    </b-container>
  </div>
</template>

<script>
import Navigation from '~/components/organisms/navigation'
import Bottom from '~/components/organisms/bottom'

export default {
  components: {
    Navigation,
    Bottom
  }
}
</script>

<style lang="scss">
.container-shadow {
  box-shadow: 0 4px 20px 1px rgba(0, 0, 0, .06), 0 1px 4px rgba(0, 0, 0, .08);
  background-color: #fff;
}
</style>
