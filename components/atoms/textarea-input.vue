<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <b-form-group :label-cols-sm="labelCol" :label-for="id" :label="label">
    <b-form-textarea :id="id" v-model.trim="modelValue" :state="violations.length === 0 ? null : false" :rows="rows" />
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
      type: [String, Number],
      default: null
    },

    label: {
      type: String,
      default: null
    },

    rows: {
      type: Number,
      default: 4
    },

    violations: {
      type: Array,
      default: () => []
    },

    labelCol: {
      type: Number,
      default: 3
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
