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
      <template v-if="multiple">
        <b-form-checkbox-group
          :id="id"
          v-model="modelValue"
          :size="size"
          stacked
          :options="options"
          :state="violations.length === 0 ? null : false"
        />
      </template>

      <template v-else>
        <b-form-select
          :id="id"
          v-model="modelValue"
          :size="size"
          :multiple="false"
          :options="options"
          :state="violations.length === 0 ? null : false"
        >
          <template v-if="placeholder !== false" v-slot:first>
            <b-form-select-option :value="null">
              {{ placeholder }}
            </b-form-select-option>
          </template>

          <slot />
        </b-form-select>
      </template>

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
      type: [String, Array, Boolean, Number],
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
      default: 4
    },

    multiple: {
      type: Boolean,
      default: false
    },

    placeholder: {
      type: [String, Boolean],
      default: '-'
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
        this.$emit('input', value)
      }
    }
  }
}
</script>
