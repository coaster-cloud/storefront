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

    async createAttraction (input, onSuccess = null) {
      const me = this

      const query = `
        mutation ($locale: String!, $input: CreateAttractionInput!){
          createAttraction(input: $input) {
            violations {
              field
              message(locale: $locale)
            }
            attraction {
              id
              name
              slug
              park {
                id
                name
                slug
              }
            }
          }
        }
      `

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale,
        input
      })

      me.violations = result.createAttraction.violations

      if (me.violations.length === 0) {
        if (typeof onSuccess === 'function') {
          onSuccess()
        }

        me.$emit('finish', result.createAttraction.attraction)
      }
    },

    async updateAttraction (attractionId, input, onSuccess = null) {
      const me = this

      const query = `
        mutation ($attractionId: String!, $locale: String!, $input: UpdateAttractionInput!){
          updateAttraction(attraction: $attractionId, input: $input) {
            violations {
              field
              message(locale: $locale)
            }
            attraction {
              id
              name
              slug
              park {
                id
                name
                slug
              }
            }
          }
        }
      `

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale,
        attractionId: me.attractionId,
        input
      })

      me.violations = result.updateAttraction.violations

      if (me.violations.length === 0) {
        if (typeof onSuccess === 'function') {
          onSuccess()
        }

        me.$emit('finish', result.updateAttraction.attraction)
      }
    }
  }
}
