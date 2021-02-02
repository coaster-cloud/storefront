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
    :id="`delete-park-image-form-${imageId}`"
    size="sm"
    :title="$t('please_confirm')"
    no-stacking
    scrollable
  >
    <p>{{ $t('confirm_delete') }}</p>

    <b-alert v-if="violations.length > 0" variant="danger" show>
      {{ violations[0].message }}
    </b-alert>

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

    imageId: {
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
      await this.updatePark(this.parkId, { deleteParkImages: [this.imageId] }, ok)
    }
  }
}
</script>
