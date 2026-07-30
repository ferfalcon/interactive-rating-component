import '@fontsource/overpass/400.css'
import '@fontsource/overpass/600.css'
import '@fontsource/overpass/700.css'
import './style.css'
import { mountRatingApp } from './rating-app'

const root = document.querySelector<HTMLDivElement>('#app')

if (!root) {
  throw new Error('Interactive rating app could not find the #app mount element.')
}

mountRatingApp(root)
