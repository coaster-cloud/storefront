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

    <tag-input
      id="update-attraction-basic-form-manufacturers"
      v-model="manufacturers"
      :label="$t('manufacturer')"
      :violations="getFieldViolations('[manufacturers]')"
      :options="manufacturerOptions.map(v => v.name)"
    />

    <select-input
      id="update-attraction-basic-form-zone"
      v-model="zone"
      :label="$t('park_zone')"
      :violations="getFieldViolations('[zone]')"
      :options="zoneOptions"
    />

    <text-input
      id="update-attraction-basic-form-onride"
      v-model="onride"
      :label="$t('onride')"
      :description="$t('input_hint.youtube')"
      :violations="getFieldViolations('[onride]')"
    />

    <text-input
      id="update-attraction-basic-form-latitude"
      v-model="latitude"
      :label="$t('latitude')"
      type="number"
      :violations="getFieldViolations('[latitude]')"
    />

    <text-input
      id="update-attraction-basic-form-longitude"
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
      manufacturers: [],
      state: null,
      zone: null,
      onride: null,
      latitude: null,
      longitude: null,
      stateOptions: [],
      categoryOptions: [],
      zoneOptions: [],
      typeOptions: [],
      manufacturerOptions: []
    }
  },

  methods: {
    async load () {
      const me = this

      this.name = null
      this.category = null
      this.manufacturers = []
      this.state = null
      this.zone = null
      this.onride = null
      this.latitude = null
      this.longitude = null
      this.violations = []

      const result = await me.$graphql('ae8598fd-08a4-4201-9784-d9e08d48f83b', {
        locale: me.$i18n.locale,
        parkId: me.parkId
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

        me.manufacturerOptions = result.manufacturers.items

        me.zoneOptions = result.park.zones.map(function (zone) {
          return {
            value: zone.id,
            text: zone.name
          }
        })
      }
    },

    async save (ok) {
      const me = this

      const manufacturers = []
      me.manufacturerOptions.forEach(function (manufacturer) {
        if (me.manufacturers.includes(manufacturer.name)) {
          manufacturers.push(manufacturer.id)
        }
      })

      const input = {
        park: me.parkId,
        name: me.name,
        category: me.category,
        manufacturers,
        state: me.state,
        zone: me.zone,
        onride: me.onride,
        latitude: me.latitude,
        longitude: me.longitude
      }

      await this.createAttraction(input, ok)
    }
  }
}
</script>
