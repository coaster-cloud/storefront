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
    <template v-for="(number, index) in max">
      <b-icon :key="index" :icon="number <= value ? iconFull : iconEmpty" aria-hidden="true" />
    </template>
  </div>
</template>

<script>
export default {
  name: 'Rating',

  // Properties
  props: {
    value: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      default: 5
    },
    iconEmpty: {
      type: String,
      default: 'star'
    },
    iconFull: {
      type: String,
      default: 'star-fill'
    }
  }
}
</script>
