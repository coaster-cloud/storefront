import Vue from 'vue'

Vue.prototype.$createHead = function (params = {}) {
  const head = {
    meta: [],
    script: []
  }

  if (Object.prototype.hasOwnProperty.call(params, 'title') && params.title !== null) {
    head.title = params.title
    head.meta.push({ hid: 'og:title', property: 'og:title', content: params.title + ' @ coaster.cloud' })
  }

  if (Object.prototype.hasOwnProperty.call(params, 'description') && params.description !== null) {
    head.meta.push({ hid: 'description', name: 'description', content: params.description })
    head.meta.push({ hid: 'og:description', property: 'og:description', content: params.description })
  }

  if (Object.prototype.hasOwnProperty.call(params, 'image') && params.image !== null) {
    head.meta.push({ hid: 'og:image', property: 'og:image', content: params.image })
  }

  if (Object.prototype.hasOwnProperty.call(params, 'index') && params.index === false) {
    head.meta.push({ hid: 'robots', name: 'robots', content: 'noindex' })
  }

  if (Object.prototype.hasOwnProperty.call(params, 'structuredData') && params.structuredData !== null) {
    head.script.push({ vmid: 'structuredData', hid: 'structuredData', type: 'application/ld+json', innerHTML: JSON.stringify(params.structuredData) })

    head.__dangerouslyDisableSanitizersByTagID = {
      structuredData: ['innerHTML']
    }
  }

  return head
}
