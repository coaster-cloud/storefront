<template>
  <b-navbar toggleable="lg" variant="fade" type="light">
    <b-navbar-brand>
      <router-link :to="localePath('index')">
        <img src="~/assets/images/logo.png" class="img-responsive navbar-brand-img">
      </router-link>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item key="nav-item-parks" :to="localePath('parks')">
          {{ $t('parks') }}
        </b-nav-item>

        <b-nav-item key="nav-item-attractions" :to="localePath('attractions')">
          {{ $t('attractions') }}
        </b-nav-item>

        <b-nav-item key="nav-item-manufacturers" :to="localePath('manufacturers')">
          {{ $t('manufacturers') }}
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-form key="nav-item-edit-mode" class="form-inline-nav">
          <b-form-checkbox v-model="editMode" switch>
            {{ $t('edit_mode') }}
          </b-form-checkbox>
        </b-nav-form>

        <!-- Logged in -->
        <template v-if="$store.getters['account/hasToken']">
          <b-nav-item-dropdown key="nav-item-logout" right>
            <template v-slot:button-content>
              {{ $t('my_profile') }}
            </template>

            <b-dropdown-item :to="localePath({name: 'profile-username', params: {username: $store.getters['account/getUsername']}})">
              {{ $t('public_profile') }}
            </b-dropdown-item>

            <b-dropdown-item v-b-modal.update-account-form>
              {{ $t('settings') }}
            </b-dropdown-item>

            <b-dropdown-item @click="logout">
              {{ $t('logout') }}
            </b-dropdown-item>
          </b-nav-item-dropdown>

          <update-account-form />
        </template>

        <!-- Logged out -->
        <template v-if="!$store.getters['account/hasToken']">
          <b-nav-item-dropdown key="nav-item-login" right>
            <template v-slot:button-content>
              {{ $t('login') }}
            </template>

            <b-dropdown-item v-b-modal.login-form>
              {{ $t('login') }}
            </b-dropdown-item>

            <b-dropdown-item v-b-modal.register-form>
              {{ $t('register') }}
            </b-dropdown-item>
          </b-nav-item-dropdown>

          <login-form />
          <register-form />
          <reset-password-form />
        </template>

        <b-nav-item-dropdown key="nav-item-locale" right>
          <template v-slot:button-content>
            <i :class="currentLocale.icon" class="flag-icon current-locale" />
            <span class="d-lg-none">{{ $t('locale') }}</span>
          </template>

          <b-dropdown-item
            v-for="locale in availableLocales"
            :key="locale.code"
            :to="switchLocalePath(locale.code)"
          >
            <i :class="locale.icon" class="flag-icon available-locale" /> {{ locale.label }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {

  computed: {
    currentLocale () {
      return this.$i18n.locales.filter(i => i.code === this.$i18n.locale)[0]
    },

    availableLocales () {
      return this.$i18n.locales
    },

    editMode: {
      get () {
        return this.$store.getters['common/getEditMode']
      },

      set (value) {
        this.$store.commit('common/setEditMode', value)
      }
    }
  },
  created () {
    this.initiateSession()
  },

  methods: {
    logout () {
      this.$store.commit('account/unauthenticate')

      this.$root.$bvToast.toast(this.$t('logout_success'), {
        title: this.$t('logout'),
        variant: 'success'
      })
    },

    initiateSession () {
      const me = this

      me.$store.commit('account/reauthenticate')

      // Check every 30 seconds the token
      setInterval(function () {
        if (me.$store.getters['account/getTokenExpiresAt'] === null) {
          return
        }

        if (me.$store.getters['account/getTokenExpiresAt'] > (new Date().getTime() / 1000)) {
          return
        }

        me.$store.commit('account/unauthenticate')

        me.$root.$bvToast.toast(me.$t('session_expired'), {
          title: me.$t('logout'),
          variant: 'danger'
        })
      }, 30000)
    }
  }
}
</script>

<style lang="scss">
@import "~/assets/css/ci.scss";

.navbar {
  background-color: #fff !important;
}

.navbar-brand-img {
  max-height: 60px;
  max-width: 60px;
}

.nav-link {
  color: $secondary !important;
  padding-right: 1.0rem !important;
  padding-left: 1.0rem !important;
  font-weight: 200;
  font-size: larger;
  &:hover {
    color: $primary !important;;
  }
}

.router-link-active {
  color: $primary !important;;
}

.form-inline-nav {
  padding-right: 1.0rem !important;
  padding-left: 1.0rem !important;
}
</style>
