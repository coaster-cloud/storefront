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
          <template v-if="(!Array.isArray(row.value) && row.value !== null) || (Array.isArray(row.value) && row.value.length > 0)">
            <dt :key="`key-${rowIndex}`" class="col-sm-3 font-weight-normal">
              {{ row.label }}:
            </dt>
            <dd :key="`value-${rowIndex}`" class="col-sm-9 text-muted">
              <template v-if="row.type === 'timestamp'">
                {{ row.value|timestamp }}
              </template>

              <template v-else-if="row.type === 'boolean' && !row.value">
                <b-icon icon="x-circle" variant="danger" />
              </template>

              <template v-else-if="row.type === 'boolean' && row.value">
                <b-icon icon="check-circle" variant="success" />
              </template>

              <template v-else-if="row.type === 'list'">
                <div v-for="(item, listIndex) in row.value" :key="listIndex">
                  {{ item }}
                </div>
              </template>

              <template v-else-if="row.type === 'label-list'">
                <div v-for="(item, labelListIndex) in row.value" :key="labelListIndex">
                  {{ item.label }}
                </div>
              </template>

              <template v-else-if="row.type === 'label'">
                {{ row.value.label }}
              </template>

              <template v-else-if="row.type === 'link'">
                <a :href="row.value" target="_blank" rel="nofollow">{{ row.value }}</a>
              </template>

              <template v-else-if="row.type === 'route'">
                <NuxtLink :to="localePath(row.value.route)">
                  {{ row.value.label }}
                </NuxtLink>
              </template>

              <template v-else-if="row.type === 'route-list'">
                <div v-for="(item, routeListIndex) in row.value" :key="routeListIndex">
                  <NuxtLink :to="localePath(item.route)">
                    {{ item.label }}
                  </NuxtLink>
                </div>
              </template>

              <template v-else-if="row.type === 'callback'">
                {{ row.value() }}
              </template>

              <template v-else>
                {{ row.text ? row.text : row.value }}
              </template>
            </dd>
          </template>
        </template>
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
      return this.items.map(item => ({
        label: item.label,
        type: item.type.toLowerCase(),
        value: _.get(item, 'value', null),
        text: _.get(item, 'text', _.get(item, 'valueAsString', null))
      }))
    }
  }
}
</script>
