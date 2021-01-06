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
    id="reset-password-form"
    size="xs"
    :title="$t('change_password')"
    no-stacking
    @hidden="reset"
  >
    <div class="text-muted text-small">
      {{ $t('reset_password_introduction') }}
    </div>

    <alert-list :values="globalViolations" />

    <text-input
      id="register-form-email"
      v-model="email"
      :label="$t('email')"
      :label-col="12"
      :violations="emailViolations"
    />

    <template v-slot:modal-footer="{ ok }">
      <b-button variant="primary ml-auto" @click="save(ok)">
        {{ $t('confirm_email') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      violations: []
    }
  },

  computed: {
    globalViolations () {
      return this.violations.filter(v => v.field === null).map(v => v.message)
    },

    emailViolations () {
      return this.violations.filter(v => v.field === 'email').map(v => v.message)
    }
  },

  methods: {
    reset () {
      this.email = ''
      this.violations = []
    },

    async save (ok) {
      const me = this

      const result = await me.$graphql(me.$options.__query, {
        locale: me.$i18n.locale,
        input: {
          email: me.email
        }
      })

      me.violations = result.resetPassword.violations

      if (me.violations.length === 0) {
        ok()

        this.$root.$bvToast.toast(this.$t('reset_password_success'), {
          title: this.$t('change_password'),
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
mutation ($locale: String!, $input: ResetPasswordInput!){
  resetPassword(input: $input) {
    violations {
      field
      message(locale: $locale)
    }
  }
}
</query>
