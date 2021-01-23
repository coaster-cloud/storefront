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
    id="update-attraction-safety-regulation-form"
    size="xs"
    :title="$t('modify.safety_regulation')"
    no-stacking
    @show="load"
  >
    <h5>{{ $t('safety_regulation.solo') }}</h5>
    <text-input
      id="update-attraction-safety-regulation-form-solo-min-height"
      v-model="soloMinHeight"
      :label="$t('safety_regulation.min_height')"
      :description="$t('input_hint.cm')"
      :formatter="formatInteger"
      :violations="getFieldViolations('[safetyRegulation][soloMinHeight]')"
    />

    <text-input
      id="update-attraction-safety-regulation-form-solo-max-height"
      v-model="soloMaxHeight"
      :label="$t('safety_regulation.max_height')"
      :description="$t('input_hint.cm')"
      :formatter="formatInteger"
      :violations="getFieldViolations('[safetyRegulation][soloMaxHeight]')"
    />

    <text-input
      id="update-attraction-safety-regulation-form-solo-min-age"
      v-model="soloMinAge"
      :label="$t('safety_regulation.min_age')"
      :description="$t('input_hint.years')"
      :formatter="formatInteger"
      :violations="getFieldViolations('[safetyRegulation][soloMinAge]')"
    />

    <text-input
      id="update-attraction-safety-regulation-form-solo-max-age"
      v-model="soloMaxAge"
      :label="$t('safety_regulation.max_age')"
      :description="$t('input_hint.years')"
      :formatter="formatInteger"
      :violations="getFieldViolations('[safetyRegulation][soloMaxAge]')"
    />

    <h5>{{ $t('safety_regulation.escort') }}</h5>
    <text-input
      id="update-attraction-safety-regulation-form-accompanied-min-height"
      v-model="accompaniedMinHeight"
      :label="$t('safety_regulation.min_height')"
      :description="$t('input_hint.cm')"
      :formatter="formatInteger"
      :violations="getFieldViolations('[safetyRegulation][accompaniedMinHeight]')"
    />

    <text-input
      id="update-attraction-safety-regulation-form-accompanied-min-age"
      v-model="accompaniedMinAge"
      :label="$t('safety_regulation.min_age')"
      :description="$t('input_hint.years')"
      :formatter="formatInteger"
      :violations="getFieldViolations('[safetyRegulation][accompaniedMinAge]')"
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
      soloMinHeight: null,
      soloMaxHeight: null,
      soloMinAge: null,
      soloMaxAge: null,
      accompaniedMinHeight: null,
      accompaniedMinAge: null
    }
  },

  methods: {
    formatInteger (value) {
      return value ? value.replace(/[^0-9]/g, '') : value
    },

    async load () {
      const me = this

      const query = `
        query ($attractionId: String!){
          attraction(id: $attractionId) {
            id
            safetyRegulation {
              soloMinHeight
              soloMaxHeight
              soloMinAge
              soloMaxAge
              accompaniedMinHeight
              accompaniedMinAge
            }
          }
        }
      `

      const result = await me.$graphql(query, {
        attractionId: me.attractionId
      })

      if (result) {
        me.soloMinHeight = result.attraction.safetyRegulation.soloMinHeight
        me.soloMaxHeight = result.attraction.safetyRegulation.soloMaxHeight
        me.soloMinAge = result.attraction.safetyRegulation.soloMinAge
        me.soloMaxAge = result.attraction.safetyRegulation.soloMaxAge
        me.accompaniedMinHeight = result.attraction.safetyRegulation.accompaniedMinHeight
        me.accompaniedMinAge = result.attraction.safetyRegulation.accompaniedMinAge
      }
    },

    async save (ok) {
      const input = {
        safetyRegulation: {
          soloMinHeight: this.soloMinHeight,
          soloMaxHeight: this.soloMaxHeight,
          soloMinAge: this.soloMinAge,
          soloMaxAge: this.soloMaxAge,
          accompaniedMinHeight: this.accompaniedMinHeight,
          accompaniedMinAge: this.accompaniedMinAge
        }
      }

      await this.updateAttraction(this.attractionId, input, ok)
    }
  }
}
</script>
