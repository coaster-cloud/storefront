<template>
  <div id="map" class="full-device-height" />
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      map: null,
      layer: null
    }
  },

  mounted () {
    this.map = this.$leaflet.map('map', {
      minZoom: 3
    })

    this.$leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map)

    this.map.locate({ setView: true, maxZoom: 7 })

    this.$watch('items', newItems => this.addMarkers(newItems), { immediate: true })
  },

  methods: {
    addMarkers (items) {
      const me = this

      if (me.layer !== null) {
        me.map.removeLayer(me.layer)
      }

      me.layer = me.$leaflet.markerClusterGroup({
        maxClusterRadius (zoom) {
          if (zoom < 8) {
            return 80
          }

          return 0
        }
      })

      items.forEach(function (item) {
        const marker = me.$leaflet.marker([item.latitude, item.longitude])
        marker.bindPopup(item.popup)

        me.layer.addLayer(marker)
      })

      me.map.addLayer(me.layer)
    }
  }
}
</script>

<style lang="scss">
.full-device-height {
  height: 90vh;
}
</style>
