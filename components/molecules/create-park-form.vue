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
    id="create-park-form"
    size="xs"
    :title="$t('add.park')"
    no-stacking
    @show="load"
  >
    <text-input
      id="create-park-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="violations.filter(v => v.field === '[name]').map(v => v.message)"
    />

    <select-input
      id="create-park-form-categories"
      v-model="categories"
      :label="$t('type')"
      :violations="violations.filter(v => v.field === '[categories]').map(v => v.message)"
      :options="categoriesOptions"
      multiple
    />

    <select-input
      id="create-park-form-state"
      v-model="state"
      :label="$t('state')"
      :violations="violations.filter(v => v.field === '[state]').map(v => v.message)"
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
export default {
  data () {
    return {
      name: null,
      categories: [],
      state: null,
      violations: [],
      stateOptions: [],
      categoriesOptions: []
    }
  },

  methods: {
    async load () {
      const me = this

      const query = `
        query ($locale: String!){
          parkStates {
            key
            label(locale: $locale)
          }
          parkCategories {
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
        me.stateOptions = result.parkStates.map(function (state) {
          return {
            value: state.key,
            text: state.label
          }
        })

        me.categoriesOptions = result.parkCategories.map(function (category) {
          return {
            value: category.key,
            text: category.label
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

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale,
        input: {
          name: me.name,
          categories: me.categories,
          state: me.state
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
