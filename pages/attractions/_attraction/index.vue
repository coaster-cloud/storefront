<template>
  <div>
    <div v-if="!attraction" class="main-content">
      <breadcrumb :items="[{label: $t('loading')}]" />
      <skeleton-content />
    </div>

    <div v-else class="main-content">
      <breadcrumb :items="breadcrumbs" />

      <b-row>
        <b-col md="7" xl="8" order="2" order-md="1">
          <!-- Short description -->
          <div v-if="attraction.shortDescription" class="content-block">
            {{ attraction.shortDescription }}
          </div>

          <!-- Basic data -->
          <div class="content-block">
            <h5>{{ $t('basic_data') }}</h5>
            <key-value-list :items="basicData">
              <template v-if="attraction.ratings.fun">
                <dt class="col-sm-3 font-weight-normal">
                  {{ $t('fun_factor') }}:
                </dt>
                <dd class="col-sm-9 text-muted">
                  <rating :value="attraction.ratings.fun.average" />
                </dd>
              </template>

              <template v-if="attraction.ratings.thrill">
                <dt class="col-sm-3 font-weight-normal">
                  {{ $t('thrill') }}:
                </dt>
                <dd class="col-sm-9 text-muted">
                  <rating :value="attraction.ratings.thrill.average" icon-empty="lightning" icon-full="lightning-fill" />
                </dd>
              </template>

              <template v-if="attraction.ratings.theme">
                <dt class="col-sm-3 font-weight-normal">
                  {{ $t('thematisation') }}:
                </dt>
                <dd class="col-sm-9 text-muted">
                  <rating :value="attraction.ratings.theme.average" icon-empty="heart" icon-full="heart-fill" />
                </dd>
              </template>
            </key-value-list>

            <div class="text-right">
              <action-button v-b-modal.update-attraction-basic-form modify-icon>
                {{ $t('modify.basic_data') }}
              </action-button>

              <action-button v-b-modal.update-attraction-short-description-form modify-icon>
                {{ $t('modify.short_description') }}
              </action-button>

              <update-attraction-basic-form :attraction-id="attraction.id" @finish="onModification" />
              <update-attraction-short-description-form :attraction-id="attraction.id" @finish="onModification" />
            </div>
          </div>

          <!-- Safety regulation -->
          <div v-if="safetyRegulation || $store.getters['common/getEditMode']" class="content-block">
            <h5>{{ $t('safety_regulation') }}</h5>
            <safety-regulation :safety-regulation="safetyRegulation" />

            <div class="text-right">
              <action-button v-b-modal.update-attraction-safety-regulation-form modify-icon>
                {{ $t('modify.safety_regulation') }}
              </action-button>

              <update-attraction-safety-regulation-form :attraction-id="attraction.id" @finish="onModification" />
            </div>
          </div>

          <!-- Technical attributes -->
          <div v-if="technicalAttributes.length > 0 || $store.getters['common/getEditMode']" class="content-block">
            <h5>{{ $t('technical_information') }}</h5>
            <key-value-list :items="technicalAttributes" />

            <div class="text-right">
              <action-button v-b-modal.update-attraction-attributes-technical-form add-icon>
                {{ $t('modify.technical_information') }}
              </action-button>

              <update-attraction-attributes-form :attraction-id="attraction.id" category="technical" @finish="onModification" />
            </div>
          </div>

          <!-- Trains information -->
          <div v-if="trainAttributes.length > 0 || $store.getters['common/getEditMode']" class="content-block">
            <h5>{{ $t('trains_information') }}</h5>
            <key-value-list :items="trainAttributes" />

            <div class="text-right">
              <action-button v-b-modal.update-attraction-attributes-trains-form add-icon>
                {{ $t('modify.trains_information') }}
              </action-button>

              <update-attraction-attributes-form :attraction-id="attraction.id" category="trains" @finish="onModification" />
            </div>
          </div>

          <!-- Additional information -->
          <div v-if="additionalAttributes.length > 0 || $store.getters['common/getEditMode']" class="content-block">
            <h5>{{ $t('additional_information') }}</h5>
            <key-value-list :items="additionalAttributes" />

            <div class="text-right">
              <action-button v-b-modal.update-attraction-attributes-additional-form add-icon>
                {{ $t('modify.additional_information') }}
              </action-button>

              <update-attraction-attributes-form :attraction-id="attraction.id" category="additional" @finish="onModification" />
            </div>
          </div>

          <!-- Elements -->
          <div v-if="rideElements.length > 0 || $store.getters['common/getEditMode']" class="content-block">
            <h5>{{ $t('ride_elements') }}</h5>
            <value-list :items="rideElements" />

            <div class="text-right">
              <action-button v-b-modal.update-attraction-elements-form modify-icon>
                {{ $t('modify.ride_elements') }}
              </action-button>

              <update-attraction-elements-form :attraction-id="attraction.id" @finish="onModification" />
            </div>
          </div>

          <!-- History -->
          <div v-if="reverseHistory.length > 0 || $store.getters['common/getEditMode']" class="content-block">
            <h5>{{ $t('history') }}</h5>
            <value-list :items="reverseHistory">
              <template v-slot:action="props">
                <b-button-group>
                  <action-button v-b-modal="`update-attraction-history-form-${props.item.id}`" modify-icon icon-only />
                  <action-button v-b-modal="`delete-attraction-history-form-${props.item.id}`" delete-icon icon-only />
                </b-button-group>

                <update-attraction-history-form :attraction-id="attraction.id" :history-id="props.item.id" @finish="onModification" />
                <delete-attraction-history-form :attraction-id="attraction.id" :history-id="props.item.id" @finish="onModification" />
              </template>
            </value-list>

            <div class="text-right">
              <action-button v-b-modal.add-attraction-history-form add-icon>
                {{ $t('add.attraction_history') }}
              </action-button>

              <add-attraction-history-form :attraction-id="attraction.id" @finish="onModification" />
            </div>
          </div>

          <!-- Contributors -->
          <div class="content-block">
            <h5>{{ $t('contributors') }}</h5>
            <ul class="contributors">
              <li v-for="(item, index) in attraction.contributors" :key="index">
                <nuxt-link :to="localePath({name: 'profile-username', params: {username: item.account.username}})">
                  {{ item.account.username }}
                </nuxt-link>
                ({{ item.totalContributions }})
              </li>
            </ul>

            <nuxt-link v-slot="{ navigate }" :to="localePath({name: 'activities', query: {reference: attraction.id}})" custom>
              <b-button variant="light" size="sm" @click="navigate">
                {{ $t('show_contributions') }}
              </b-button>
            </nuxt-link>
          </div>
        </b-col>

        <b-col md="5" xl="4" order="1" order-md="2" class="mb-5 mb-md-0 left-separator">
          <!-- Image slider -->
          <image-slider
            :images="attraction.images"
            :gallery-route="{name: 'attractions-attraction-images', params: {attraction: attraction.fullSlug}}"
          />

          <!-- Youtube Onride -->
          <template v-if="attraction.onride">
            <youtube-video :video-id="attraction.onride" />
          </template>

          <!-- Attraction actions -->
          <div class="text-center mt-3">
            <nuxt-link v-slot="{ navigate }" :to="localePath({name: 'attractions-attraction-images', params: {attraction: attraction.fullSlug}})" custom>
              <b-button variant="primary" block class="mb-1 text-left" @click="navigate">
                <b-icon icon="images" aria-hidden="true" />
                {{ $t('image_gallery') }}
              </b-button>
            </nuxt-link>
          </div>

          <client-only>
            <!-- Rides and Custom Definition -->
            <set-rides-form
              :attraction-id="attraction.id"
              :attraction-name="attraction.name"
              :count-date="countDate"
              :custom-definitions="customDefinitions"
              :my-custom-definition="myCustomDefinition"
              :my-rides="myRides"
              @count-date-changed="countDateChanged"
              @rides-changed="ridesChanged"
              @custom-definition-changed="customDefinitionChanged"
            />

            <!-- Rating -->
            <set-rating-form
              :key="`rating-input-${attraction.id}`"
              :attraction="attraction.id"
              :rating="myRating"
              @changed="ratingChanged"
            />
          </client-only>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Moment from 'moment'

