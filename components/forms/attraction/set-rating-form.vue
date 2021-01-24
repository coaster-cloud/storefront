<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <div class="action-box mt-5 text-center">
    <h5>{{ $t('rate_this_attraction') }}</h5>
    <b-form-group :label="$t('fun_factor')">
      <b-form-rating
        :value="rating.fun"
        variant="primary"
        :disabled="!$store.getters['account/hasToken']"
        @change="onFunRating"
      />
    </b-form-group>

    <b-form-group :label="$t('thrill')">
      <b-form-rating
        :value="rating.thrill"
        icon-empty="lightning"
        icon-full="lightning-fill"
        variant="primary"
        :disabled="!$store.getters['account/hasToken']"
        @change="onThrillRating"
      />
    </b-form-group>

    <b-form-group :label="$t('thematisation')">
      <b-form-rating
        :value="rating.theme"
        icon-empty="heart"
        icon-full="heart-fill"
        variant="primary"
        :disabled="!$store.getters['account/hasToken']"
        @change="onThemeRating"
      />
    </b-form-group>

    <template v-if="!$store.getters['account/hasToken']">
      <p>{{ $t('please_login') }}</p>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    attraction: {
      type: String,
      required: true
    },
    rating: {
      type: Object,
      required: true
    }
  },

  methods: {
    async updateRating (field, value) {
      const me = this

      if (!me.$store.getters['account/hasToken']) {
        return
      }

      const query = `
        mutation ($input: SetRatingInput!) {
           setRating(input: $input) {
            violations {
              field
              message
            }
            attraction {
              ratings {
                fun { average, totalRatings }
                thrill { average, totalRatings }
                theme { average, totalRatings }
              }
              myRating {
                fun
                thrill
                theme
              }
            }
          }
        }
      `

      const input = {
        attraction: me.attraction
      }

      input[field] = value

      const result = await me.$graphql(query, { input })

      // me.$trackEvent('Attraction rated');

      me.$emit('changed', result.setRating.attraction)
    },

    onThrillRating: _.debounce(function (value) {
      this.updateRating('thrill', value)
    }, 500),

    onFunRating: _.debounce(function (value) {
      this.updateRating('fun', value)
    }, 500),

    onThemeRating: _.debounce(function (value) {
      this.updateRating('theme', value)
    }, 500)
  }
}
</script>
