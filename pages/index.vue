<template>
  <div>
    <hero />

    <div class="main-content">
      <h1 class="text-primary text-center">
        {{ $t('home.welcome') }}
      </h1>

      <b-row>
        <!-- Teaser -->
        <b-col md="8">
          <b-media>
            <template v-slot:aside>
              <img src="~/assets/images/icons/count.png" class="img-responsive teaser-icon" alt="Count">
            </template>

            <markdown-text :text="$t('home.teaser_count_rides')" />
          </b-media>

          <b-media>
            <template v-slot:aside>
              <img src="~/assets/images/icons/bar-chart.png" class="img-responsive teaser-icon" alt="Statistics">
            </template>

            <markdown-text :text="$t('home.teaser_statistics')" />
          </b-media>

          <b-media>
            <template v-slot:aside>
              <img src="~/assets/images/icons/rating.png" class="img-responsive teaser-icon" alt="Rating">
            </template>

            <markdown-text :text="$t('home.teaser_rating')" />
          </b-media>
        </b-col>

        <!-- Metrics -->
        <b-col md="4">
          <b-row class="number-row">
            <b-col sm="4" md="12">
              <b-card no-body class="border-0 text-center">
                <p class="text-muted h3">
                  {{ $t('parks') }}
                </p>
                <magic-number :to="totalParks" class="text-primary h1" />
              </b-card>
            </b-col>

            <b-col sm="4" md="12">
              <b-card no-body class="border-0 text-center">
                <p class="text-muted h3">
                  {{ $t('attractions') }}
                </p>
                <magic-number :to="totalAttractions" class="text-primary h1" />
              </b-card>
            </b-col>

            <b-col sm="4" md="12">
              <b-card no-body class="border-0 text-center">
                <p class="text-muted h3">
                  {{ $t('contributions') }}
                </p>
                <magic-number :to="totalContributions" class="text-primary h1" />
              </b-card>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <!-- Random parks / attractions -->
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

      <!-- Community teaser -->
      <div class="main-content">
        <b-media>
          <template v-slot:aside>
            <img src="~/assets/images/icons/people.png" class="img-responsive teaser-icon" alt="People">
          </template>

          <markdown-text :text="$t('home.teaser_community')" />

          <div class="text-right">
            <NuxtLink tag="button" :to="localePath('activities')" class="btn btn-primary btn-sm">
              {{ $t('goto_activity') }}
            </NuxtLink>
          </div>
        </b-media>
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownText from '~/components/atoms/markdown-text'
import MagicNumber from '~/components/atoms/magic-number'
import Hero from '~/components/organisms/hero'

export default {
  components: {
    MagicNumber,
    Hero,
    MarkdownText
  },

  async fetch () {
    const me = this

    const result = await me.$axios.post(me.$config.dataServiceUrl, {
      query: me.$options.__query, variables: { locale: me.$i18n.locale }
    }).then(res => res.data.data)

    me.totalParks = result.statistics.totalParks
    me.totalAttractions = result.statistics.totalAttractions
    me.totalContributions = result.statistics.totalContributions

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
      random: [],
      totalParks: 0,
      totalAttractions: 0,
      totalContributions: 0
    }
  },

  head () {
    return this.$createHead({
      title: this.$t('meta.title'),
      description: this.$t('meta.description')
    })
  }
}
</script>

<query>
  query ($locale: String!) {
    statistics {
      totalParks
      totalAttractions
      totalContributions
    }
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

<style lang="scss" scoped>
@import "~/assets/css/ci";
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins';

.teaser-icon {
  max-height: 100px;
}

.media {
  padding-bottom: 1rem;
}

.hero {
  border-top: 1px solid $primary;
  border-bottom: 1px solid $primary;
}

@include media-breakpoint-up(md) {
  .number-row {
    div:not(:last-child){
      margin-bottom: 2rem;
    }
  }
}
</style>
