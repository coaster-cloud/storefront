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
    <template v-if="isClient">
      <number :from="from" :to="to" :duration="5" easing="Power1.easeOut" />
    </template>
    <template v-else>
      <span>{{ from }}</span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    from: {
      type: Number,
      default: 0
    },
    to: {
      type: Number,
      required: true
    }
  },

  data () {
    return {
      isClient: false
    }
  },

  mounted () {
    this.isClient = true
  }
}
</script>
