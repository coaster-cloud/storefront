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
    scrollable
    @show="load"
  >
    <div class="text-muted text-small">
      {{ $t('reset_password_introduction') }}
    </div>

    <text-input
      id="register-form-email"
      v-model="email"
      :label="$t('email')"
      :label-col="12"
      :violations="getFieldViolations('[email]')"
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
    getFieldViolations (path) {
      return this.violations.filter(v => v.field === path).map(v => v.message)
    },

    load () {
      this.email = null
      this.violations = []
    },

    async save (ok) {
      const me = this

      const result = await me.$graphql('271afccb-a1c5-48dc-a291-1ef010f46705', {
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
          variant: 'success'
        })
      }
    }
  }
}
</script>
