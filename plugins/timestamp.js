import Vue from 'vue'
import Moment from 'moment'

Vue.filter('timestamp', function (date, locale) {
  Moment.locale(locale)

  const moment = Moment(date.value, date.format)

  if (date.format === 'YYYY-MM-DDTHH:mm:ss') {
    return moment.format('DD.MM.YYYY')
  }

  if (date.format === 'YYYY-MM-DD') {
    return moment.format('DD.MM.YYYY')
  }

  if (date.format === 'YYYY-MM') {
    return moment.format('MMMM YYYY')
  }

  if (date.format === 'YYYY') {
    return moment.format('YYYY')
  }
})
