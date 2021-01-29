<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <b-form-datepicker
    :value="value"
    :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit', weekday: 'short' }"
    :locale="$store.state.account.locale"
    @input="update"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },

  methods: {
    update (value) {
      this.$emit('input', value)
    }
  }
}
</script>
