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
    id="update-park-basic-form"
    size="xs"
    :title="$t('modify.basic_data')"
    no-stacking
    @show="load"
  >
    <alert-list :values="violations.filter(v => v.field === null).map(v => v.message)" />

    <text-input
      id="update-park-basic-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="violations.filter(v => v.field === 'name').map(v => v.message)"
    />

    <select-input
      id="update-park-basic-form-categories"
      v-model="categories"
      :label="$t('type')"
      :violations="violations.filter(v => v.field === 'categories').map(v => v.message)"
      :options="categoriesOptions"
      multiple
    />

    <select-input
      id="update-park-basic-form-state"
      v-model="state"
      :label="$t('state')"
      :violations="violations.filter(v => v.field === 'state').map(v => v.message)"
      :options="stateOptions"
    />

    <select-input
      id="update-park-basic-form-timezone"
      v-model="timezone"
      :label="$t('timezone')"
      :violations="violations.filter(v => v.field === 'timezone').map(v => v.message)"
      :options="timezoneOptions"
    />

    <text-input
      id="update-park-basic-form-web"
      v-model="web"
      :label="$t('web')"
      :violations="violations.filter(v => v.field === 'web').map(v => v.message)"
    />

    <text-input
      id="update-park-basic-form-latitude"
      v-model="latitude"
      :label="$t('latitude')"
      :violations="violations.filter(v => v.field === 'latitude').map(v => v.message)"
    />

    <text-input
      id="update-park-basic-form-longitude"
      v-model="longitude"
      :label="$t('longitude')"
      :violations="violations.filter(v => v.field === 'longitude').map(v => v.message)"
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
      name: null,
      categories: [],
      state: null,
      timezone: null,
      web: null,
      latitude: null,
      longitude: null,
      violations: [],
      stateOptions: [],
      categoriesOptions: [],
      timezoneOptions: []
    }
  },

  methods: {
    async load () {
      const me = this

      const query = `
        query ($locale: String!, $parkId: String!){
          park(id: $parkId) {
            id
            name
            slug
            categories { key }
            state { key }
            timezone { key }
            web
            latitude
            longitude
          }
          parkStates {
            key
            label(locale: $locale)
          }
          parkCategories {
            key
            label(locale: $locale)
          }
          timezones {
            key
            label(locale: $locale)
          }
        }
      `

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale,
        parkId: me.parkId
      })

      if (result) {
        me.name = result.park.name
        me.categories = result.park.categories.map(v => v.key)
        me.state = result.park.state.key
        me.timezone = result.park.timezone?.key
        me.web = result.park.web
        me.latitude = result.park.latitude
        me.longitude = result.park.longitude

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

        me.timezoneOptions = result.timezones.map(function (timezone) {
          return {
            value: timezone.key,
            text: timezone.label
          }
        })
      }
    },

    async save (ok) {
      const me = this

      const query = `
        mutation ($parkId: String!, $locale: String!, $input: UpdateParkBasicInput!){
          updateParkBasic(park: $parkId, input: $input) {
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
          name: me.name,
          categories: me.categories,
          state: me.state,
          timezone: me.timezone,
          web: me.web,
          latitude: me.latitude,
          longitude: me.longitude
        }
      })

      me.violations = result.updateParkBasic.violations

      if (me.violations.length === 0) {
        ok()

        me.$emit('finish', result.updateParkBasic.park)
      }
    }
  }
}
</script>
