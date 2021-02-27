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
    id="register-form"
    size="xs"
    :title="$t('register')"
    no-stacking
    scrollable
    @show="load"
  >
    <text-input
      id="register-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="getFieldViolations('[name]')"
    />

    <text-input
      id="register-form-email"
      v-model="email"
      :label="$t('email')"
      :violations="getFieldViolations('[email]')"
    />

    <text-input
      id="register-form-username"
      v-model="username"
      :label="$t('username')"
      :violations="getFieldViolations('[username]')"
    />

    <text-input
      id="register-form-password"
      v-model="password"
      type="password"
      :label="$t('password')"
      :violations="getFieldViolations('[password]')"
    />

    <switch-input
      id="register-form-terms"
      v-model="termsAccepted"
      :label="$t('accept_terms_label')"
      :label-col="12"
      :violations="getFieldViolations('[termsAccepted]')"
    />

    <template v-slot:modal-footer="{ ok }">
      <b-button variant="primary ml-auto" @click="save(ok)">
        {{ $t('register') }}
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
      password: null,
      termsAccepted: false,
      violations: []
    }
  },

  methods: {
    getFieldViolations (path) {
      return this.violations.filter(v => v.field === path).map(v => v.message)
    },

    load () {
      this.name = null
      this.email = null
      this.username = null
      this.password = null
      this.termsAccepted = false
      this.violations = []
    },

    async save (ok) {
      const me = this

      const query = `
        mutation ($locale: String!, $input: RegisterInput!){
          register(input: $input) {
            violations {
              field
              message(locale: $locale)
            }
            token
          }
        }
      `

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale,
        input: {
          name: me.name,
          email: me.email,
          username: me.username,
          password: me.password,
          locale: me.$i18n.locale,
          termsAccepted: me.termsAccepted
        }
      })

      me.violations = result.register.violations

      if (me.violations.length === 0) {
        ok()

        me.$store.commit('account/authenticate', result.register.token)
        this.$root.$bvToast.toast(this.$t('register_success'), {
          title: this.$t('register'),
          variant: 'success',
          solid: true,
          toaster: 'b-toaster-top-center',
          autoHideDelay: 2000
        })
      }
    }
  }
}
</script>
