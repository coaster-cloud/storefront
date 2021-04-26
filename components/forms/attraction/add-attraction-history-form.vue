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
    id="add-attraction-history-form"
    size="xs"
    :title="$t('add.attraction_history')"
    no-stacking
    scrollable
    @show="load"
  >
    <select-input
      id="add-attraction-history-form-type"
      v-model="type"
      :label="$t('type')"
      :violations="getFieldViolations('[addAttractionHistories][0][type]')"
      :options="typeOptions"
    />

    <text-input
      id="add-attraction-history-form-date"
      v-model="date"
      :label="$t('date')"
      :description="$t('input_hint.flex_date')"
      :violations="getFieldViolations('[addAttractionHistories][0][date]')"
    />

    <text-input
      v-if="hasNameField"
      id="add-attraction-history-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="getFieldViolations('[addAttractionHistories][0][name]')"
    />

    <template v-slot:modal-footer="{ ok }">
      <b-button variant="primary ml-auto" @click="save(ok)">
        {{ $t('save') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import AttractionUpdateForm from '~/components/mixins/attraction-update-form'

export default {
  mixins: [AttractionUpdateForm],

  props: {
    attractionId: {
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

      this.type = null
      this.date = null
      this.name = null
      this.violations = []

      const result = await me.$graphql('30087256-674d-4750-b071-21d7ffb0a5fd', {
        locale: me.$i18n.locale
      })

      if (result) {
        me.typeOptions = result.attractionHistoryTypes.map(function (type) {
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
        type: this.type,
        date: this.date
      }

      if (this.hasNameField) {
        input.name = this.name
      }

      await this.updateAttraction(this.attractionId, { addAttractionHistories: [input] }, ok)
    }
  }
}
</script>
