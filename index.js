import './src/style/index.scss'
import Carousel from './src/lib/Carousel.js'

const carousels = document.querySelectorAll('.carousel')
carousels.forEach(carousel => {
  new Carousel(carousel)
})