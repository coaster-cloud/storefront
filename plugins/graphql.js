import Vue from 'vue'
import _ from 'lodash'

Vue.prototype.$graphql = async function (query, variables = {}) {
  const me = this
  let result = null

  const loading = _.get(variables, 'loading', function (state) {
    me.$store.commit('common/setLoading', state)
  })

  const headers = {}
  if (me.$store.getters['account/hasToken']) {
    headers['X-AUTH-TOKEN'] = me.$store.getters['account/getToken']
  }

  loading(true)

  try {
    const response = await me.$axios.post(
      me.$config.dataServiceUrl,
      {
        query,
        variables
      },
      {
        headers
      }
    )

    const errors = _.get(response, 'data.errors', [])
    if (errors.length > 0) {
      throw new Error(_.get(errors, '[0].message', 'Unknown error'))
    }

    result = response.data.data
  } catch (error) {
    me.$sentry.captureException(error)
  } finally {
    loading(false)
  }

  return result
}
