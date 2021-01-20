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
    @show="load"
  >
    <text-input
      id="update-park-address-form-street"
      v-model="street"
      :label="$t('street')"
      :violations="violations.filter(v => v.field === '[address][street]').map(v => v.message)"
    />

    <text-input
      id="update-park-address-form-house-number"
      v-model="houseNumber"
      :label="$t('house_number')"
      :violations="violations.filter(v => v.field === '[address][houseNumber]').map(v => v.message)"
    />

    <text-input
      id="update-park-address-form-postal-code"
      v-model="postalCode"
      :label="$t('postal_code')"
      :violations="violations.filter(v => v.field === '[address][postalCode]').map(v => v.message)"
    />

    <text-input
      id="update-park-address-form-city"
      v-model="city"
      :label="$t('city')"
      :violations="violations.filter(v => v.field === '[address][city]').map(v => v.message)"
    />

    <text-input
      id="update-park-address-form-province"
      v-model="province"
      :label="$t('province')"
      :violations="violations.filter(v => v.field === '[address][province]').map(v => v.message)"
    />

    <select-input
      id="update-park-address-form-country"
      v-model="country"
      :label="$t('country')"
      :violations="violations.filter(v => v.field === '[address][country]').map(v => v.message)"
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
export default {
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
      violations: [],
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
      const me = this

      const query = `
        mutation ($parkId: String!, $locale: String!, $input: UpdateParkInput!){
          updatePark(park: $parkId, input: $input) {
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
          address: {
            street: me.street,
            houseNumber: me.houseNumber,
            postalCode: me.postalCode,
            city: me.city,
            province: me.province,
            country: me.country
          }
        }
      })

      me.violations = result.updatePark.violations

      if (me.violations.length === 0) {
        ok()

        me.$emit('finish', result.updatePark.park)
      }
    }
  }
}
</script>
