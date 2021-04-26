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

    <text-input
      id="update-park-zone-form-opened-at"
      v-model="openedAt"
      :label="$t('opening')"
      :description="$t('input_hint.flex_date')"
      :violations="getFieldViolations('[updateParkZones][0][openedAt]')"
    />

    <text-input
      id="update-park-zone-form-closed-at"
      v-model="closedAt"
      :label="$t('closing')"
      :description="$t('input_hint.flex_date')"
      :violations="getFieldViolations('[updateParkZones][0][closedAt]')"
    />

    <tag-input
      id="update-park-zone-form-former-names"
      v-model="formerNames"
      :label="$t('former_names')"
      :violations="getFieldViolations('[updateParkZones][0][formerNames]')"
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
      name: null,
      openedAt: null,
      closedAt: null,
      formerNames: []
    }
  },

  methods: {
    async load () {
      const me = this

      const result = await me.$graphql('03d1bd55-30d5-4029-a16f-478799b65978', {
        parkId: me.parkId
      })

      if (result) {
        const zone = result.park.zones.filter(v => v.id === me.zoneId)[0]

        me.name = zone.name
        me.openedAt = zone.openedAt?.value
        me.closedAt = zone.closedAt?.value
        me.formerNames = zone.formerNames
      }
    },

    async save (ok) {
      await this.updatePark(this.parkId, {
        updateParkZones: [{
          id: this.zoneId,
          name: this.name,
          openedAt: this.openedAt,
          closedAt: this.closedAt,
          formerNames: this.formerNames
        }]
      }, ok)
    }
  }
}
</script>
