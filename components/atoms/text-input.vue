<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <b-form-group :label-cols-sm="label ? labelCol : null" :label-for="id" :label="label" :description="description">
    <b-input-group :size="size">
      <b-form-input
        :id="id"
        v-model.trim="modelValue"
        :size="size"
        :type="type"
        :state="violations.length === 0 ? null : false"
        :number="type === 'number'"
        :step="step"
        :disabled="disabled"
        :debounce="lazy ? 500 : 0"
        :placeholder="placeholder"
        no-wheel
        trim
      />

      <b-input-group-append v-if="append">
        <b-input-group-text>{{ append }}</b-input-group-text>
      </b-input-group-append>

      <b-input-group-append v-if="erasable && value !== null">
        <b-button :size="size" variant="primary" @click="modelValue = null">
          <b-icon icon="backspace" aria-hidden="true" />
        </b-button>
      </b-input-group-append>
    </b-input-group>
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

    size: {
      type: String,
      default: 'md'
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

    step: {
      type: [String, Number],
      default: 'any'
    },

    disabled: {
      type: Boolean,
      default: false
    },

    lazy: {
      type: Boolean,
      default: false
    },

    append: {
      type: String,
      default: null
    },

    placeholder: {
      type: String,
      default: null
    },

    erasable: {
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

        if (typeof value === 'number' && this.step === 1) {
          value = parseInt(value)
        }

        this.$emit('input', value)
      }
    }
  }
}
</script>
