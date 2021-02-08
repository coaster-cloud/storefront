<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <div class="action-box mt-5 text-center">
    <h5>{{ $t('count_your_rides') }}</h5>

    <date-input id="count-ride-date" v-model="countDateMutable" :label="$t('select_day')" :label-col="12" />

    <b-form-group :label="attractionName">
      <b-form-spinbutton
        :key="`rides-input-${attractionId}-${countDate}-basic`"
        :min="0"
        :max="100"
        :step="1"
        :value="myRides.totalBasicRides"
        :formatter-fn="ridesFormatter"
        :disabled="!$store.getters['account/hasToken']"
        @change="onChangeBasicRides"
      />
    </b-form-group>

    <template v-if="!$store.getters['account/hasToken']">
      <p>{{ $t('please_login') }}</p>
    </template>

    <div v-if="$store.getters['account/hasToken']" class="mt-2">
      <b-button v-b-toggle:count-options variant="link">
        <span class="when-open">{{ $t('hide_options') }}</span><span class="when-closed">{{ $t('show_options') }}</span>
      </b-button>

      <b-collapse id="count-options" class="mt-2">
        <b-form-group :label="$t('name_with_vr', {'{name}': attractionName})">
          <b-form-spinbutton
            :key="`rides-input-${attractionId}-${countDate}-vr`"
            :min="0"
            :max="100"
            :step="1"
            :value="myRides.totalVirtualRealityRides"
            :formatter-fn="ridesFormatter"
            :disabled="!$store.getters['account/hasToken']"
            @change="onChangeVirtualRealityRides"
          />
        </b-form-group>

        <b-form-group :key="`custom-definition-input-${attractionId}`" :label="$t('set_custom_category')">
          <b-form-select :value="myCustomDefinition.category" :options="customDefinitions.categories" @change="onCategoryChange">
            <template v-slot:first>
              <b-form-select-option :value="null">
                {{ $t('current_category') }}
              </b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    attractionId: {
      type: String,
      required: true
    },
    attractionName: {
      type: String,
      required: true
    },
    countDate: {
      type: String,
      required: true
    },
    customDefinitions: {
      type: Object,
      required: true
    },
    myCustomDefinition: {
      type: Object,
      required: true
    },
    myRides: {
      type: Object,
      required: true
    }
  },

  computed: {
    countDateMutable: {
      get () {
        return this.countDate
      },
      set (date) {
        this.$emit('count-date-changed', date)
      }
    }
  },

  methods: {
    ridesFormatter (value) {
      if (value === null || value < 1) {
        return this.$t('count_this_ride')
      }

      return this.$tc('n_rides', value, { count: value })
    },

    async updateRides (field, quantity) {
      const me = this

      if (!me.$store.getters['account/hasToken']) {
        return
      }

      const query = `
        mutation ($input: SetRidesInput!, $countDate: String!) {
          setRides(input: $input) {
            violations {
              field
              message
            }
            attraction {
              myRides(date: $countDate) {
                totalBasicRides
                totalVirtualRealityRides
              }
            }
          }
        }
      `

      const input = {
        attraction: me.attractionId,
        date: me.countDate
      }

      input[field] = quantity

      const result = await me.$graphql(query, { countDate: me.countDate, input })

      me.$trackEvent('Attraction counted')

      me.$emit('rides-changed', result.setRides.attraction)
    },

    onChangeBasicRides: _.debounce(function (quantity) {
      this.updateRides('totalBasicRides', quantity)
    }, 500),

    onChangeVirtualRealityRides: _.debounce(function (quantity) {
      this.updateRides('totalVirtualRealityRides', quantity)
    }, 500),

    async onCategoryChange (value) {
      const me = this

      if (!me.$store.getters['account/hasToken']) {
        return
      }

      const query = `
        mutation ($input: SetCustomDefinitionInput!) {
          setCustomDefinition(input: $input) {
            violations {
              field
              message
            }
            attraction {
              myCustomDefinition {
                category
              }
            }
          }
        }
      `

      const result = await me.$graphql(query, { input: { attraction: me.attractionId, category: value } })

      me.$emit('custom-definition-changed', result.setCustomDefinition.attraction)
    }
  }
}
</script>
