import Vue from 'vue'
import _ from 'lodash'

Vue.prototype.$graphql = async function (query, variables = {}, files = {}) {
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

  let formData = null
  if (Object.keys(files).length > 0) {
    headers['Content-Type'] = 'multipart/form-data'

    formData = new FormData()
    formData.append('query', query)
    formData.append('variables', JSON.stringify(variables))

    Object.keys(files).forEach(function (field) {
      formData.append(field, files[field])
    })
  } else {
    formData = {
      query,
      variables
    }
  }

  try {
    const response = await me.$axios.post(me.$config.dataServiceUrl, formData, { headers })

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
