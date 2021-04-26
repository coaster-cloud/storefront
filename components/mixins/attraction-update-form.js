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

      const result = await me.$graphql('7be26569-e9b2-46aa-a082-6d6abd564aa9', {
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

    async updateAttraction (attractionId, input, onSuccess = null, files = {}) {
      const me = this

      const result = await me.$graphql('68034f88-d314-4177-bc07-b2c2dd799d5b', {
        locale: me.$i18n.locale,
        attractionId,
        input
      }, files)

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
