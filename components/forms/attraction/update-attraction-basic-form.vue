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
    id="update-attraction-basic-form"
    size="xs"
    :title="$t('modify.basic_data')"
    no-stacking
    @show="load"
  >
    <text-input
      id="update-attraction-basic-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="getFieldViolations('[name]')"
    />

    <select-input
      id="update-attraction-basic-form-category"
      v-model="category"
      :label="$t('type')"
      :violations="getFieldViolations('[category]')"
      :options="categoryOptions"
      multiple
    />

    <select-input
      id="update-attraction-basic-form-state"
      v-model="state"
      :label="$t('state')"
      :violations="getFieldViolations('[state]')"
      :options="stateOptions"
    />

    <!-- Types: Tag -->
    <!-- Manufacturer: Tag -->

    <select-input
      id="update-attraction-basic-form-zone"
      v-model="zone"
      :label="$t('park_zone')"
      :violations="getFieldViolations('[zone]')"
      :options="zoneOptions"
    />

    <text-input
      id="update-attraction-basic-form-latitude"
      v-model="latitude"
      :label="$t('latitude')"
      :formatter="formatCoordinate"
      :violations="getFieldViolations('[latitude]')"
    />

    <text-input
      id="update-attraction-basic-form-longitude"
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
      name: null,
      category: null,
      state: null,
      zone: null,
      latitude: null,
      longitude: null,
      stateOptions: [],
      categoryOptions: [],
      zoneOptions: []
    }
  },

  methods: {
    formatCoordinate (value) {
      return value ? value.replace(/[^0-9.]/g, '') : value
    },

    async load () {
      const me = this

      const query = `
        query ($locale: String!, $attractionId: String!){
          attraction(id: $attractionId) {
            id
            name
            slug
            category { key }
            state { key }
            zone { id }
            latitude
            longitude
          }
          attractionStates {
            key
            label(locale: $locale)
          }
          attractionCategory {
            key
            label(locale: $locale)
          }
          park {
            zones { id, name }
          }
        }
      `

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale,
        attractionId: me.attractionId
      })

      if (result) {
        me.name = result.attraction.name
        me.category = result.attraction.category.key
        me.state = result.attraction.state.key
        me.zone = result.attraction.zone?.id
        me.latitude = result.attraction.latitude
        me.longitude = result.attraction.longitude

        me.stateOptions = result.attractionStates.map(function (state) {
          return {
            value: state.key,
            text: state.label
          }
        })

        me.categoryOptions = result.attractionCategory.map(function (category) {
          return {
            value: category.key,
            text: category.label
          }
        })

        me.zoneOptions = result.park.zones.map(function (zone) {
          return {
            value: zone.id,
            text: zone.name
          }
        })
      }
    },

    async save (ok) {
      const input = {
        name: this.name,
        category: this.category,
        state: this.state,
        zone: this.zone,
        latitude: this.latitude,
        longitude: this.longitude
      }

      await this.updateAttraction(this.attractionId, input, ok)
    }
  }
}
</script>
