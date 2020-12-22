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
    <b-form-select :size="size" :value="value" :options="options" @change="(value) => $emit('input', typeof value === 'string' ? value.trim() : value)">
      <template v-if="placeholder.length > 0" v-slot:first>
        <b-form-select-option :value="null">
          {{ placeholder }}
        </b-form-select-option>
      </template>
      <slot />
    </b-form-select>

    <b-input-group-append v-if="value !== null">
      <b-button :size="size" variant="primary" @click="$emit('input', null)">
        <b-icon icon="backspace" aria-hidden="true" />
      </b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },

    placeholder: {
      type: String,
      default: ''
    },

    value: {
      type: [String, Number, Array],
      default: null
    },

    size: {
      type: String,
      default: 'md'
    }
  }
}
</script>
