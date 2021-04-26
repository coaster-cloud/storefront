<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <b-modal
    id="add-park-image-form"
    size="xs"
    :title="$t('upload_image')"
    no-stacking
    @show="load"
  >
    <!-- scrollable // Do not use because of date input -->

    <file-input
      id="add-park-image-form-file"
      v-model="file"
      :label="$t('upload_image')"
      :violations="getFieldViolations('[addParkImages][0][file]')"
    />

    <date-input
      id="add-park-image-form-date-taken"
      v-model="date"
      :label="$t('photo_taken')"
      :description="$t('photo_taken.help')"
      :violations="getFieldViolations('[addParkImages][0][date]')"
    />

    <select-input
      id="add-park-image-form-license"
      v-model="license"
      :label="$t('license')"
      :description="$t('license.help')"
      :violations="getFieldViolations('[addParkImages][0][license]')"
      :options="licenseOptions"
    />

    <text-input
      id="add-park-image-form-copyright-name"
      v-model="copyrightName"
      :label="$t('copyright_name')"
      :description="$t('copyright_name.help')"
      :violations="getFieldViolations('[addParkImages][0][copyrightName]')"
    />

    <text-input
      id="add-park-image-form-copyright-url"
      v-model="copyrightUrl"
      :label="$t('copyright_url')"
      :description="$t('copyright_url.help')"
      :violations="getFieldViolations('[addParkImages][0][copyrightUrl]')"
    />

    <template v-slot:modal-footer="{ ok }">
      <b-button variant="primary ml-auto" @click="save(ok)">
        {{ $t('save') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import Moment from 'moment'
import ParkUpdateForm from '~/components/mixins/park-update-form'

export default {
  mixins: [ParkUpdateForm],

  props: {
    parkId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      file: null,
      date: null,
      license: null,
      copyrightName: null,
      copyrightUrl: null,
      licenseOptions: []
    }
  },

  methods: {
    async load () {
      const me = this

      this.file = null
      this.date = Moment().format('YYYY-MM-DD')
      this.license = 'cc_by_nd_4_0'
      this.copyrightName = null
      this.copyrightUrl = null
      this.violations = []

      const result = await me.$graphql('69d33b62-6502-45d2-9ba0-3371deb5a6c5')

      if (result) {
        me.licenseOptions = result.licenses.map(function (license) {
          return {
            value: license.key,
            text: license.name
          }
        })
      }
    },

    async save (ok) {
      const input = {
        file: 'parkImage',
        date: this.date,
        license: this.license,
        customCopyrightName: this.copyrightName,
        customCopyrightUrl: this.copyrightUrl
      }

      const files = {
        parkImage: this.file
      }

      await this.updatePark(this.parkId, { addParkImages: [input] }, ok, files)
    }
  }
}
</script>
