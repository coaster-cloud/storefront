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
    scrollable
    @show="load"
  >
    <text-input
      id="update-park-basic-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="getFieldViolations('[name]')"
    />

    <select-input
      id="update-park-basic-form-categories"
      v-model="categories"
      :label="$t('category')"
      :violations="getFieldViolations('[categories]')"
      :options="categoriesOptions"
      multiple
    />

    <select-input
      id="update-park-basic-form-state"
      v-model="state"
      :label="$t('state')"
      :violations="getFieldViolations('[state]')"
      :options="stateOptions"
    />

    <select-input
      id="update-park-basic-form-timezone"
      v-model="timezone"
      :label="$t('timezone')"
      :violations="getFieldViolations('[timezone]')"
      :options="timezoneOptions"
    />

    <text-input
      id="update-park-basic-form-web"
      v-model="web"
      :label="$t('web')"
      :violations="getFieldViolations('[web]')"
    />

    <text-input
      id="update-park-basic-form-latitude"
      v-model="latitude"
      :label="$t('latitude')"
      :formatter="formatCoordinate"
      :violations="getFieldViolations('[latitude]')"
    />

    <text-input
      id="update-park-basic-form-longitude"
      v-model="longitude"
      :label="$t('longitude')"
      :formatter="formatCoordinate"
      :violations="getFieldViolations('[longitude]')"
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
      stateOptions: [],
      categoriesOptions: [],
      timezoneOptions: []
    }
  },

  methods: {
    formatCoordinate (value) {
      return value ? value.replace(/[^0-9.]/g, '') : value
    },

    async load () {
      const me = this

      const query = `
        query ($locale: String!, $parkId: String!){
          park(id: $parkId) {
            id
            name
            fullSlug
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
      const input = {
        name: this.name,
        categories: this.categories,
        state: this.state,
        timezone: this.timezone,
        web: this.web,
        latitude: this.latitude,
        longitude: this.longitude
      }

      await this.updatePark(this.parkId, input, ok)
    }
  }
}
</script>
