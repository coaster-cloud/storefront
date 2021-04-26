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
    scrollable
    @show="load"
  >
    <text-input
      id="create-park-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="getFieldViolations('[name]')"
    />

    <select-input
      id="create-park-form-categories"
      v-model="categories"
      :label="$t('category')"
      :violations="getFieldViolations('[categories]')"
      :options="categoriesOptions"
      multiple
    />

    <select-input
      id="create-park-form-state"
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
      type="number"
      :violations="getFieldViolations('[latitude]')"
    />

    <text-input
      id="update-park-basic-form-longitude"
      v-model="longitude"
      :label="$t('longitude')"
      type="number"
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
    async load () {
      const me = this

      this.name = null
      this.categories = []
      this.state = null
      this.timezone = null
      this.web = null
      this.latitude = null
      this.longitude = null
      this.violations = []

      const result = await me.$graphql('af697cc7-93c0-4044-85ba-28aac907e362', {
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

      await this.createPark(input, ok)
    }
  }
}
</script>
