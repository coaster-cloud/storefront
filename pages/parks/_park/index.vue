<template>
  <div>
    <div v-if="park" class="main-content">
      <breadcrumb :items="breadcrumbs" />

      <b-row>
        <b-col md="7" xl="8" order="2" order-md="1">
          <!-- Short description -->
          <div v-if="park.shortDescription" class="content-block">
            {{ park.shortDescription }}
          </div>

          <!-- Basic data -->
          <div class="content-block">
            <h5>{{ $t('basic_data') }}</h5>
            <key-value-list :items="basicData" />
          </div>

          <!-- Additional information -->
          <div v-if="park.attributes.length > 0" class="content-block">
            <h5>{{ $t('additional_information') }}</h5>
            <key-value-list :items="park.attributes" />
          </div>

          <!-- Park zones -->
          <div v-if="zones.length > 0" class="content-block">
            <h5>{{ $t('park_zones') }}</h5>
            <value-list :items="zones" />
          </div>

          <!-- History -->
          <div v-if="reverseHistory.length > 0" class="content-block">
            <h5>{{ $t('history') }}</h5>
            <value-list :items="reverseHistory" />
          </div>
        </b-col>
      </b-row>
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
    basicData () {
      const data = []

      data.push({
        label: this.$t('type'),
        type: 'route-list',
        value: this.park.types.map(function (value) {
          return {
            route: { name: 'parks', query: { type: value.key } },
            label: value.label
          }
        })
      })

      data.push({
        label: this.$t('state'),
        type: 'route',
        value: {
          route: { name: 'parks', query: { state: this.park.state.key } },
          label: this.park.state.label
        }
      })

      data.push({ label: this.$t('timezone'), type: 'label', value: this.park.timezone })
      data.push({ label: this.$t('web'), type: 'link', value: this.park.web })
      data.push({ label: this.$t('latitude'), type: 'text', value: this.park.latitude })
      data.push({ label: this.$t('longitude'), type: 'text', value: this.park.longitude })

      // Address
      const street = [this.park.address.street, this.park.address.houseNumber].filter(item => item !== null)
      const city = [this.park.address.postalCode, this.park.address.city].filter(item => item !== null)

      const address = [
        street.length > 0 ? street.join(' ') : null,
        city.length > 0 ? city.join(' ') : null,
        this.park.address.province,
        this.park.address.country ? this.park.address.country.label : null
      ].filter(item => item !== null && item.length > 0).join(', ').trim()

      data.push({
        label: this.$t('address'),
        type: 'text',
        value: address.length > 0 ? address : null
      })

      return data
    },

    zones () {
      return this.park.zones.map(item => ({ id: item.id, text: item.name }))
    },

    reverseHistory () {
      const classMap = {
        opened: { class: 'list-group-item-success' },
        closed: { class: 'list-group-item-danger' },
        renamed: { class: 'list-group-item-warning' }
      }

      const items = this.park.history

      return items.reverse().map(function (item) {
        return {
          id: item.id,
          text: `${item.date.value} | ${item.label}`,
          class: classMap[item.type].class
        }
      })
    },

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
        id
        name
        shortDescription(locale: $locale)
        slug
        types { key, label(locale: $locale) }
        state { key, label(locale: $locale) }
        web
        latitude
        longitude
        address {
            street
            houseNumber
            city
            postalCode
            province
            country { label(locale: $locale) }
        },
        timezone { label(locale: $locale) }
        zones { id, name }
        createdAt { format, value }
        updatedAt { format, value }
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
            type
            date { format, value }
            label(locale: $locale)
        },
        attributes {
            key
            type
            category
            label(locale: $locale)
            value
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
