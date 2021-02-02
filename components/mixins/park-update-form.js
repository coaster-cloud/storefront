export default {
  data () {
    return {
      violations: []
    }
  },

  methods: {
    getFieldViolations (path) {
      return this.violations.filter(v => v.field === path).map(v => v.message)
    },

    async createPark (input, onSuccess = null) {
      const me = this

      const query = `
        mutation ($locale: String!, $input: CreateParkInput!){
          createPark(input: $input) {
            violations {
              field
              message(locale: $locale)
            }
            park {
              id
              name
              slug
            }
          }
        }
      `

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale,
        input
      })

      me.violations = result.createPark.violations

      if (me.violations.length === 0) {
        if (typeof onSuccess === 'function') {
          onSuccess()
        }

        me.$emit('finish', result.createPark.park)
      }
    },

    async updatePark (parkId, input, onSuccess = null, files = {}) {
      const me = this

      const query = `
        mutation ($parkId: String!, $locale: String!, $input: UpdateParkInput!){
          updatePark(park: $parkId, input: $input) {
            violations {
              field
              message(locale: $locale)
            }
            park {
              id
              name
              slug
            }
          }
        }
      `

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale,
        parkId,
        input
      }, files)

      me.violations = result.updatePark.violations

      if (me.violations.length === 0) {
        if (typeof onSuccess === 'function') {
          onSuccess()
        }

        me.$emit('finish', result.updatePark.park)
      }
    }
  }
}
