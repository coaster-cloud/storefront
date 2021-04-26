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

      const result = await me.$graphql('4f11d034-1551-4d5b-b4cf-3f896557d52a', {
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

      const result = await me.$graphql('755c8aa1-362a-460f-ad03-41f3d0304a29', {
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
