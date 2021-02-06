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
      <dl class="row">
        <template v-for="(row, rowIndex) in normalizedItems">
          <dt :key="`key-${rowIndex}`" class="col-sm-3 font-weight-normal">
            {{ row.label }}:
          </dt>
          <dd :key="`value-${rowIndex}`" class="col-sm-9 text-muted">
            <!-- Timestamp -->
            <template v-if="row.type === 'timestamp'">
              {{ row.value|timestamp }}
            </template>

            <!-- Boolean: False -->
            <template v-else-if="row.type === 'boolean' && !row.value">
              <b-icon icon="x-circle" variant="danger" />
            </template>

            <!-- Boolean: True -->
            <template v-else-if="row.type === 'boolean' && row.value">
              <b-icon icon="check-circle" variant="success" />
            </template>

            <!-- Text List -->
            <template v-else-if="row.type === 'list'">
              <div v-for="(item, listIndex) in row.value" :key="listIndex">
                {{ item }}
              </div>
            </template>

            <!-- Label List -->
            <template v-else-if="row.type === 'label-list'">
              <div v-for="(item, labelListIndex) in row.value" :key="labelListIndex">
                {{ item.label }}
              </div>
            </template>

            <!-- Label -->
            <template v-else-if="row.type === 'label'">
              {{ row.value.label }}
            </template>

            <!-- External Link -->
            <template v-else-if="row.type === 'link'">
              <a :href="row.value" target="_blank" rel="nofollow">{{ row.value }}</a>
            </template>

            <!-- Internal Route -->
            <template v-else-if="row.type === 'route'">
              <nuxt-link :to="localePath(row.value.route)">
                {{ row.value.label }}
              </nuxt-link>
            </template>

            <!-- Internal Route List -->
            <template v-else-if="row.type === 'route-list'">
              <div v-for="(item, routeListIndex) in row.value" :key="routeListIndex">
                <nuxt-link :to="localePath(item.route)">
                  {{ item.label }}
                </nuxt-link>
              </div>
            </template>

            <!-- Callback -->
            <template v-else-if="row.type === 'callback'">
              {{ row.value() }}
            </template>

            <!-- Text -->
            <template v-else>
              {{ row.text ? row.text : row.value }}
            </template>
          </dd>
        </template>

        <slot />
      </dl>
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
      return this.items
        .filter(item => Array.isArray(item.value) ? item.value.length > 0 : (item.value !== null && item.value !== undefined))
        .map(item => ({
          label: item.label,
          type: item.type.toLowerCase(),
          value: _.get(item, 'value', null),
          text: _.get(item, 'text', _.get(item, 'valueAsString', null))
        }))
    }
  }
}
</script>
