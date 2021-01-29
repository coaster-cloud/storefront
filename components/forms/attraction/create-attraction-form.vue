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
    id="create-attraction-form"
    size="xs"
    :title="$t('add.attraction')"
    no-stacking
    scrollable
    @show="load"
  >
    <text-input
      id="create-attraction-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="getFieldViolations('[name]')"
    />

    <select-input
      id="create-attraction-form-category"
      v-model="category"
      :label="$t('category')"
      :violations="getFieldViolations('[category]')"
      :options="categoryOptions"
    />

    <select-input
      id="create-attraction-form-state"
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
import AttractionUpdateForm from '~/components/mixins/attraction-update-form'

export default {
  mixins: [AttractionUpdateForm],

  props: {
    parkId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      name: null,
      category: null,
      state: null,
      stateOptions: [],
      categoryOptions: []
    }
  },

  methods: {
    async load () {
      const me = this

      const query = `
        query ($locale: String!){
          attractionStates {
            key
            label(locale: $locale)
          }
          attractionCategories {
            key
            label(locale: $locale)
          }
        }
      `

      this.name = null
      this.category = null
      this.state = null
      this.violations = []

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale
      })

      if (result) {
        me.stateOptions = result.attractionStates.map(function (state) {
          return {
            value: state.key,
            text: state.label
          }
        })

        me.categoryOptions = result.attractionCategories.map(function (category) {
          return {
            value: category.key,
            text: category.label
          }
        })
      }
    },

    async save (ok) {
      const input = {
        park: this.parkId,
        name: this.name,
        category: this.category,
        state: this.state
      }

      await this.createAttraction(input, ok)
    }
  }
}
</script>
