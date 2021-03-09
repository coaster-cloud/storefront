import Vue from 'vue'

import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/images/marker-icon.png'
import 'leaflet/dist/images/marker-icon-2x.png'
import 'leaflet/dist/images/marker-shadow.png'
import Leaflet from 'leaflet'

import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import LeafletMarkerCluster from 'leaflet.markercluster'

Vue.prototype.$leaflet = Leaflet
Vue.prototype.$leafletMarkerCluster = LeafletMarkerCluster
