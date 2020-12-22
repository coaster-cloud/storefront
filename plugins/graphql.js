import Vue from 'vue'
import _ from 'lodash'

Vue.prototype.$graphql = async function (query, variables = {}) {
  const me = this
  let result = null

  me.$store.commit('common/setLoading', true)

  try {
    const response = await me.$axios.post(me.$config.dataServiceUrl, {
      query,
      variables
    })

    const errors = _.get(response, 'data.errors', [])
    if (errors.length > 0) {
      throw new Error(_.get(errors, '[0].message', 'Unknown error'))
    }

    result = response.data.data
  } catch (error) {
    me.$sentry.captureException(error)
  } finally {
    me.$store.commit('common/setLoading', false)
  }

  return result
}
