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
    id="update-park-address-form"
    size="xs"
    :title="$t('modify.address')"
    no-stacking
    scrollable
    @show="load"
  >
    <text-input
      id="update-park-address-form-street"
      v-model="street"
      :label="$t('street')"
      :violations="getFieldViolations('[address][street]')"
    />

    <text-input
      id="update-park-address-form-house-number"
      v-model="houseNumber"
      :label="$t('house_number')"
      :violations="getFieldViolations('[address][houseNumber]')"
    />

    <text-input
      id="update-park-address-form-postal-code"
      v-model="postalCode"
      :label="$t('postal_code')"
      :violations="getFieldViolations('[address][postalCode]')"
    />

    <text-input
      id="update-park-address-form-city"
      v-model="city"
      :label="$t('city')"
      :violations="getFieldViolations('[address][city]')"
    />

    <text-input
      id="update-park-address-form-province"
      v-model="province"
      :label="$t('province')"
      :violations="getFieldViolations('[address][province]')"
    />

    <select-input
      id="update-park-address-form-country"
      v-model="country"
      :label="$t('country')"
      :violations="getFieldViolations('[address][country]')"
      :options="countryOptions"
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
      street: null,
      houseNumber: null,
      postalCode: null,
      city: null,
      province: null,
      country: null,
      countryOptions: []
    }
  },

  methods: {
    async load () {
      const me = this

      const query = `
        query ($locale: String!, $parkId: String!){
          park(id: $parkId) {
            id
            address {
              street
              houseNumber
              postalCode
              city
              province
              country { key }
            }
          }
          countries {
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
        me.street = result.park.address.street
        me.houseNumber = result.park.address.houseNumber
        me.postalCode = result.park.address.postalCode
        me.city = result.park.address.city
        me.province = result.park.address.province
        me.country = result.park.address.country?.key

        me.countryOptions = result.countries.map(function (country) {
          return {
            value: country.key,
            text: country.label
          }
        })
      }
    },

    async save (ok) {
      const input = {
        address: {
          street: this.street,
          houseNumber: this.houseNumber,
          postalCode: this.postalCode,
          city: this.city,
          province: this.province,
          country: this.country
        }
      }

      await this.updatePark(this.parkId, input, ok)
    }
  }
}
</script>
