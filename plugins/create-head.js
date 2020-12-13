import Vue from 'vue'

Vue.prototype.$createHead = function (params = {}) {
  const head = {
    meta: []
  }

  if (Object.prototype.hasOwnProperty.call(params, 'title')) {
    head.title = params.title
    head.meta.push({ hid: 'og:title', name: 'og:title', content: params.title })
  }

  if (Object.prototype.hasOwnProperty.call(params, 'description')) {
    head.meta.push({ hid: 'description', name: 'description', content: params.description })
    head.meta.push({ hid: 'og:description', name: 'og:description', content: params.description })
  }

  return head
}
