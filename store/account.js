import JwtDecode from 'jwt-decode'

export default {
  state () {
    return {
      username: null,
      roles: [],
      token: null,
      expiresAt: null
    }
  },

  mutations: {
    reauthenticate (state) {
      const token = this.$cookies.get('_token')

      if (!token) {
        return
      }

      const decodedToken = JwtDecode(token)
      if (decodedToken.exp <= (new Date().getTime() / 1000)) {
        this.$cookies.remove('_token')

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

      this.$cookies.set(
        '_token',
        token,
        {
          expires: new Date(state.expiresAt * 1000),
          sameSite: true
        }
      )
    },

    unauthenticate (state) {
      state.token = null
      state.expiresAt = null
      state.username = null
      state.roles = []

      this.$cookies.remove('_token')
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
