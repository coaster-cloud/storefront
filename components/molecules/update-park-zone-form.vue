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
    :id="`update-park-zone-form-${zoneId}`"
    size="xs"
    :title="$t('modify.park_zone')"
    no-stacking
    @show="load"
  >
    <text-input
      id="update-park-zone-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="violations.filter(v => v.field === '[updateParkZones][0][name]').map(v => v.message)"
    />

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
    },

    zoneId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      name: null,
      violations: []
    }
  },

  methods: {
    async load () {
      const me = this

      const query = `
        query ($parkId: String!){
          park(id: $parkId) {
            id
            zones { id, name }
          }
        }
      `

      const result = await me.$graphql(query, {
        parkId: me.parkId
      })

      if (result) {
        me.name = result.park.zones.filter(v => v.id === me.zoneId)[0].name
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

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale,
        parkId: me.parkId,
        input: {
          updateParkZones: [
            { id: me.zoneId, name: me.name }
          ]
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
