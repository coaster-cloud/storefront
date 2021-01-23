<!--
  - This file is part of coaster.cloud.
  -
  - (c) Michel Chowanski <michel@chowanski.de>
  -
  - For the full copyright and license information, please view the LICENSE
  - file that was distributed with this source code.
  -->

<template>
  <b-form-group :label-cols-sm="labelCol" :label-for="id" :label="label" :description="description">
    <b-form-tags :id="id" v-model="modelValue" no-outer-focus class="mb-2" :state="violations.length === 0 ? null : false">
      <template v-slot="{ tags, disabled, addTag, removeTag }">
        <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
          <li v-for="tag in tags" :key="tag" class="list-inline-item">
            <b-form-tag
              :title="tag"
              :disabled="disabled"
              variant="primary"
              @remove="removeTag(tag)"
            >
              {{ tag }}
            </b-form-tag>
          </li>
        </ul>

        <b-dropdown size="sm" variant="outline-secondary" block menu-class="w-100">
          <template #button-content>
            <b-icon icon="tag-fill" />
            {{ $t('choice') }}
          </template>
          <b-dropdown-form @submit.stop.prevent="() => {}">
            <b-form-group
              :label="$t('search')"
              label-for="tag-search-input"
              label-cols-md="auto"
              class="mb-0"
              label-size="sm"
              :disabled="disabled"
            >
              <b-form-input
                id="tag-search-input"
                v-model="search"
                type="search"
                size="sm"
                autocomplete="off"
              />
            </b-form-group>
          </b-dropdown-form>
          <b-dropdown-divider />
          <b-dropdown-item-button
            v-for="option in availableOptions.slice(0,10)"
            :key="option"
            @click="onOptionClick({ option, addTag })"
          >
            {{ option }}
          </b-dropdown-item-button>
          <b-dropdown-text v-if="availableOptions.length === 0">
            {{ $t('no_choices') }}
          </b-dropdown-text>
        </b-dropdown>
      </template>
    </b-form-tags>

    <b-form-invalid-feedback v-for="(violation, index) in violations" :key="index" :state="false">
      {{ violation }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },

    value: {
      type: Array,
      default: null
    },

    label: {
      type: String,
      default: null
    },

    description: {
      type: String,
      default: null
    },

    options: {
      type: Array,
      default: () => []
    },

    violations: {
      type: Array,
      default: () => []
    },

    labelCol: {
      type: Number,
      default: 4
    }
  },

  data () {
    return {
      search: ''
    }
  },

  computed: {
    modelValue: {
      get () {
        return this.value
      },

      set (value) {
        this.$emit('input', value)
      }
    },

    criteria () {
      return this.search.trim().toLowerCase()
    },

    availableOptions () {
      const criteria = this.criteria

      const options = this.options.filter(opt => !this.value.includes(opt))

      if (criteria) {
        return options.filter(opt => opt.toLowerCase().includes(criteria))
      }

      return options
    }
  },

  methods: {
    onOptionClick ({ option, addTag }) {
      addTag(option)

      this.search = ''
    }
  }
}
</script>
