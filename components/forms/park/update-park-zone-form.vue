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
    scrollable
    @show="load"
  >
    <text-input
      id="update-park-zone-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="getFieldViolations('[updateParkZones][0][name]')"
    />

    <template v-slot:modal-footer="{ ok }">
      <b-button variant="primary ml-auto" @click="save(ok)">
        {{ $t('save') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import ParkUpdateForm from '~/components/mixins/park-update-form'

export default {
  mixins: [ParkUpdateForm],

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
      name: null
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
      await this.updatePark(this.parkId, { updateParkZones: [{ id: this.zoneId, name: this.name }] }, ok)
    }
  }
}
</script>
