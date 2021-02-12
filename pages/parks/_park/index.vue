<template>
  <div>
    <div v-if="!park" class="main-content">
      <breadcrumb :items="[{label: $t('loading')}]" />
      <skeleton-content />
    </div>

    <div v-else class="main-content">
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

            <div class="text-right">
              <action-button v-b-modal.update-park-basic-form modify-icon>
                {{ $t('modify.basic_data') }}
              </action-button>

              <action-button v-b-modal.update-park-short-description-form modify-icon>
                {{ $t('modify.short_description') }}
              </action-button>

              <action-button v-b-modal.update-park-address-form modify-icon>
                {{ $t('modify.address') }}
              </action-button>

              <update-park-basic-form :park-id="park.id" @finish="onModification" />
              <update-park-short-description-form :park-id="park.id" @finish="onModification" />
              <update-park-address-form :park-id="park.id" @finish="onModification" />
            </div>
          </div>

          <!-- Additional information -->
          <div v-if="attributes.length > 0 || $store.getters['common/getEditMode']" class="content-block">
            <h5>{{ $t('additional_information') }}</h5>
            <key-value-list :items="attributes" />

            <div class="text-right">
              <action-button v-b-modal.update-park-attributes-form modify-icon>
                {{ $t('modify.additional_information') }}
              </action-button>

              <update-park-attributes-form :park-id="park.id" @finish="onModification" />
            </div>
          </div>

          <!-- Park zones -->
          <div v-if="zones.length > 0 || $store.getters['common/getEditMode']" class="content-block">
            <h5>{{ $t('park_zones') }}</h5>

            <b-table-simple small bordered responsive="sm">
              <b-thead>
                <b-tr>
                  <b-th class="table-light-th">
                    {{ $t('name') }}
                  </b-th>
                  <b-th class="table-light-th text-center">
                    {{ $t('opening') }}
                  </b-th>
                  <b-th class="table-light-th text-center">
                    {{ $t('closing') }}
                  </b-th>
                  <b-th class="table-light-th text-center">
                    {{ $t('attractions') }}
                  </b-th>
                  <b-th v-if="$store.getters['common/getEditMode']" class="table-light-th table-actions-th text-center">
                    {{ $t('actions') }}
                  </b-th>
                </b-tr>
              </b-thead>

              <b-tbody>
                <b-tr v-for="(zone, index) in park.zones" :key="index">
                  <b-td class="align-middle">
                    <div>
                      {{ zone.name }}
                    </div>

                    <small v-if="zone.formerNames.length > 0">
                      {{ $t('former_names') }}: {{ zone.formerNames.join(', ') }}
                    </small>
                  </b-td>
                  <b-td class="text-center align-middle">
                    <template v-if="zone.openedAt">
                      {{ zone.openedAt | timestamp($i18n.locale) }}
                    </template>
                  </b-td>
                  <b-td class="text-center align-middle">
                    <template v-if="zone.closedAt">
                      {{ zone.closedAt | timestamp($i18n.locale) }}
                    </template>
                  </b-td>
                  <b-td class="text-center align-middle">
                    <div v-if="zone.totalAttractions > 0">
                      <nuxt-link :to="localePath({name: 'parks-park-attractions', params: {park: park.fullSlug}, query: {zone: zone.id}})">
                        {{ zone.totalAttractions }}
                        <b-icon icon="link45deg" />
                      </nuxt-link>
                    </div>
                    <div v-else>
                      -
                    </div>
                  </b-td>
                  <b-td v-if="$store.getters['common/getEditMode']" class="text-center align-middle">
                    <b-button-group>
                      <action-button v-b-modal="`update-park-zone-form-${zone.id}`" modify-icon icon-only />
                      <action-button v-b-modal="`delete-park-zone-form-${zone.id}`" delete-icon icon-only />
                    </b-button-group>

                    <update-park-zone-form :park-id="park.id" :zone-id="zone.id" @finish="onModification" />
                    <delete-park-zone-form :park-id="park.id" :zone-id="zone.id" @finish="onModification" />
                  </b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>

            <div class="text-right">
              <action-button v-b-modal.add-park-zone-form add-icon>
                {{ $t('add.park_zone') }}
              </action-button>

              <add-park-zone-form :park-id="park.id" @finish="onModification" />
            </div>
          </div>

          <!-- History -->
          <div v-if="reverseHistory.length > 0 || $store.getters['common/getEditMode']" class="content-block">
            <h5>{{ $t('history') }}</h5>
            <value-list :items="reverseHistory">
              <template v-slot:action="props">
                <b-button-group>
                  <action-button v-b-modal="`update-park-history-form-${props.item.id}`" modify-icon icon-only />
                  <action-button v-b-modal="`delete-park-history-form-${props.item.id}`" delete-icon icon-only />
                </b-button-group>

                <update-park-history-form :park-id="park.id" :history-id="props.item.id" @finish="onModification" />
                <delete-park-history-form :park-id="park.id" :history-id="props.item.id" @finish="onModification" />
              </template>
            </value-list>

            <div class="text-right">
              <action-button v-b-modal.add-park-history-form add-icon>
                {{ $t('add.park_history') }}
              </action-button>

              <add-park-history-form :park-id="park.id" @finish="onModification" />
            </div>
          </div>

          <!-- Contributors -->
          <div class="content-block">
            <h5>{{ $t('contributors') }}</h5>
            <ul class="contributors">
              <li v-for="(item, index) in park.contributors" :key="index">
                <nuxt-link :to="localePath({name: 'profile-username', params: {username: item.account.username}})">
                  {{ item.account.username }}
                </nuxt-link>
                ({{ item.totalContributions }})
              </li>
            </ul>
            <div>
              <nuxt-link v-slot="{ navigate }" :to="localePath({name: 'activities', query: {reference: park.id}})" custom>
                <b-button variant="light" size="sm" @click="navigate">
                  {{ $t('show_contributions') }}
                </b-button>
              </nuxt-link>
            </div>
          </div>
        </b-col>

        <b-col md="5" xl="4" order="1" order-md="2" class="mb-5 mb-md-0 left-separator">
          <!-- Image slider -->
          <image-slider
            :images="park.images"
            :alt="park.name"
            :gallery-route="{name: 'parks-park-images', params: {park: park.fullSlug}}"
          />

          <!-- Park actions -->
          <div class="text-center mt-3">
            <nuxt-link v-slot="{ navigate }" :to="localePath({name: 'parks-park-images', params: {park: park.fullSlug}})" custom>
              <b-button variant="primary" block class="mb-1 text-left" @click="navigate">
                <b-icon icon="images" aria-hidden="true" />
                {{ $t('image_gallery') }}
              </b-button>
            </nuxt-link>

            <nuxt-link v-slot="{ navigate }" :to="localePath({name: 'parks-park-attractions', params: {park: park.fullSlug}})" custom>
              <b-button variant="primary" block class="mb-1 text-left" @click="navigate">
                <b-icon icon="table" aria-hidden="true" />
                {{ $t('attractions') }}
              </b-button>
            </nuxt-link>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
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
        label: this.$t('category'),
        type: 'route-list',
        value: this.park.categories.map(function (value) {
          return {
            route: { name: 'parks', query: { category: value.key } },
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

    attributes () {
      return this.park.attributes.map(function (attribute) {
        return {
          label: attribute.type.label,
          type: attribute.type.type.toLowerCase(),
          value: attribute.value,
          text: attribute.valueAsString
        }
      })
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

      const items = this.park.histories

      return items.reverse().map(function (item) {
        return {
          id: item.id,
          text: `${item.date.value} | ${item.label}`,
          class: classMap[item.type.key].class
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

      const result = await me.$graphql(me.$options.__query, {
        parkSlug: me.$route.params.park,
        locale: me.$i18n.locale
      })

      if (!result.park) {
        me.$nuxt.error({ statusCode: 404 })

        return
      }

      this.park = result.park
    },

    onModification (park) {
      this.$trackEvent('Park modified')

      if (park.fullSlug !== this.$route.params.park) {
        this.$router.replace(this.localePath({
          name: 'parks-park',
          params: { park: park.fullSlug }
        }))

        return
      }

      this.loadPark()
    }
  },

  head () {
    if (this.park) {
      return this.$createHead({
        title: this.park.name,
        description: this.park.shortDescription ?? this.$t('generic_park_description', { park: this.park.name }),
        image: this.park.images.length > 0 ? this.park.images[0].large : null
      })
    }

    return {}
  }
}
</script>

<style lang="scss" scoped>
.table-light-th {
  color: #495057;
  background-color: #e9ecef;
  border-color: #dee2e6;
}

.table-actions-th {
  width: 80px
}
</style>

<query>
query ($parkSlug: String!, $locale: String!) {
    park(id: $parkSlug) {
        id
        name
        shortDescription(locale: $locale)
        fullSlug
        categories { key, label(locale: $locale) }
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
        zones { id, name, openedAt { format, value }, closedAt { format, value }, formerNames, totalAttractions }
        createdAt { format, value }
        updatedAt { format, value }
        images {
            id
            middle: url(size: MIDDLE)
            large: url(size: LARGE)
            contributor {
              username
            }
            customCopyrightName
            customCopyrightUrl
        },
        histories {
            id
            type { key }
            date { format, value }
            label(locale: $locale)
        },
        attributes {
            type {
              key
              type
              category
              label(locale: $locale)
            }
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
