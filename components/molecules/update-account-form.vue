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
    @show="load"
    @hidden="reset"
  >
    <alert-list :values="globalViolations" />

    <text-input
      id="update-account-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="nameViolations"
    />

    <text-input
      id="update-account-form-email"
      v-model="email"
      :label="$t('email')"
      :violations="emailViolations"
    />

    <text-input
      id="update-account-form-username"
      v-model="username"
      :label="$t('username')"
      :violations="usernameViolations"
    />

    <select-input
      id="update-account-form-locale"
      v-model="locale"
      :label="$t('locale')"
      :description="$t('locale_used_for_email')"
      :violations="localeViolations"
      :options="localeOptions"
    />

    <text-input
      id="update-account-form-password"
      v-model="password"
      type="password"
      :label="$t('password')"
      :violations="passwordViolations"
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
      name: '',
      email: '',
      username: '',
      locale: this.$i18n.locale,
      password: '',
      violations: []
    }
  },

  computed: {
    globalViolations () {
      return this.violations.filter(v => v.field === null).map(v => v.message)
    },

    nameViolations () {
      return this.violations.filter(v => v.field === 'name').map(v => v.message)
    },

    emailViolations () {
      return this.violations.filter(v => v.field === 'email').map(v => v.message)
    },

    usernameViolations () {
      return this.violations.filter(v => v.field === 'username').map(v => v.message)
    },

    localeViolations () {
      return this.violations.filter(v => v.field === 'locale').map(v => v.message)
    },

    localeOptions () {
      return this.$i18n.locales.map(function (locale) {
        return {
          value: locale.code,
          text: locale.label
        }
      })
    },

    passwordViolations () {
      return this.violations.filter(v => v.field === 'password').map(v => v.message)
    }
  },

  methods: {
    reset () {
      this.name = ''
      this.email = ''
      this.username = ''
      this.locale = this.$i18n.locale
      this.password = ''
      this.violations = []
    },

    async load () {
      const me = this

      const query = `
        query {
          myAccount {
            name,
            email
            username,
            locale
          }
        }
      `

      const result = await me.$graphql(query)

      if (result) {
        me.name = result.myAccount.name
        me.email = result.myAccount.email
        me.username = result.myAccount.username
        me.locale = result.myAccount.locale
      }
    },

    async save (ok) {
      const me = this

      const query = `
        mutation ($input: UpdateAccountInput!){
          updateAccount(input: $input){
            violations {
              field
              message
            }
          }
        }
      `

      const input = {
        name: me.name,
        email: me.email,
        username: me.username,
        locale: me.locale
      }

      if (me.password !== null && me.password !== '') {
        input.password = me.password
      }

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale,
        input
      })

      me.violations = result.updateAccount.violations

      if (me.violations.length === 0) {
        ok()

        me.reset()
      }
    }
  }
}
</script>
