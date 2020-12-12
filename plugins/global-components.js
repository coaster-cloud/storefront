import Vue from 'vue'
import MarkdownText from '@/components/atoms/markdown-text'

const components = { MarkdownText }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
