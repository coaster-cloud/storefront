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
    id="update-park-short-description-form"
    size="xs"
    :title="$t('modify.short_description')"
    no-stacking
    scrollable
    @show="load"
  >
    <textarea-input
      id="update-park-short-description-form-en"
      v-model="en"
      :label="labelEnglish"
      :label-col="12"
      :violations="getFieldViolations('[shortDescription][en]')"
    />

    <textarea-input
      id="update-park-short-description-form-de"
      v-model="de"
      :label="labelGerman"
      :label-col="12"
      :violations="getFieldViolations('[shortDescription][de]')"
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
      en: null,
      de: null
    }
  },

  computed: {
    labelEnglish () {
      return this.$t('short_description') + ' (' + this.$t('locale.en') + ')'
    },

    labelGerman () {
      return this.$t('short_description') + ' (' + this.$t('locale.de') + ')'
    }
  },

  methods: {
    async load () {
      const me = this

      const result = await me.$graphql('2c55ee6b-7a49-4f51-8005-96a6eea69951', {
        parkId: me.parkId
      })

      if (result) {
        me.en = result.park.en
        me.de = result.park.de
      }
    },

    async save (ok) {
      const input = {
        shortDescription: {
          en: this.en,
          de: this.de
        }
      }

      await this.updatePark(this.parkId, input, ok)
    }
  }
}
</script>
