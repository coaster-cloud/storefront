import Vue from 'vue'
import Marked from 'marked'

Vue.prototype.$markdown = function (content) {
  return Marked(content)
}
