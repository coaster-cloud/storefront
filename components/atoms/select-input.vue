<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <b-form-group :label-cols-sm="labelCol" :label-for="id" :label="label" :description="description">
    <template v-if="multiple">
      <b-form-checkbox-group :id="id" v-model="modelValue" stacked :options="options" :state="violations.length === 0 ? null : false" />
    </template>

    <template v-else>
      <b-form-select :id="id" v-model="modelValue" :multiple="false" :options="options" :state="violations.length === 0 ? null : false" />
    </template>

    <b-form-invalid-feedback v-for="(violation, index) in violations" :key="index" :state="false">
      {{ violation }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },

    value: {
      type: [String, Array],
      required: true
    },

    label: {
      type: String,
      default: null
    },

    description: {
      type: String,
      default: null
    },

    options: {
      type: Array,
      default: () => []
    },

    violations: {
      type: Array,
      default: () => []
    },

    labelCol: {
      type: Number,
      default: 3
    },

    multiple: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    modelValue: {
      get () {
        return this.value
      },

      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
