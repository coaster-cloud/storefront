<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <div>
    <template v-if="images.length > 0">
      <template v-if="isClient">
        <b-carousel v-model="slide" :interval="4000" controls img-width="512" img-height="288">
          <template v-for="(image, index) in images">
            <NuxtLink :key="index" :to="localePath(galleryRoute)">
              <b-carousel-slide :img-src="image.middle" />
            </NuxtLink>
          </template>
        </b-carousel>
      </template>

      <template v-else>
        <NuxtLink :to="localePath(galleryRoute)">
          <img :src="images[0].middle" class="img-fluid">
        </NuxtLink>
      </template>
    </template>

    <!-- Fallback image -->
    <template v-else>
      <router-link :to="localePath(galleryRoute)">
        <img src="~/assets/images/placeholder.middle.jpg" class="img-fluid">
      </router-link>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      default: () => []
    },

    galleryRoute: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      slide: 0,
      isClient: false
    }
  },

  mounted () {
    this.isClient = true
  }
}
</script>
