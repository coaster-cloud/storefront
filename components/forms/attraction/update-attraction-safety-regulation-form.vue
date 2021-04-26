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
    scrollable
    @show="load"
  >
    <h5>{{ $t('safety_regulation.solo') }}</h5>
    <text-input
      id="update-attraction-safety-regulation-form-solo-min-height"
      v-model="soloMinHeight"
      :label="$t('safety_regulation.min_height')"
      :description="$t('input_hint.cm')"
      type="number"
      :step="1"
      :violations="getFieldViolations('[safetyRegulation][soloMinHeight]')"
      :disabled="noRestrictions"
    />

    <text-input
      id="update-attraction-safety-regulation-form-solo-max-height"
      v-model="soloMaxHeight"
      :label="$t('safety_regulation.max_height')"
      :description="$t('input_hint.cm')"
      type="number"
      :step="1"
      :violations="getFieldViolations('[safetyRegulation][soloMaxHeight]')"
      :disabled="noRestrictions"
    />

    <text-input
      id="update-attraction-safety-regulation-form-solo-min-age"
      v-model="soloMinAge"
      :label="$t('safety_regulation.min_age')"
      :description="$t('input_hint.years')"
      type="number"
      :step="1"
      :violations="getFieldViolations('[safetyRegulation][soloMinAge]')"
      :disabled="noRestrictions"
    />

    <text-input
      id="update-attraction-safety-regulation-form-solo-max-age"
      v-model="soloMaxAge"
      :label="$t('safety_regulation.max_age')"
      :description="$t('input_hint.years')"
      type="number"
      :step="1"
      :violations="getFieldViolations('[safetyRegulation][soloMaxAge]')"
      :disabled="noRestrictions"
    />

    <h5>{{ $t('safety_regulation.escort') }}</h5>
    <text-input
      id="update-attraction-safety-regulation-form-accompanied-min-height"
      v-model="accompaniedMinHeight"
      :label="$t('safety_regulation.min_height')"
      :description="$t('input_hint.cm')"
      type="number"
      :step="1"
      :violations="getFieldViolations('[safetyRegulation][accompaniedMinHeight]')"
      :disabled="noRestrictions"
    />

    <text-input
      id="update-attraction-safety-regulation-form-accompanied-min-age"
      v-model="accompaniedMinAge"
      :label="$t('safety_regulation.min_age')"
      :description="$t('input_hint.years')"
      type="number"
      :step="1"
      :violations="getFieldViolations('[safetyRegulation][accompaniedMinAge]')"
      :disabled="noRestrictions"
    />

    <switch-input
      id="update-attraction-safety-regulation-form-no-restrictions"
      v-model="noRestrictions"
      :label="$t('no_safety_regulation')"
      :label-col="12"
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

  computed: {
    noRestrictions: {
      get () {
        const me = this

        if (me.soloMinHeight === 0 && me.soloMinAge === 0) {
          const optionalFields = [me.soloMaxHeight, me.soloMaxAge, me.accompaniedMinHeight, me.accompaniedMinAge]

          if (optionalFields.filter(v => v !== null).length === 0) {
            return true
          }
        }

        return false
      },

      set (value) {
        const me = this

        me.soloMinHeight = value === true ? 0 : null
        me.soloMinAge = value === true ? 0 : null
        me.soloMaxHeight = null
        me.soloMaxAge = null
        me.accompaniedMinHeight = null
        me.accompaniedMinAge = null
      }
    }
  },

  methods: {
    async load () {
      const me = this

      const result = await me.$graphql('b867149a-ea48-44a7-8428-814b92b0c325', {
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
