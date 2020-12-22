<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <b-modal id="login-form" size="xs" :title="$t('login')" scrollable no-stacking>
    <ul v-if="globalViolations.length > 0" class="alert alert-danger">
      <li v-for="(violation, index) in globalViolations" :key="index">
        {{ violation.message }}
      </li>
    </ul>

    <!-- Username -->
    <b-form-group label-cols-sm="3" label-for="login-form-username" :label="$t('username_and_email')">
      <b-form-input id="login-form-username" v-model="username" type="text" :state="usernameViolations.length === 0 ? null : false" />
      <b-form-invalid-feedback v-for="(violation, index) in usernameViolations" :key="index" :state="false">
        {{ violation.message }}
      </b-form-invalid-feedback>
    </b-form-group>

    <!-- Password -->
    <b-form-group label-cols-sm="3" label-for="login-form-password" :label="$t('password')">
      <b-form-input id="login-form-password" v-model="password" type="password" :state="passwordViolations.length === 0 ? null : false" />
      <b-form-invalid-feedback v-for="(violation, index) in passwordViolations" :key="index" :state="false">
        {{ violation.message }}
      </b-form-invalid-feedback>
    </b-form-group>

    <!-- Lifetime -->
    <b-form-group :label-cols-sm="3">
      <b-form-checkbox id="login-form-remember-me" v-model="rememberMe" switch>
        {{ $t('remember_me') }}
      </b-form-checkbox>
    </b-form-group>

    <template v-slot:modal-footer="{ ok }">
      <slot name="footer-buttons" />

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
      return this.violations.filter(v => v.field === null)
    },

    usernameViolations () {
      return this.violations.filter(v => v.field === 'username')
    },

    passwordViolations () {
      return this.violations.filter(v => v.field === 'password')
    }
  },

  methods: {
    async save (ok) {
      const me = this

      const result = await me.$graphql(me.$options.__query, {
        input: {
          username: me.username,
          password: me.password,
          lifetime: me.rememberMe ? 60 * 60 * 24 * 30 : 60 * 5
        }
      })

      me.violations = result.loginByPassword.violations

      if (result.loginByPassword.token) {
        ok()

        me.$store.commit('account/authenticate', result.loginByPassword.token)
        me.$root.$bvToast.toast(this.$t('login_success'), {
          title: this.$t('login'),
          variant: 'success',
          solid: true,
          toaster: 'b-toaster-top-center'
        })
      }
    }
  }
}
</script>

<query>
mutation ($input: LoginByPasswordInput!) {
  loginByPassword(input: $input) {
    token
    violations {
      field
      message
    }
  }
}
</query>
