import VueCookies from 'vue-cookies'
import JwtDecode from 'jwt-decode'

export default {
  state: {
    username: null,
    roles: [],
    token: null,
    expiresAt: null
  },

  mutations: {
    reauthenticate (state) {
      const token = VueCookies.get('_token')

      if (token === null) {
        return
      }

      const decodedToken = JwtDecode(token)
      if (decodedToken.exp <= (new Date().getTime() / 1000)) {
        VueCookies.remove('_token')

        return
      }

      state.token = token
      state.username = decodedToken.username
      state.roles = decodedToken.roles
      state.expiresAt = decodedToken.exp
    },

    authenticate (state, token) {
      const decodedToken = JwtDecode(token)

      state.token = token
      state.username = decodedToken.username
      state.roles = decodedToken.roles
      state.expiresAt = decodedToken.exp

      VueCookies.set(
        '_token',
        token,
        new Date(state.expiresAt * 1000).toUTCString(),
        '',
        '',
        window.location.href.match('https') !== null
      )
    },

    unauthenticate (state) {
      state.token = null
      state.expiresAt = null
      state.username = null
      state.roles = []

      VueCookies.remove('_token')
    }
  },
  getters: {
    hasToken (state) {
      return state.token !== null
    },

    getToken (state) {
      return state.token
    },

    getTokenExpiresAt (state) {
      return state.expiresAt
    },

    getUsername (state) {
      return state.username
    },

    getRoles (state) {
      return state.roles
    }
  }
}
