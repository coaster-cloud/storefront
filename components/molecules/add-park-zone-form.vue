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
    id="add-park-zone-form"
    size="xs"
    :title="$t('add.park_zone')"
    no-stacking
    @show="load"
  >
    <alert-list :values="violations.filter(v => v.field === null).map(v => v.message)" />

    <text-input
      id="add-park-zone-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="violations.filter(v => v.field === 'name').map(v => v.message)"
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
      name: null,
      violations: []
    }
  },

  methods: {
    load () {
      const me = this

      me.name = null
    },

    async save (ok) {
      const me = this

      const query = `
        mutation ($parkId: String!, $locale: String!, $input: AddParkZoneInput!){
          addParkZone(park: $parkId, input: $input) {
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
          name: me.name
        }
      })

      me.violations = result.addParkZone.violations

      if (me.violations.length === 0) {
        ok()

        me.$emit('finish', result.addParkZone.park)
      }
    }
  }
}
</script>
