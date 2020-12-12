import Vue from 'vue'

Vue.prototype.$image = function (imageUrl, value, size) {
  const fileId = [
    value.substr(0, 2),
    value.substr(2, 2),
    value.substr(4, 2),
    value
  ].join('/')

  imageUrl = imageUrl.replace('{fileId}', fileId)
  imageUrl = imageUrl.replace('{size}', size)

  return imageUrl
}
