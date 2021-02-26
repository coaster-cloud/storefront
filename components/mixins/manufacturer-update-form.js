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

    async createManufacturer (input, onSuccess = null) {
      const me = this

      const query = `
        mutation ($locale: String!, $input: CreateManufacturerInput!){
          createManufacturer(input: $input) {
            violations {
              field
              message(locale: $locale)
            }
            manufacturer {
              id
              name
              fullSlug
            }
          }
        }
      `

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale,
        input
      })

      me.violations = result.createManufacturer.violations

      if (me.violations.length === 0) {
        if (typeof onSuccess === 'function') {
          onSuccess()
        }

        me.$emit('finish', result.createManufacturer.manufacturer)
      }
    },

    async updateManufacturer (manufacturerId, input, onSuccess = null, files = {}) {
      const me = this

      const query = `
        mutation ($manufacturerId: String!, $locale: String!, $input: UpdateManufacturerInput!){
          updateManufacturer(manufacturer: $manufacturerId, input: $input) {
            violations {
              field
              message(locale: $locale)
            }
            manufacturer {
              id
              name
              fullSlug
            }
          }
        }
      `

      const result = await me.$graphql(query, {
        locale: me.$i18n.locale,
        manufacturerId,
        input
      }, files)

      me.violations = result.updateManufacturer.violations

      if (me.violations.length === 0) {
        if (typeof onSuccess === 'function') {
          onSuccess()
        }

        me.$emit('finish', result.updateManufacturer.manufacturer)
      }
    }
  }
}
