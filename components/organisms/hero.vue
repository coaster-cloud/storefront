<template>
  <div class="hero">
    <template v-if="isClient">
      <vue-flux :options="{ autoplay: true, aspectRatio: '5:2' }" :images="heroImages" :transitions="['blinds3d', 'Swipe', 'Zip', 'Kenburn']">
        <template v-slot:preloader>
          <flux-preloader />
        </template>

        <template v-slot:controls>
          <flux-controls />
        </template>
      </vue-flux>
    </template>
    <template v-else>
      <img class="img-fluid" :src="heroImages[0]" :alt="heroImages[0]">
    </template>
  </div>
</template>

<script>
import { VueFlux, FluxControls, FluxPreloader } from 'vue-flux/dist-ssr/vue-flux.umd.min.js'
import 'vue-flux/dist-ssr/vue-flux.css'

export default {
  components: {
    VueFlux,
    FluxControls,
    FluxPreloader
  },

  data () {
    return {
      isClient: false
    }
  },

  computed: {
    heroImages () {
      return [
        require('assets/images/hero/black_mamba.jpg')
      ]
    }
  },

  mounted () {
    this.isClient = true
  }
}
</script>
