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
    id="update-manufacturer-address-form"
    size="xs"
    :title="$t('modify.address')"
    no-stacking
    scrollable
    @show="load"
  >
    <text-input
      id="update-manufacturer-address-form-street"
      v-model="street"
      :label="$t('street')"
      :violations="getFieldViolations('[address][street]')"
    />

    <text-input
      id="update-manufacturer-address-form-house-number"
      v-model="houseNumber"
      :label="$t('house_number')"
      :violations="getFieldViolations('[address][houseNumber]')"
    />

    <text-input
      id="update-manufacturer-address-form-postal-code"
      v-model="postalCode"
      :label="$t('postal_code')"
      :violations="getFieldViolations('[address][postalCode]')"
    />

    <text-input
      id="update-manufacturer-address-form-city"
      v-model="city"
      :label="$t('city')"
      :violations="getFieldViolations('[address][city]')"
    />

    <text-input
      id="update-manufacturer-address-form-province"
      v-model="province"
      :label="$t('province')"
      :violations="getFieldViolations('[address][province]')"
    />

    <select-input
      id="update-manufacturer-address-form-country"
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
import ManufacturerUpdateForm from '~/components/mixins/manufacturer-update-form'

export default {
  mixins: [ManufacturerUpdateForm],

  props: {
    manufacturerId: {
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

      const result = await me.$graphql('1c9a52ab-6067-4cd2-8890-efcb190a7f46', {
        locale: me.$i18n.locale,
        manufacturerId: me.manufacturerId
      })

      if (result) {
        me.street = result.manufacturer.address.street
        me.houseNumber = result.manufacturer.address.houseNumber
        me.postalCode = result.manufacturer.address.postalCode
        me.city = result.manufacturer.address.city
        me.province = result.manufacturer.address.province
        me.country = result.manufacturer.address.country?.key

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

      await this.updateManufacturer(this.manufacturerId, input, ok)
    }
  }
}
</script>
