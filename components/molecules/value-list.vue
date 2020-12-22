<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <div class="mb-3">
    <template v-if="items.length === 0">
      <no-data />
    </template>

    <template v-else>
      <b-list-group>
        <template v-for="(item, index) in normalizedItems">
          <b-list-group-item :key="index" :class="item.class" class="d-flex justify-content-between align-items-center">
            {{ item.text }}
          </b-list-group-item>
        </template>
      </b-list-group>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import NoData from '~/components/atoms/no-data'

export default {
  components: {
    NoData
  },

  props: {
    items: {
      type: Array,
      required: true
    }
  },

  computed: {
    normalizedItems () {
      return this.items.map(item => ({
        text: item.text,
        class: _.get(item, 'class', null)
      }))
    }
  }
}
</script>
