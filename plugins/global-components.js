import Vue from 'vue'
import MarkdownText from '~/components/atoms/markdown-text'
import Breadcrumb from '~/components/organisms/breadcrumb'

const components = { MarkdownText, Breadcrumb }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
