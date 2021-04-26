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

      const result = await me.$graphql('83c5d919-f8a0-4820-9886-e72b7db4bf13', {
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

      const result = await me.$graphql('7901c63a-e4c0-4f19-977e-7ca5fafc7c15', {
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
