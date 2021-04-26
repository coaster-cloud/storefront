<template>
  <div>
    <div v-if="!manufacturer" class="main-content">
      <breadcrumb :items="[{label: $t('loading')}]" />
      <skeleton-content />
    </div>

    <div v-else class="main-content">
      <breadcrumb :items="breadcrumbs" />

      <b-row>
        <b-col cols="12">
          <!-- Basic data -->
          <div class="content-block">
            <h5>{{ $t('basic_data') }}</h5>
            <key-value-list :items="basicData" />

            <div class="text-right">
              <action-button v-b-modal.update-manufacturer-basic-form modify-icon>
                {{ $t('modify.basic_data') }}
              </action-button>

              <action-button v-b-modal.update-manufacturer-address-form modify-icon>
                {{ $t('modify.address') }}
              </action-button>

              <update-manufacturer-basic-form :manufacturer-id="manufacturer.id" @finish="onModification" />
              <update-manufacturer-address-form :manufacturer-id="manufacturer.id" @finish="onModification" />
            </div>
          </div>

          <!-- Example attractions -->
          <div class="content-block">
            <h5>{{ $t('attractions') }}</h5>

            <div v-if="attractions.length === 0">
              <no-data />
            </div>

            <b-row v-else>
              <template v-for="(attraction, index) in attractions">
                <b-col :key="index" md="6" lg="4" xl="3" class="mb-3">
                  <b-card class="card-list" no-body>
                    <nuxt-link :to="localePath(attraction.route)">
                      <b-card-img :src="attraction.image" :alt="attraction.name" top />
                    </nuxt-link>

                    <div class="card-body">
                      <nuxt-link :to="localePath(attraction.route)" class="w-40 w-sm-100">
                        <div class="item-title text-center text-truncate">
                          {{ attraction.name }}
                        </div>
                      </nuxt-link>

                      <div class="pt-2 text-muted text-small text-center">
                        {{ attraction.types }}
                      </div>
                    </div>
                  </b-card>
                </b-col>
              </template>

              <b-col v-if="totalAttractions > 8" cols="12" class="text-center">
                <nuxt-link v-slot="{ navigate }" :to="localePath({ name: 'attractions', query: { manufacturer: manufacturer.id } })" custom>
                  <b-button variant="primary" size="sm" @click="navigate">
                    {{ $t('show_all_n_attractions', {total: totalAttractions}) }}
                  </b-button>
                </nuxt-link>
              </b-col>
            </b-row>
          </div>

          <!-- Contributors -->
          <div class="content-block">
            <h5>{{ $t('contributors') }}</h5>
            <ul class="contributors">
              <li v-for="(item, index) in manufacturer.contributors" :key="index">
                <nuxt-link :to="localePath({name: 'profile-username', params: {username: item.account.username}})">
                  {{ item.account.username }}
                </nuxt-link>
                ({{ item.totalContributions }})
              </li>
            </ul>
            <div>
              <nuxt-link v-slot="{ navigate }" :to="localePath({name: 'activities', query: {reference: manufacturer.id}})" custom>
                <b-button variant="light" size="sm" @click="navigate">
                  {{ $t('show_contributions') }}
                </b-button>
              </nuxt-link>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import PlaceholderImage from 'assets/images/placeholder.middle.jpg'

export default {
  async fetch () {
    await this.loadManufacturer()
  },

  data () {
    return {
      manufacturer: null,
      attractions: [],
      totalAttractions: 0
    }
  },

  computed: {
    basicData () {
      const data = []

      data.push({
        label: this.$t('category'),
        type: 'route-list',
        value: this.manufacturer.categories.map(function (value) {
          return {
            route: { name: 'manufacturers', query: { category: value.key } },
            label: value.label
          }
        })
      })

      data.push({
        label: this.$t('state'),
        type: 'route',
        value: {
          route: { name: 'manufacturers', query: { state: this.manufacturer.state.key } },
          label: this.manufacturer.state.label
        }
      })

      data.push({ label: this.$t('web'), type: 'link', value: this.manufacturer.web })

      // Address
      const street = [this.manufacturer.address.street, this.manufacturer.address.houseNumber].filter(item => item !== null)
      const city = [this.manufacturer.address.postalCode, this.manufacturer.address.city].filter(item => item !== null)

      const address = [
        street.length > 0 ? street.join(' ') : null,
        city.length > 0 ? city.join(' ') : null,
        this.manufacturer.address.province,
        this.manufacturer.address.country ? this.manufacturer.address.country.label : null
      ].filter(item => item !== null && item.length > 0).join(', ').trim()

      data.push({
        label: this.$t('address'),
        type: 'text',
        value: address.length > 0 ? address : null
      })

      return data
    },

    breadcrumbs () {
      return [
        {
          label: this.$t('home'),
          route: 'index'
        },
        {
          label: this.$t('manufacturers'),
          route: 'manufacturers'
        },
        {
          label: this.manufacturer.name
        }
      ]
    }
  },

  methods: {
    async loadManufacturer () {
      const me = this

      const result = await me.$graphql('05364611-4543-4dba-9261-762cd56b72be', {
        manufacturerSlug: me.$route.params.manufacturer,
        locale: me.$i18n.locale,
        itemsPerPage: 8,
        filter: {
          manufacturer: me.$route.params.manufacturer
        }
      })

      if (!result.manufacturer) {
        me.$nuxt.error({ statusCode: 404 })

        return
      }

      this.manufacturer = result.manufacturer
      this.totalAttractions = result.attractions.pagination.totalItems
      this.attractions = result.attractions.items.map(function (attraction) {
        return {
          name: attraction.name,
          types: attraction.category.label,
          image: _.get(attraction, 'images[0].url', PlaceholderImage),
          route: {
            name: 'attractions-attraction',
            params: {
              attraction: attraction.fullSlug
            }
          }
        }
      })
    },

    onModification (manufacturer) {
      this.$trackEvent('Manufacturer modified')

      if (manufacturer.fullSlug !== this.$route.params.manufacturer) {
        this.$router.replace(this.localePath({
          name: 'manufacturers-manufacturer',
          params: { manufacturer: manufacturer.fullSlug }
        }))

        return
      }

      this.loadManufacturer()
    }
  },

  head () {
    if (this.manufacturer) {
      return this.$createHead({
        title: this.manufacturer.name,
        description: this.$t('generic_manufacturer_description', { manufacturer: this.manufacturer.name })
      })
    }

    return {}
  }
}
</script>
