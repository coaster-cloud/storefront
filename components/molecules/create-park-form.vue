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
    @hidden="reset"
  >
    <alert-list :values="globalViolations" />

    <text-input
      id="create-park-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="nameViolations"
    />

    <select-input
      id="create-park-form-categories"
      v-model="categories"
      :label="$t('type')"
      :violations="categoriesViolations"
      :options="categoriesOptions"
      multiple
    />

    <select-input
      id="create-park-form-state"
      v-model="state"
      :label="$t('state')"
      :violations="stateViolations"
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
      name: '',
      categories: [],
      state: '',
      violations: [],
      stateOptions: [],
      categoriesOptions: []
    }
  },

  computed: {
    globalViolations () {
      return this.violations.filter(v => v.field === null).map(v => v.message)
    },

    nameViolations () {
      return this.violations.filter(v => v.field === 'name').map(v => v.message)
    },

    categoriesViolations () {
      return this.violations.filter(v => v.field === 'categories').map(v => v.message)
    },

    stateViolations () {
      return this.violations.filter(v => v.field === 'state').map(v => v.message)
    }
  },

  methods: {
    reset () {
      this.name = ''
      this.categories = []
      this.state = ''
      this.violations = []
    },

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
        mutation ($locale: String!, $input: CreateParkInput!){
          createPark(input: $input) {
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

      me.violations = result.createPark.violations

      if (me.violations.length === 0) {
        ok()

        me.$emit('finish', result.createPark.park)

        me.reset()
      }
    }
  }
}
</script>
