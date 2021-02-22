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
    id="create-manufacturer-form"
    size="xs"
    :title="$t('add.manufacturer')"
    no-stacking
    scrollable
    @show="load"
  >
    <text-input
      id="create-manufacturer-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="getFieldViolations('[name]')"
    />

    <select-input
      id="create-manufacturer-form-categories"
      v-model="categories"
      :label="$t('category')"
      :violations="getFieldViolations('[categories]')"
      :options="categoriesOptions"
      multiple
    />

    <select-input
      id="create-manufacturer-form-state"
      v-model="state"
      :label="$t('state')"
      :violations="getFieldViolations('[state]')"
      :options="stateOptions"
    />

    <template v-slot:modal-footer="{ ok }">
      <b-button variant="primary ml-auto" @click="save(ok)">
        {{ $t('save') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import ManufacturerUpdateForm from '~/components/mixins/manufacturer-update-form'

export default {
  mixins: [ManufacturerUpdateForm],

  data () {
    return {
      name: null,
      categories: [],
      state: null,
      stateOptions: [],
      categoriesOptions: []
    }
  },

  methods: {
    async load () {
      const me = this

      const query = `
        query ($locale: String!){
          manufacturerStates {
            key
            label(locale: $locale)
          }
          manufacturerCategories {
            key
            label(locale: $locale)
          }
        }
      `

      this.name = null
      this.categories = []
      this.state = null
      this.violations = []

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale
      })

      if (result) {
        me.stateOptions = result.manufacturerStates.map(function (state) {
          return {
            value: state.key,
            text: state.label
          }
        })

        me.categoriesOptions = result.manufacturerCategories.map(function (category) {
          return {
            value: category.key,
            text: category.label
          }
        })
      }
    },

    async save (ok) {
      const input = {
        name: this.name,
        categories: this.categories,
        state: this.state
      }

      await this.createManufacturer(input, ok)
    }
  }
}
</script>
