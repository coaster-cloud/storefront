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
    id="update-account-form"
    size="xs"
    :title="$t('settings')"
    no-stacking
    scrollable
    @show="load"
  >
    <text-input
      id="update-account-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="getFieldViolations('[name]')"
    />

    <text-input
      id="update-account-form-email"
      v-model="email"
      :label="$t('email')"
      :violations="getFieldViolations('[email]')"
    />

    <text-input
      id="update-account-form-username"
      v-model="username"
      :label="$t('username')"
      :violations="getFieldViolations('[username]')"
    />

    <select-input
      id="update-account-form-locale"
      v-model="locale"
      :label="$t('locale')"
      :description="$t('locale_used_for_email')"
      :violations="getFieldViolations('[locale]')"
      :options="localeOptions"
    />

    <text-input
      id="update-account-form-password"
      v-model="password"
      type="password"
      :label="$t('password')"
      :violations="getFieldViolations('[password]')"
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
  data () {
    return {
      name: null,
      email: null,
      username: null,
      locale: null,
      password: null,
      violations: []
    }
  },

  computed: {
    localeOptions () {
      return this.$i18n.locales.map(function (locale) {
        return {
          value: locale.code,
          text: locale.label
        }
      })
    }
  },

  methods: {
    getFieldViolations (path) {
      return this.violations.filter(v => v.field === path).map(v => v.message)
    },

    async load () {
      const me = this

      this.password = null
      this.violations = []

      const result = await me.$graphql('d77ed3b5-401f-4dca-bb16-900f8f347e31')

      if (result) {
        me.name = result.myAccount.name
        me.email = result.myAccount.email
        me.username = result.myAccount.username
        me.locale = result.myAccount.locale
      }
    },

    async save (ok) {
      const me = this

      const input = {
        name: me.name,
        email: me.email,
        username: me.username,
        locale: me.locale
      }

      if (me.password !== null && me.password !== '') {
        input.password = me.password
      }

      const result = await me.$graphql('52535df0-034c-4645-9e82-09cf83db443e', {
        locale: me.$i18n.locale,
        input
      })

      me.violations = result.updateAccount.violations

      if (me.violations.length === 0) {
        ok()
      }
    }
  }
}
</script>
