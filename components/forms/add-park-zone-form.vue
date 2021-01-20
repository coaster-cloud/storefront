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
    @show="load"
  >
    <text-input
      id="add-park-zone-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="getFieldViolations('[addParkZones][0][name]')"
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
      name: null
    }
  },

  methods: {
    load () {
      const me = this

      me.name = null
    },

    async save (ok) {
      await this.updatePark(this.parkId, { addParkZones: [{ name: this.name }] }, ok)
    }
  }
}
</script>
