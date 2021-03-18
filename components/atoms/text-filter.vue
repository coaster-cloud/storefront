<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <b-input-group :size="size">
    <b-form-input
      :size="size"
      :type="type"
      :placeholder="placeholder"
      :value="value"
      :formatter="formatter"
      debounce="500"
      @update="(value) => $emit('input', value.trim())"
    />

    <b-input-group-append v-if="append.length > 0">
      <b-input-group-text>{{ append }}</b-input-group-text>
    </b-input-group-append>

    <b-input-group-append v-if="value !== null && value.length > 0">
      <b-button :size="size" variant="primary" @click="$emit('input', null)">
        <b-icon icon="backspace" aria-hidden="true" />
      </b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: ''
    },

    value: {
      type: [String, Number],
      default: null
    },

    size: {
      type: String,
      default: 'md'
    },

    append: {
      type: String,
      default: ''
    },

    type: {
      type: String,
      default: 'text'
    },

    formatter: {
      type: Function,
      default: value => value
    }
  }
}
</script>
