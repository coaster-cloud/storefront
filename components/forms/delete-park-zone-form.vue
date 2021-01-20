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
    :id="`delete-park-zone-form-${zoneId}`"
    size="sm"
    :title="$t('please_confirm')"
    no-stacking
  >
    <p>{{ $t('confirm_delete') }}</p>

    <template v-slot:modal-footer="{ ok }">
      <b-button variant="secondary" @click="ok">
        {{ $t('close') }}
      </b-button>

      <b-button variant="danger ml-auto" @click="save(ok)">
        {{ $t('delete') }}
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
    async save (ok) {
      await this.updatePark(this.parkId, { deleteParkZones: [this.zoneId] }, ok)
    }
  }
}
</script>
