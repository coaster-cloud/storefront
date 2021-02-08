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
    <b-form-input
      :id="id"
      v-model.trim="modelValue"
      :type="type"
      :state="violations.length === 0 ? null : false"
      :formatter="formatter"
      :disabled="disabled"
    />
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

    description: {
      type: String,
      default: null
    },

    type: {
      type: String,
      default: 'text'
    },

    violations: {
      type: Array,
      default: () => []
    },

    labelCol: {
      type: Number,
      default: 4
    },

    formatter: {
      type: Function,
      default: value => value
    },

    disabled: {
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
        if (typeof value === 'string' && value.trim().length === 0) {
          value = null
        }

        this.$emit('input', value)
      }
    }
  }
}
</script>
