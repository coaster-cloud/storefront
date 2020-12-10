<template>
  <div>
    <hero />

    <div class="main-content">
      <h5 class="text-center">
        Work in Progress
      </h5>
      <b-row>
        <b-col
          v-for="(item, index) in random"
          :key="index"
          md="6"
          lg="4"
          xl="3"
          class="mb-3"
        >
          <b-card class="card-list" no-body>
            <!--<router-link :to="item.route">-->
            <b-card-img :src="$image($config.imageUrl, item.images[0].fileId, 'middle')" top />
            <!--</router-link>-->

            <div class="card-body">
              <!--<router-link :to="item.route" class="w-40 w-sm-100">-->
              <div class="item-title text-center text-truncate">
                {{ item.name }}
              </div>
              <!--</router-link>-->

              <div class="pt-2 text-muted text-small text-center">
                <!--{{ item.text }}-->
              </div>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Hero from '~/components/organisms/hero'

export default {
  components: {
    Hero
  },

  async fetch () {
    const me = this

    const result = await this.$axios.post(this.$config.dataServiceUrl, {
      query: this.$options.__query
    }).then(res => res.data.data)

    result.parks.items.forEach(function (park) {
      me.random.push(park)
    })

    result.attractions.items.forEach(function (park) {
      me.random.push(park)
    })
  },

  data () {
    return {
      random: []
    }
  }
}
</script>

<query>
  query {
    parks(itemsPerPage: 2, sort: RANDOM, filter: {images: {operator: GREATER_THAN_EQUAL, value: 1}}) {
      items {
        id, name, images { fileId }
      }
    },
    attractions(itemsPerPage: 2, sort: RANDOM, filter: {images: {operator: GREATER_THAN_EQUAL, value: 1}}) {
      items {
        id, name, images { fileId }
      }
    }
  }
</query>