export default {
  async fetch () {
    await this.loadAttraction()
  },

  data () {
    return {
      park: null,
      attraction: null,
      attractionCategories: [],
      countDate: Moment().format('YYYY-MM-DD')
    }
  },

  computed: {
    customDefinitions () {
      return {
        categories: this.attractionCategories.map(v => ({ value: v.key, text: v.label }))
      }
    },

    myRides () {
      return this.attraction.myRides ?? { totalBasicRides: 0, totalVirtualRealityRides: 0 }
    },

    myCustomDefinition () {
      return this.attraction.myCustomDefinition ?? { category: null }
    },

    myRating () {
      return this.attraction.myRating ?? { fun: null, thrill: null, theme: null }
    },

    basicData () {
      const data = []

      data.push({
        label: this.$t('park'),
        type: 'route',
        value: {
          route: { name: 'parks-park', params: { park: this.park.fullSlug } },
          label: this.park.name
        }
      })

      data.push({ label: this.$t('park_zone'), type: 'text', value: this.attraction.zone?.name })

      data.push({
        label: this.$t('category'),
        type: 'route',
        value: {
          route: { name: 'attractions', query: { category: this.attraction.category.key } },
          label: this.attraction.category.label
        }
      })

      data.push({
        label: this.$t('manufacturer'),
        type: 'route-list',
        value: this.attraction.manufacturers.map(function (value) {
          return {
            route: { name: 'attractions', query: { manufacturer: value.id } },
            label: value.name
          }
        })
      })

      data.push({
        label: this.$t('state'),
        type: 'route',
        value: {
          route: { name: 'attractions', query: { state: this.attraction.state.key } },
          label: this.attraction.state.label
        }
      })

      data.push({ label: this.$t('latitude'), type: 'text', value: this.attraction.latitude })
      data.push({ label: this.$t('longitude'), type: 'text', value: this.attraction.longitude })

      return data
    },

    technicalAttributes () {
      return this.attraction.attributes
        .filter(item => item.type.category === 'technical')
        .map(function (attribute) {
          return {
            label: attribute.type.label,
            type: attribute.type.type.toLowerCase(),
            value: attribute.value,
            text: attribute.valueAsString
          }
        })
    },

    trainAttributes () {
      return this.attraction.attributes
        .filter(item => item.type.category === 'trains')
        .map(function (attribute) {
          return {
            label: attribute.type.label,
            type: attribute.type.type.toLowerCase(),
            value: attribute.value,
            text: attribute.valueAsString
          }
        })
    },

    additionalAttributes () {
      return this.attraction.attributes
        .filter(item => item.type.category === 'additional')
        .map(function (attribute) {
          return {
            label: attribute.type.label,
            type: attribute.type.type.toLowerCase(),
            value: attribute.value,
            text: attribute.valueAsString
          }
        })
    },

    rideElements () {
      return this.attraction.elements.map(item => ({ id: item.id, text: `${item.quantity} x ${item.type.label}` }))
    },

    safetyRegulation () {
      const result = {
        solo: this.attraction.safetyRegulation.soloLabel,
        accompanied: this.attraction.safetyRegulation.accompaniedLabel,
        prohibit: this.attraction.safetyRegulation.prohibitLabel
      }

      if (result.solo === null && result.accompanied === null && result.prohibit === null) {
        return null
      }

      return result
    },

    reverseHistory () {
      const classMap = {
        opened: { class: 'list-group-item-success' },
        closed: { class: 'list-group-item-danger' },
        renamed: { class: 'list-group-item-warning' }
      }

      const items = this.attraction.histories

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
          label: this.park.name,
          route: { name: 'parks-park', params: { park: this.park.fullSlug } }
        },
        {
          label: this.$t('attractions'),
          route: { name: 'parks-park-attractions', params: { park: this.park.fullSlug } }
        },
        {
          label: this.attraction.name
        }
      ]
    }
  },

  mounted () {
    // Reload complete attraction data if log / logout because of user data for rides, rating etc.
    this.$watch(
      () => this.$store.getters['account/hasToken'],
      () => this.loadAttraction()
    )
  },

  methods: {
    async loadAttraction () {
      const me = this

      const result = await me.$graphql(me.$options.__query, {
        attractionSlug: me.$route.params.attraction,
        locale: me.$i18n.locale,
        isAuthenticated: me.$store.getters['account/hasToken'],
        countDate: me.countDate
      })

      if (!result.attraction) {
        me.$nuxt.error({ statusCode: 404 })

        return
      }

      this.park = result.attraction.park
      this.attraction = result.attraction
      this.attractionCategories = result.attractionCategories
    },

    onModification (attraction) {
      // this.$trackEvent('Attraction modified');

      if (attraction.fullSlug !== this.$route.params.attraction) {
        this.$router.replace(this.localePath({
          name: 'attractions-attraction',
          params: { attraction: attraction.fullSlug }
        }))

        return
      }

      this.loadAttraction()
    },

    ratingChanged (attraction) {
      this.attraction.ratings = attraction.ratings
      this.attraction.myRating = attraction.myRating
    },

    // Set date and reload attraction data
    countDateChanged (date) {
      this.countDate = date
      this.loadAttraction()
    },

    ridesChanged (attraction) {
      this.attraction.myRides = attraction.myRides
    },

    customDefinitionChanged (attraction) {
      this.attraction.myCustomDefinition = attraction.myCustomDefinition
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
query ($attractionSlug: String!, $locale: String!, $isAuthenticated: Boolean!, $countDate: String!) {
    attractionCategories {
        key
        label(locale: $locale)
    },
    attraction(id: $attractionSlug) {
        id
        name
        shortDescription(locale: $locale)
        fullSlug
        category { key, label(locale: $locale) }
        state { key, label(locale: $locale) }
        manufacturers { id, name }
        zone { id, name }
        latitude
        longitude
        onride
        park {
          id
          name
          fullSlug
        }
        safetyRegulation {
          soloLabel(locale: $locale)
          accompaniedLabel(locale: $locale)
          prohibitLabel(locale: $locale)
        }
        ratings {
          fun { average, totalRatings }
          thrill { average, totalRatings }
          theme { average, totalRatings }
        }
        histories {
          id
          type { key }
          date { format, value }
          label(locale: $locale)
        }
        attributes {
          type {
            key
            type
            category
            label(locale: $locale)
          }
          value
          valueAsString(locale: $locale)
        }
        elements { quantity, type { label(locale: $locale) } }
        contributors {
          account {
            username
          }
          totalContributions
        }
        images {
            id
            middle: url(size: MIDDLE)
            large: url(size: LARGE)
            contributor {
            username
          }
          customCopyrightName
          customCopyrightUrl
        }
        myRating @include(if: $isAuthenticated) {
          fun
          thrill
          theme
        }
        myRides(date: $countDate) @include(if: $isAuthenticated) {
          totalBasicRides
          totalVirtualRealityRides
        }
        myCustomDefinition @include(if: $isAuthenticated) {
          category
        }
    }
}
</query>
