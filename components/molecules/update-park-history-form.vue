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
      :violations="violations.filter(v => v.field === '[updateParkHistories][0][type]').map(v => v.message)"
      :options="typeOptions"
    />

    <text-input
      id="update-park-history-form-date"
      v-model="date"
      :label="$t('date')"
      :description="$t('input_hint.flex_date')"
      :violations="violations.filter(v => v.field === '[updateParkHistories][0][date]').map(v => v.message)"
    />

    <text-input
      v-if="hasNameField"
      id="update-park-history-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="violations.filter(v => v.field === '[updateParkHistories][0][name]').map(v => v.message)"
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
      violations: [],
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
      const me = this

      const query = `
        mutation ($parkId: String!, $locale: String!, $input: UpdateParkInput!){
          updatePark(park: $parkId, input: $input) {
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

      const input = {
        id: me.historyId,
        type: me.type,
        date: me.date
      }

      if (me.hasNameField) {
        input.name = me.name
      }

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale,
        parkId: me.parkId,
        input: {
          updateParkHistories: [input]
        }
      })

      me.violations = result.updatePark.violations

      if (me.violations.length === 0) {
        ok()

        me.$emit('finish', result.updatePark.park)
      }
    }
  }
}
</script>
