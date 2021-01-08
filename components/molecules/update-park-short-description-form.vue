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
    @show="load"
  >
    <alert-list :values="violations.filter(v => v.field === null).map(v => v.message)" />

    <textarea-input
      id="update-park-short-description-form-en"
      v-model="en"
      :label="$t('name')"
      :label-col="12"
      :violations="violations.filter(v => v.field === 'en').map(v => v.message)"
    />

    <textarea-input
      id="update-park-short-description-form-de"
      v-model="de"
      :label="$t('name')"
      :label-col="12"
      :violations="violations.filter(v => v.field === 'de').map(v => v.message)"
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
    }
  },

  data () {
    return {
      en: null,
      de: null,
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
            en: shortDescription(locale: "en")
            de: shortDescription(locale: "de")
          }
        }
      `

      const result = await me.$graphql(query, {
        parkId: me.parkId
      })

      if (result) {
        me.en = result.park.en
        me.de = result.park.de
      }
    },

    async save (ok) {
      const me = this

      const query = `
        mutation ($parkId: String!, $locale: String!, $input: UpdateParkShortDescriptionInput!){
          updateParkShortDescription(park: $parkId, input: $input) {
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
          en: me.en,
          de: me.de
        }
      })

      me.violations = result.updateParkShortDescription.violations

      if (me.violations.length === 0) {
        ok()

        me.$emit('finish', result.updateParkShortDescription.park)
      }
    }
  }
}
</script>
