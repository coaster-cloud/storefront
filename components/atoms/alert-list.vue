<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <ul v-if="values.length > 0" class="alert alert-danger">
    <li v-for="(value, index) in values" :key="index">
      {{ value }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    values: {
      type: Array,
      default: () => []
    }
  }
}
</script>
