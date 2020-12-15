<template>
  <div>
    <div class="main-content">
      <breadcrumb :items="breadcrumbs" />

      <!-- TODO: Park add
      <div class="text-center mb-3">
        <action-button add-icon v-b-modal.park-create-form>{{ $t('add.park') }}</action-button>
        <form-modal id="park-create-form" :title="$t('add.park')" :uri="$generateUrl('api_park_createpark')" @finish="onParkCreated"></form-modal>
      </div>
      -->

      <parks @refreshed="afterRefresh" />
    </div>
  </div>
</template>

<script>
import Parks from '~/components/organisms/parks'
// import FormModal from "../../molecules/FormModal"
// import ActionButton from "../../atoms/ActionButton"

export default {
  components: {
    // ActionButton,
    // FormModal,
    Parks
  },

  data () {
    return {
      totalParks: 0
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
          label: `${this.$t('overview')} (${this.totalParks})`
        }
      ]
    }
  },

  methods: {
    afterRefresh (result) {
      const me = this

      me.totalParks = result.totalParks

      if (!result.initial) {
        me.$scrollTo('.breadcrumb')
      }
    }

    /* TODO: Park add
    onParkCreated (formData) {
      this.$trackEvent('Park created')

      this.$router.push(this.localePath({
        name: 'parks-park',
        params: { park: formData.slug }
      }))
    } */
  },

  head () {
    return this.$createHead({
      title: this.$t('parks'),
      description: this.$t('meta.description')
    })
  }
}
</script>
