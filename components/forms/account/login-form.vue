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
    id="login-form"
    size="xs"
    :title="$t('login')"
    no-stacking
    scrollable
    @show="load"
  >
    <text-input
      id="login-form-username"
      v-model="username"
      :label="$t('username_and_email')"
      :label-col="12"
      :violations="getFieldViolations('[username]')"
    />

    <text-input
      id="login-form-password"
      v-model="password"
      type="password"
      :label="$t('password')"
      :label-col="12"
      :violations="getFieldViolations('[password]')"
    />

    <switch-input
      id="login-form-remember-me"
      v-model="rememberMe"
      :label="$t('remember_me')"
      :label-col="12"
    />

    <template v-slot:modal-footer="{ ok }">
      <b-button v-b-modal.reset-password-form variant="light">
        {{ $t('change_password') }}
      </b-button>

      <b-button variant="primary ml-auto" @click="save(ok)">
        {{ $t('login') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
export default {
  data () {
    return {
      username: null,
      password: null,
      rememberMe: false,
      violations: []
    }
  },

  methods: {
    getFieldViolations (path) {
      return this.violations.filter(v => v.field === path).map(v => v.message)
    },

    load () {
      this.username = null
      this.password = null
      this.rememberMe = false
      this.violations = []
    },

    async save (ok) {
      const me = this

      const result = await me.$graphql('50a7642e-618e-4d69-b96d-141a6ff5ff9b', {
        locale: me.$i18n.locale,
        input: {
          username: me.username,
          password: me.password,
          lifetime: me.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24
        }
      })

      me.violations = result.login.violations

      if (result.login.token) {
        ok()

        me.$store.commit('account/authenticate', result.login.token)
        me.$root.$bvToast.toast(this.$t('login_success'), {
          title: this.$t('login'),
          variant: 'success'
        })
      }
    }
  }
}
</script>
