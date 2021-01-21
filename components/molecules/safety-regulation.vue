<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <div class="mb-3">
    <template v-if="safetyRegulation === null">
      <no-data />
    </template>

    <template v-else>
      <div>
        <div v-if="safetyRegulation.solo !== null" class="safety-regulation-item">
          <b-icon icon="check-circle-fill" variant="success" font-scale="2" class="mr-2" aria-hidden="true" />
          <div>
            <div class="text-muted">
              {{ $t('safety_regulation.solo') }}
            </div>
            <div>{{ safetyRegulation.solo }}</div>
          </div>
        </div>

        <div v-if="safetyRegulation.accompanied !== null" class="safety-regulation-item">
          <b-icon icon="exclamation-circle-fill" variant="warning" font-scale="2" class="mr-2" aria-hidden="true" />
          <div>
            <div class="text-muted">
              {{ $t('safety_regulation.escort') }}
            </div>
            <div>{{ safetyRegulation.accompanied }}</div>
          </div>
        </div>

        <div v-if="safetyRegulation.prohibit !== null" class="safety-regulation-item">
          <b-icon icon="x-circle-fill" variant="danger" font-scale="2" class="mr-2" aria-hidden="true" />
          <div>
            <div class="text-muted">
              {{ $t('safety_regulation.prohibit') }}
            </div>
            <div>{{ safetyRegulation.prohibit }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import NoData from '~/components/atoms/no-data'

export default {
  components: { NoData },

  props: {
    safetyRegulation: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
@import "~/assets/css/ci";

.safety-regulation-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1.5rem;
}
</style>
