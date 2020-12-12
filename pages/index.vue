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
            <NuxtLink :to="localePath(item.route)">
              <b-card-img :src="$image($config.imageUrl, item.image, 'middle')" top />
            </NuxtLink>

            <div class="card-body">
              <NuxtLink :to="localePath(item.route)" class="w-40 w-sm-100">
                <div class="item-title text-center text-truncate">
                  {{ item.name }}
                </div>
              </NuxtLink>

              <div class="pt-2 text-muted text-small text-center">
                {{ item.text }}
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

    const result = await me.$axios.post(me.$config.dataServiceUrl, {
      query: me.$options.__query, variables: { locale: me.$i18n.locale }
    }).then(res => res.data.data)

    result.parks.items.forEach(function (park) {
      park.route =

      me.random.push({
        name: park.name,
        image: park.images[0].fileId,
        route: {
          name: 'parks-park',
          params: {
            park: park.slug
          }
        },
        text: park.types.map(type => type.label).join(' / ')
      })
    })

    result.attractions.items.forEach(function (attraction) {
      me.random.push({
        name: attraction.name,
        image: attraction.images[0].fileId,
        route: {
          name: 'parks-park-attractions-attraction',
          params: {
            park: attraction.park.slug,
            attraction: attraction.slug
          }
        },
        text: attraction.category.label
      })
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
  query ($locale: String!) {
    parks(itemsPerPage: 2, sort: RANDOM, filter: {images: {operator: GREATER_THAN_EQUAL, value: 1}}) {
      items {
        id
        name
        slug
        types { label(locale: $locale)}
        images { fileId }
      }
    },
    attractions(itemsPerPage: 2, sort: RANDOM, filter: {images: {operator: GREATER_THAN_EQUAL, value: 1}}) {
      items {
        id
        name
        slug
        category { label(locale: $locale)}
        images { fileId }
        park { slug }
      }
    }
  }
</query>
