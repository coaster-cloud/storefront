<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <b-list-group-item class="d-flex justify-content-between align-items-center">
    <div class="flex-column align-items-start">
      <div class="d-flex w-100 justify-content-between">
        <strong class="text-truncate">
          {{ title }}
        </strong>
      </div>

      <small>{{ description }}</small>
    </div>

    <slot />
  </b-list-group-item>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null
    },

    description: {
      type: String,
      default: null
    }
  }
}
</script>
