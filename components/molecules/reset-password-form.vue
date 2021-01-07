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
    @show="load"
  >
    <div class="text-muted text-small">
      {{ $t('reset_password_introduction') }}
    </div>

    <alert-list :values="violations.filter(v => v.field === null).map(v => v.message)" />

    <text-input
      id="register-form-email"
      v-model="email"
      :label="$t('email')"
      :label-col="12"
      :violations="violations.filter(v => v.field === 'email').map(v => v.message)"
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
      email: null,
      violations: []
    }
  },

  methods: {
    load () {
      this.email = null
      this.violations = []
    },

    async save (ok) {
      const me = this

      const query = `
        mutation ($locale: String!, $input: ResetPasswordInput!){
          resetPassword(input: $input) {
            violations {
              field
              message(locale: $locale)
            }
          }
        }
      `

      const result = await me.$graphql(query, {
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
      }
    }
  }
}
</script>
