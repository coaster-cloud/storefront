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
    id="update-attraction-short-description-form"
    size="xs"
    :title="$t('modify.short_description')"
    no-stacking
    @show="load"
  >
    <textarea-input
      id="update-attraction-short-description-form-en"
      v-model="en"
      :label="labelEnglish"
      :label-col="12"
      :violations="getFieldViolations('[shortDescription][en]')"
    />

    <textarea-input
      id="update-attraction-short-description-form-de"
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
import attractionUpdateForm from '~/components/mixins/attraction-update-form'

export default {
  mixins: [attractionUpdateForm],

  props: {
    attractionId: {
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

      const query = `
        query ($attractionId: String!){
          attraction(id: $attractionId) {
            id
            en: shortDescription(locale: "en")
            de: shortDescription(locale: "de")
          }
        }
      `

      const result = await me.$graphql(query, {
        attractionId: me.attractionId
      })

      if (result) {
        me.en = result.attraction.en
        me.de = result.attraction.de
      }
    },

    async save (ok) {
      const input = {
        shortDescription: {
          en: this.en,
          de: this.de
        }
      }

      await this.updateAttraction(this.attractionId, input, ok)
    }
  }
}
</script>
