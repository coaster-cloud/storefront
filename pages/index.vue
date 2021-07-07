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

          <b-media>
            <template v-slot:aside>
              <img src="~/assets/images/icons/user-interface.png" class="img-responsive teaser-icon" alt="Mobile app">
            </template>

            <markdown-text :text="$t('home.teaser_app')" />
          </b-media>

          <b-row align-h="center" class="text-center mb-4">
            <b-col cols="6" md="4">
              <a href="https://apps.apple.com/app/coaster-cloud/id1568754220" target="_blank">
                <img src="~/assets/images/appstore.svg" class="img-responsive store-icon" alt="AppStore">
              </a>
            </b-col>
            <b-col cols="6" md="4">
              <a href="https://play.google.com/store/apps/details?id=cloud.coaster.mobile" target="_blank">
                <img src="~/assets/images/playstore.png" class="img-responsive store-icon" alt="PlayStore">
              </a>
            </b-col>
          </b-row>
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
      <b-row class="pt-4">
        <b-col
          v-for="(item, index) in random"
          :key="index"
          md="6"
          lg="4"
          xl="3"
          class="mb-3"
        >
          <b-card class="card-list" no-body>
            <nuxt-link :to="localePath(item.route)">
              <b-card-img :src="item.image" :alt="item.name" top />
            </nuxt-link>

            <div class="card-body">
              <nuxt-link :to="localePath(item.route)" class="w-40 w-sm-100">
                <div class="item-title text-center text-truncate">
                  {{ item.name }}
                </div>
              </nuxt-link>

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
            <nuxt-link v-slot="{ navigate }" :to="localePath('activities')" custom>
              <b-button variant="primary" size="sm" @click="navigate">
                {{ $t('goto_activity') }}
              </b-button>
            </nuxt-link>
          </div>
        </b-media>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async fetch () {
    const me = this

    const result = await me.$graphql('e0dcadb3-dfcc-4f8d-b701-e756514f599d', { locale: me.$i18n.locale })

    me.totalParks = result.statistics.totalParks
    me.totalAttractions = result.statistics.totalAttractions
    me.totalContributions = result.statistics.totalContributions

    result.parks.items.forEach(function (park) {
      park.route =

      me.random.push({
        name: park.name,
        image: park.images[0].url,
        route: {
          name: 'parks-park',
          params: {
            park: park.fullSlug
          }
        },
        text: park.categories.map(type => type.label).join(' / ')
      })
    })

    result.attractions.items.forEach(function (attraction) {
      me.random.push({
        name: attraction.name,
        image: attraction.images[0].url,
        route: {
          name: 'attractions-attraction',
          params: {
            attraction: attraction.fullSlug
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
      title: this.$t('themepark_companion'),
      description: this.$t('discover_features')
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~/assets/css/ci";
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins';

.teaser-icon {
  max-height: 100px;
}

.store-icon {
  max-height: 40px;
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
