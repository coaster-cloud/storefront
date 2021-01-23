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
    id="update-attraction-elements-form"
    size="xs"
    :title="$t('modify.ride_elements')"
    no-stacking
    @show="load"
  >
    <template v-for="(element, index) in attractionElements">
      <spin-input
        :id="`update-attraction-elements-form-${element.key}`"
        :key="index"
        v-model="element.quantity"
        :label="element.label"
        :label-col="6"
        :violations="violations.filter(v => v.field === `[setElements][${index}][quantity]`).map(v => v.message)"
      />
    </template>

    <template v-slot:modal-footer="{ ok }">
      <b-button variant="primary ml-auto" @click="save(ok)">
        {{ $t('save') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import AttractionUpdateForm from '~/components/mixins/attraction-update-form'

export default {
  mixins: [AttractionUpdateForm],

  props: {
    attractionId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      attractionElements: []
    }
  },

  methods: {
    async load () {
      const me = this

      const query = `
        query ($locale: String!, $attractionId: String!){
          attraction(id: $attractionId) {
            id
            elements {
                type {
                  key
                }
                quantity
            }
          }
          attractionElementTypes {
              key
              label(locale: $locale)
          }
        }
      `

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale,
        attractionId: me.attractionId
      })

      if (result) {
        const values = {}

        result.attraction.elements.forEach(function (item) {
          values[item.type.key] = item.quantity
        })

        me.attractionElements = result.attractionElementTypes.map(function (type) {
          return { ...type, ...{ quantity: values[type.key] ?? 0 } }
        })
      }
    },

    async save (ok) {
      const elements = []

      this.attractionElements.forEach(function (item) {
        let quantity = item.quantity

        if (quantity !== null) {
          quantity = parseInt(quantity)
        }

        elements.push({
          key: item.key,
          quantity
        })
      })

      await this.updateAttraction(this.attractionId, { setElements: elements }, ok)
    }
  }
}
</script>
