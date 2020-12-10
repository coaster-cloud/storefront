import Vue from 'vue'
import MarkdownTxt from '~/components/atoms/markdown-text'

const components = { MarkdownTxt }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
