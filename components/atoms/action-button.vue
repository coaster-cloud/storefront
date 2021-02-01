<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <b-button v-show="$store.state.common.editMode" size="sm" variant="light" class="mb-1" :disabled="disabled === true || $store.getters['account/hasToken'] === false">
    <b-icon v-if="addIcon" icon="plus-square" aria-hidden="true" />
    <b-icon v-if="modifyIcon" icon="pencil-square" aria-hidden="true" />
    <b-icon v-if="deleteIcon" icon="x-square" aria-hidden="true" />

    <template v-if="!iconOnly">
      <slot />
    </template>
  </b-button>
</template>

<script>
export default {
  props: {
    addIcon: {
      type: Boolean,
      default: false
    },

    modifyIcon: {
      type: Boolean,
      default: false
    },

    deleteIcon: {
      type: Boolean,
      default: false
    },

    iconOnly: {
      type: Boolean,
      default: false
    },

    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
