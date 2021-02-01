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
    id="add-attraction-image-form"
    size="xs"
    :title="$t('upload_image')"
    no-stacking
    @show="load"
  >
    <!-- scrollable // Do not use because of date input -->

    <file-input
      id="add-attraction-image-form-file"
      v-model="file"
      :label="$t('upload_image')"
      :violations="getFieldViolations('[addAttractionImages][0][file]')"
    />

    <date-input
      id="add-attraction-image-form-date-taken"
      v-model="date"
      :label="$t('photo_taken')"
      :description="$t('photo_taken.help')"
      :violations="getFieldViolations('[addAttractionHistories][0][date]')"
    />

    <select-input
      id="add-attraction-image-form-license"
      v-model="license"
      :label="$t('license')"
      :description="$t('license.help')"
      :violations="getFieldViolations('[addAttractionHistories][0][license]')"
      :options="licenseOptions"
    />

    <text-input
      id="add-attraction-image-form-copyright-name"
      v-model="copyrightName"
      :label="$t('copyright_name')"
      :description="$t('copyright_name.help')"
      :violations="getFieldViolations('[addAttractionImages][0][copyrightName]')"
    />

    <text-input
      id="add-attraction-image-form-copyright-url"
      v-model="copyrightUrl"
      :label="$t('copyright_url')"
      :description="$t('copyright_url.help')"
      :violations="getFieldViolations('[addAttractionImages][0][copyrightUrl]')"
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
import AttractionUpdateForm from '~/components/mixins/attraction-update-form'

export default {
  mixins: [AttractionUpdateForm],

  props: {
    attractionId: {
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

      const query = `
        query {
          licenses {
            key
            name
          }
        }
      `

      this.file = null
      this.date = Moment().format('YYYY-MM-DD')
      this.license = 'cc_by_nd_4_0'
      this.copyrightName = null
      this.copyrightUrl = null
      this.violations = []

      const result = await me.$graphql(query)

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
        file: 'attractionImage',
        date: this.date,
        license: this.license,
        customCopyrightName: this.copyrightName,
        customCopyrightUrl: this.copyrightUrl
      }

      const files = {
        attractionImage: this.file
      }

      await this.updateAttraction(this.attractionId, { addAttractionImages: [input] }, ok, files)
    }
  }
}
</script>
