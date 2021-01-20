<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <b-modal
    id="update-park-attributes-form"
    size="xs"
    :title="$t('modify.additional_information')"
    no-stacking
    @show="load"
  >
    <template v-for="(attribute, index) in parkAttributes">
      <template v-if="attribute.type === 'choice'">
        <select-input
          :id="`update-park-attributes-form-${attribute.key}`"
          :key="index"
          v-model="attribute.value"
          :label="attribute.label"
          :violations="violations.filter(v => v.field === `[setAttributes][${index}][value]`).map(v => v.message)"
          :options="attribute.choices.map(i => ({value: i.key, text: i.label}))"
        />
      </template>

      <template v-else-if="attribute.type === 'boolean'">
        <select-input
          :id="`update-park-attributes-form-${attribute.key}`"
          :key="index"
          v-model="attribute.value"
          :label="attribute.label"
          :violations="violations.filter(v => v.field === `[setAttributes][${index}][value]`).map(v => v.message)"
          :options="[{value: true, text: $t('yes')}, {value: false, text: $t('no')}]"
        />
      </template>

      <template v-else>
        <text-input
          :id="`update-park-attributes-form-${attribute.key}`"
          :key="index"
          v-model="attribute.value"
          :label="attribute.label"
          :formatter="getTextFormatter(attribute)"
          :violations="violations.filter(v => v.field === `[setAttributes][${index}][value]`).map(v => v.message)"
        />
      </template>
    </template>

    <template v-slot:modal-footer="{ ok }">
      <b-button variant="primary ml-auto" @click="save(ok)">
        {{ $t('save') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
export default {
  props: {
    parkId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      violations: [],
      parkAttributes: []
    }
  },

  methods: {
    getTextFormatter (attribute) {
      if (attribute.type === 'number' && attribute.scale > 0) {
        return function (value) {
          return value ? value.replace(/[^0-9.]/g, '') : value
        }
      }

      if (attribute.type === 'number' && attribute.scale === 0) {
        return function (value) {
          return value ? value.replace(/[^0-9]/g, '') : value
        }
      }

      return null
    },

    async load () {
      const me = this

      const query = `
        query ($locale: String!, $parkId: String!){
          park(id: $parkId) {
            id
            attributes {
                type {
                  key
                }
                value
            }
          }
          parkAttributeTypes {
              key
              type
              category
              label(locale: $locale)
              scale
              choices { key, label(locale: $locale) }
          }
        }
      `

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale,
        parkId: me.parkId
      })

      if (result) {
        const values = {}

        result.park.attributes.forEach(function (item) {
          values[item.type.key] = item.value
        })

        me.parkAttributes = result.parkAttributeTypes.map(function (type) {
          return { ...type, ...{ value: values[type.key] ?? null } }
        })
      }
    },

    async save (ok) {
      const me = this

      const query = `
        mutation ($parkId: String!, $locale: String!, $input: UpdateParkInput!){
          updatePark(park: $parkId, input: $input) {
            violations {
              field
              message(locale: $locale)
            }
            park {
              id
              name
              slug
            }
          }
        }
      `

      const attributes = []
      me.parkAttributes.forEach(function (item) {
        let value = item.value

        if (item.type === 'number' && item.scale > 0) {
          value = parseFloat(value)
        }

        if (item.type === 'number' && item.scale === 0) {
          value = parseInt(value)
        }

        if (item.type === 'boolean') {
          value = value === true ? 'yes' : 'no'
        }

        attributes.push({
          key: item.key,
          value
        })
      })

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale,
        parkId: me.parkId,
        input: {
          setAttributes: attributes
        }
      })

      me.violations = result.updatePark.violations

      if (me.violations.length === 0) {
        ok()

        me.$emit('finish', result.updatePark.park)
      }
    }
  }
}
</script>
