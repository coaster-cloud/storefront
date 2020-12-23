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
    @hidden="reset"
  >
    <alert-list :values="globalViolations" />

    <text-input
      id="login-form-username"
      v-model="username"
      :label="$t('username_and_email')"
      :label-col="12"
      :violations="usernameViolations"
    />

    <text-input
      id="login-form-password"
      v-model="password"
      type="password"
      :label="$t('password')"
      :label-col="12"
      :violations="passwordViolations"
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
      username: '',
      password: '',
      rememberMe: false,
      violations: []
    }
  },

  computed: {
    globalViolations () {
      return this.violations.filter(v => v.field === null).map(v => v.message)
    },

    usernameViolations () {
      return this.violations.filter(v => v.field === 'username').map(v => v.message)
    },

    passwordViolations () {
      return this.violations.filter(v => v.field === 'password').map(v => v.message)
    }
  },

  methods: {
    reset () {
      this.username = ''
      this.password = ''
      this.rememberMe = false
      this.violations = []
    },

    async save (ok) {
      const me = this

      const result = await me.$graphql(me.$options.__query, {
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
          variant: 'success',
          solid: true,
          toaster: 'b-toaster-top-center'
        })

        me.reset()
      }
    }
  }
}
</script>

<query>
mutation ($locale: String!, $input: LoginInput!) {
login(input: $input) {
    token
    violations {
      field
      message(locale: $locale)
    }
  }
}
</query>
