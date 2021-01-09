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
    :id="`delete-park-history-form-${historyId}`"
    size="sm"
    :title="$t('please_confirm')"
    no-stacking
  >
    <alert-list :values="violations.filter(v => v.field === null).map(v => v.message)" />

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
export default {
  props: {
    parkId: {
      type: String,
      required: true
    },

    historyId: {
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
    async save (ok) {
      const me = this

      const query = `
        mutation ($parkId: String!, $historyId: String!, $locale: String!){
          deleteParkHistory(park: $parkId, history: $historyId) {
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
        historyId: me.historyId
      })

      me.violations = result.deleteParkHistory.violations

      if (me.violations.length === 0) {
        ok()

        me.$emit('finish', result.deleteParkHistory.park)
      }
    }
  }
}
</script>
