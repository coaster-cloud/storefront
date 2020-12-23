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
    @hidden="reset"
  >
    <alert-list :values="globalViolations" />

    <text-input
      id="register-form-name"
      v-model="name"
      :label="$t('name')"
      :violations="nameViolations"
    />

    <text-input
      id="register-form-email"
      v-model="email"
      :label="$t('email')"
      :violations="emailViolations"
    />

    <text-input
      id="register-form-username"
      v-model="username"
      :label="$t('username')"
      :violations="usernameViolations"
    />

    <text-input
      id="register-form-password"
      v-model="password"
      type="password"
      :label="$t('password')"
      :violations="passwordViolations"
    />

    <switch-input
      id="register-form-terms"
      v-model="termsAccepted"
      :label="$t('accept_terms_label')"
      :label-col="12"
      :violations="termsAcceptedViolations"
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
      name: '',
      email: '',
      username: '',
      password: '',
      termsAccepted: false,
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

    passwordViolations () {
      return this.violations.filter(v => v.field === 'password').map(v => v.message)
    },

    termsAcceptedViolations () {
      return this.violations.filter(v => v.field === 'termsAccepted').map(v => v.message)
    }
  },

  methods: {
    reset () {
      this.name = ''
      this.email = ''
      this.username = ''
      this.password = ''
      this.termsAccepted = false
      this.violations = []
    },

    async save (ok) {
      const me = this

      const result = await me.$graphql(me.$options.__query, {
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

        this.$root.$bvToast.toast(this.$t('register_success'), {
          title: this.$t('register'),
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
mutation ($locale: String!, $input: RegisterInput!){
  register(input: $input) {
    violations {
      field
      message(locale: $locale)
    }
  }
}
</query>
