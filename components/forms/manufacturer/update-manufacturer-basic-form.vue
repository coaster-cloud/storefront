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
    id="update-manufacturer-basic-form"
    size="xs"
    :title="$t('modify.basic_data')"
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

    <text-input
      id="create-manufacturer-form-web"
      v-model="web"
      :label="$t('web')"
      :violations="getFieldViolations('[web]')"
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

  props: {
    manufacturerId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      name: null,
      categories: [],
      state: null,
      web: null,
      stateOptions: [],
      categoriesOptions: []
    }
  },

  methods: {
    async load () {
      const me = this

      const result = await me.$graphql('18e8d896-29f8-4f75-98d1-a45f2814391b', {
        locale: me.$i18n.locale,
        manufacturerId: me.manufacturerId
      })

      if (result) {
        me.name = result.manufacturer.name
        me.categories = result.manufacturer.categories.map(v => v.key)
        me.state = result.manufacturer.state.key
        me.web = result.manufacturer.web

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
        state: this.state,
        web: this.web
      }

      await this.updateManufacturer(this.manufacturerId, input, ok)
    }
  }
}
</script>
