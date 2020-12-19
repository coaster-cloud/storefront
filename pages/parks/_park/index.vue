<template>
  <div>
    <div v-if="park" class="main-content">
      <breadcrumb :items="breadcrumbs" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  async fetch () {
    await this.loadPark()
  },

  data () {
    return {
      park: null
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
          label: this.park.name
        }
      ]
    }
  },

  methods: {
    async loadPark () {
      const me = this

      const result = await me.$axios.post(me.$config.dataServiceUrl, {
        query: me.$options.__query,
        variables: {
          parkSlug: me.$route.params.park,
          locale: me.$i18n.locale
        }
      }).then(res => res.data.data)

      this.park = result.park
    }
  },

  head () {
    return this.$createHead({
      title: _.get(this.park, 'name', null),
      description: _.get(this.park, 'shortDescription', null)
    })
  }
}
</script>

<query>
query ($parkSlug: String!, $locale: String!) {
    park(id: $parkSlug) {
        id,
        name,
        shortDescription(locale: $locale),
        slug,
        types { key, label(locale: $locale) },
        state { key, label(locale: $locale) },
        web,
        latitude,
        longitude,
        address {
            street,
            houseNumber,
            city,
            postalCode,
            province,
            country { label(locale: $locale) }
        },
        timezone { label(locale: $locale) }
        zones { id, name }
        createdAt { format, value },
        updatedAt { format, value },
        images {
          fileId
          middle: url(size: MIDDLE)
          large: url(size: LARGE)
          contributor {
            username
          }
          customCopyrightName
          customCopyrightUrl
        },
        history {
          id
            date { format, value },
            label(locale: $locale)
        },
        attributes {
            key,
            type,
            category
            label(locale: $locale),
            valueAsString(locale: $locale)
        },
        contributors {
            account {
              username
            }
            totalContributions
        }
    }
}
</query>
