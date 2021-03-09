import Vue from 'vue'

import 'leaflet/dist/leaflet.css'
import Leaflet from 'leaflet'

import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import LeafletMarkerCluster from 'leaflet.markercluster'

delete Leaflet.Icon.Default.prototype._getIconUrl

Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

Vue.prototype.$leaflet = Leaflet
Vue.prototype.$leafletMarkerCluster = LeafletMarkerCluster
