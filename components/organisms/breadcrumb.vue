<template>
  <div>
    <div class="breadcrumb">
      <slot name="header">
        <h1>{{ items[items.length - 1].label }}</h1>
        <ul>
          <li v-for="(item, index) in items" :key="index">
            <template v-if="item.route">
              <NuxtLink :to="localePath(item.route)">
                {{ item.label }}
              </NuxtLink>
            </template>
            <template v-else>
              {{ item.label }}
            </template>
          </li>
        </ul>
      </slot>
    </div>

    <div class="separator-breadcrumb border-top" />
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~/assets/css/ci";

.breadcrumb {
  background: transparent;
  align-items: center;
  margin: 0 0 1.25rem;
  padding: 0;
  h1 {
    font-size: 1.5rem;
    line-height: 1;
    margin: 0;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      display: inline-block;
      position: relative;
      padding: 0 .5rem;
      line-height: 1;
      vertical-align: bottom;
      color: $gray-600;
      &:after {
        position: absolute;
        top: -1px;
        right: 0;
        content: "";
        height: 16px;
        width: 1px;
        background: $gray-600;
        border-radius: 5px;
      }
      &:last-child {
        &:after {
          display: none;
        }
      }
      a {
        color: $heading;
      }
    }
  }
}

[dir="rtl"] {
  .breadcrumb {
    h1 {
      font-size: 1.5rem;
      line-height: 1;
      margin: 0;
      margin-left: .5rem;
    }
  }
}

@media (max-width: 576px) {
  .breadcrumb {
    flex-direction: column;
    align-items: flex-start;
    ul li:first-child {
      padding-left: 0;
    }
  }
}

.separator-breadcrumb {
  margin-bottom: 2rem;
}
</style>
