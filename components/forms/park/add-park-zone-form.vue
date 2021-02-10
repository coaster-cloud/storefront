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
    id="add-park-zone-form"
    size="xs"
    :title="$t('add.park_zone')"
    no-stacking
    scrollable
    @show="load"
  >
    <text-input
      id="add-park-zone-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="getFieldViolations('[addParkZones][0][name]')"
    />

    <text-input
      id="add-park-zone-form-opened-at"
      v-model="openedAt"
      :label="$t('opening')"
      :description="$t('input_hint.flex_date')"
      :violations="getFieldViolations('[addParkZones][0][openedAt]')"
    />

    <text-input
      id="add-park-zone-form-closed-at"
      v-model="closedAt"
      :label="$t('closing')"
      :description="$t('input_hint.flex_date')"
      :violations="getFieldViolations('[addParkZones][0][closedAt]')"
    />

    <tag-input
      id="add-park-zone-form-former-names"
      v-model="formerNames"
      :label="$t('former_names')"
      :violations="getFieldViolations('[addParkZones][0][formerNames]')"
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
    load () {
      const me = this

      me.name = null
      me.openedAt = null
      me.closedAt = null
      me.formerNames = []
    },

    async save (ok) {
      await this.updatePark(this.parkId, {
        addParkZones: [{
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
