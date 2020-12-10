<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="compiledText" />
</template>

<script>
export default {
  name: 'MarkdownText',

  props: {
    text: {
      type: String,
      required: true
    }
  },

  computed: {
    compiledText () {
      return this.$markdown(this.text)
    }
  }
}
</script>
