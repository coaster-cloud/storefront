import Vue from 'vue'

Vue.prototype.$trackEvent = function (message) {
  if (Object.prototype.hasOwnProperty.call(window, 'umami')) {
    window.umami(message)
  }
}
