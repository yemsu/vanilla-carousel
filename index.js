import './src/style/index.scss'
import Carousel from './src/lib/Carousel.js'

const carousels = document.querySelectorAll('.carousel')
carousels.forEach(carousel => {
  new Carousel(carousel, sortCarouselOptions(carousel))
})

function sortCarouselOptions(carousel) {
  const dataset = carousel.dataset
  const optionKeysDepth1 = Object.keys(dataset)
  if(optionKeysDepth1.length < 1) return false
  const options = {}
  for(let i = 0; i < optionKeysDepth1.length; i++) {
    const titleDepth1 = optionKeysDepth1[i]
    const optionValues = Object.values(dataset)[i].split(' ')
    options[titleDepth1] = {}
    for(const optionValue of optionValues) {
      const optionValueSplit = optionValue.split('-')
      options[titleDepth1][optionValueSplit[0]] = optionValueSplit[1]
    }
  }    
  return options
}