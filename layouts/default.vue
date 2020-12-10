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
@import "~/assets/css/ci.scss";
@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';
@import '~/assets/css/font.scss';
@import '~/assets/css/flags.scss';

body {
  background-color: #eee;
}

h1,
h2,
h3,
h4,
h5,
.modal-title {
  color: $primary;
}

.container-shadow {
  box-shadow: 0 4px 20px 1px rgba(0, 0, 0, .06), 0 1px 4px rgba(0, 0, 0, .08);
  background-color: #fff;
}
</style>
