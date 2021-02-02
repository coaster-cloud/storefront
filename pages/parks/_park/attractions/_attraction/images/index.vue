<template>
  <div>
    <div v-if="!attraction" class="main-content">
      <breadcrumb :items="[{label: $t('loading')}]" />
      <skeleton-card-list />
    </div>

    <div v-if="attraction" class="main-content">
      <breadcrumb :items="breadcrumbs" />

      <!-- Image add -->
      <div class="text-center mb-3">
        <action-button v-b-modal.add-attraction-image-form add-icon>
          {{ $t('upload_image') }}
        </action-button>

        <add-attraction-image-form :attraction-id="attraction.id" @finish="loadAttraction" />
      </div>

      <div v-if="attraction.images.length === 0">
        <no-data />
      </div>

      <b-row v-else>
        <template v-for="(image, index) in attraction.images">
          <b-col :key="index" md="6" xl="4" class="mb-3">
            <b-card no-body class="card-list">
              <b-card-img :src="image.middle" top class="pointer" @click="currentImage = index" />

              <template v-slot:footer>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span class="text-small text-muted" v-html="buildCopyrightNotice(image)" />

                <div v-if="canDeleteImage(image)" class="mt-3">
                  <action-button v-b-modal="`delete-attraction-image-form-${image.id}`" delete-icon>
                    {{ $t('delete') }}
                  </action-button>

                  <delete-attraction-image-form :attraction-id="attraction.id" :image-id="image.id" @finish="loadAttraction()" />
                </div>

                <div v-else class="mt-3">
                  <action-button delete-icon disabled>
                    {{ $t('delete') }}
                  </action-button>
                </div>
              </template>
            </b-card>
          </b-col>
        </template>

        <client-only>
          <CoolLightBox
            :items="attraction.images.map(item => ({thumb: item.middle, src: item.large, description: buildCopyrightNotice(item)}))"
            :index="currentImage"
            loop
            @close="currentImage = null"
          />
        </client-only>
      </b-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'

export default {
  components: { CoolLightBox },

  async fetch () {
    await this.loadAttraction()
  },

  data () {
    return {
      park: null,
      attraction: null,
      currentImage: null
    }
  },

  computed: {
    breadcrumbs () {
      return [
        {
          label: this.$t('home'),
          route: 'index'
        },
        {
          label: this.$t('parks'),
          route: 'parks'
        },
        {
          label: this.park.name,
          route: { name: 'parks-park', params: { park: this.park.slug } }
        },
        {
          label: this.$t('attractions'),
          route: { name: 'parks-park-attractions', params: { park: this.park.slug } }
        },
        {
          label: this.attraction.name,
          route: { name: 'parks-park-attractions-attraction', params: { attraction: this.attraction.slug, park: this.park.slug } }
        },
        {
          label: this.$t('image_gallery')
        }
      ]
    }
  },

  methods: {
    async loadAttraction () {
      const me = this

      const result = await me.$graphql(me.$options.__query, {
        attractionSlug: me.$route.params.park + '/' + me.$route.params.attraction,
        locale: me.$i18n.locale
      })

      if (!result.attraction) {
        me.$nuxt.error({ statusCode: 404 })

        return
      }

      this.park = result.attraction.park
      this.attraction = result.attraction
    },

    buildCopyrightNotice (image) {
      const profileUrl = this.$router.resolve(this.localePath({
        name: 'profile-username',
        params: { username: image.contributor.username }
      }))

      return this.$t('image_copyright', {
        year: image.date.value.substr(0, 4),
        profileUrl: image.customCopyrightUrl ?? profileUrl.resolved.fullPath,
        profileName: image.customCopyrightName ?? image.contributor.username,
        licenseUrl: image.license.url,
        licenseName: image.license.name
      })
    },

    canDeleteImage (image) {
      const me = this

      if (!me.$store.getters['account/hasToken']) {
        return false
      }

      if (me.$store.getters['account/getUsername'] === image.contributor.username) {
        return true
      }

      return me.$store.getters['account/getRoles'].includes('ROLE_MAINTAINER')
    }
  },

  head () {
    return this.$createHead({
      title: _.get(this.attraction, 'name', null),
      description: _.get(this.attraction, 'shortDescription', null)
    })
  }
}
</script>

<query>
query ($attractionSlug: String!, $locale: String!) {
    attraction(id: $attractionSlug) {
        id
        name
        shortDescription(locale: $locale)
        slug
        park {
          id
          name
          slug
        }
        images {
          id
          middle: url(size: MIDDLE)
          large: url(size: LARGE)
          contributor { username }
          license { name, url }
          date { format, value }
          customCopyrightName
          customCopyrightUrl
        }
    }
}
</query>
