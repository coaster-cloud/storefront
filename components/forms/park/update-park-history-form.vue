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
    :id="`update-park-history-form-${historyId}`"
    size="xs"
    :title="$t('modify.history')"
    no-stacking
    @show="load"
  >
    <select-input
      id="update-park-history-form-type"
      v-model="type"
      :label="$t('type')"
      :violations="getFieldViolations('[updateParkHistories][0][type]')"
      :options="typeOptions"
    />

    <text-input
      id="update-park-history-form-date"
      v-model="date"
      :label="$t('date')"
      :description="$t('input_hint.flex_date')"
      :violations="getFieldViolations('[updateParkHistories][0][date]')"
    />

    <text-input
      v-if="hasNameField"
      id="update-park-history-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="getFieldViolations('[updateParkHistories][0][name]')"
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

    historyId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      type: null,
      date: null,
      name: null,
      typeOptions: []
    }
  },

  computed: {
    hasNameField () {
      const me = this
      let show = false

      this.typeOptions.forEach(function (type) {
        if (type.value === me.type) {
          show = type.fields.includes('name')
        }
      })

      return show
    }
  },

  methods: {
    async load () {
      const me = this

      const query = `
        query ($parkId: String!, $locale: String!){
          park(id: $parkId) {
            id
            histories { id, type { key }, date { value }, context { name } }
          }
          parkHistoryTypes {
            key
            label(locale: $locale)
            fields
          }
        }
      `

      const result = await me.$graphql(query, {
        parkId: me.parkId,
        locale: me.$i18n.locale
      })

      if (result) {
        const entry = result.park.histories.filter(v => v.id === me.historyId)[0]

        me.type = entry.type.key
        me.date = entry.date.value
        me.name = entry.context.name

        me.typeOptions = result.parkHistoryTypes.map(function (type) {
          return {
            value: type.key,
            text: type.label,
            fields: type.fields
          }
        })
      }
    },

    async save (ok) {
      const input = {
        id: this.historyId,
        type: this.type,
        date: this.date
      }

      if (this.hasNameField) {
        input.name = this.name
      }

      await this.updatePark(this.parkId, { updateParkHistories: [input] }, ok)
    }
  }
}
</script>
