class Carousel {
  constructor(elem) {
    this.elem = elem
    this.viewport = elem.querySelector('.viewport')
    this.slidingArea = elem.querySelector('.area-sliding')
    this.slides = this.slidingArea.children
    this.indicators = this.indicatorsHTML()
    this.arrows = this.arrowsHTML()
    this.activeIndex = 0
    this.colsPerView = 1

    this.init()
  }

  init() {
    this.createUtils()
    this.setElementsWidth()
  }
  createUtils() {
    this.elem.appendChild(this.arrows)
    this.elem.appendChild(this.indicators)
  }
  arrowsHTML() {
    const arrows = this.newEl('div', 'arrows')
    const arrowTypes = ['prev', 'next']
    for(const type of arrowTypes) {
      const arrow = this.newEl('div', ['arrow', type])
      const button = this.arrowButton(type)
      const icon = this.newEl('i')
      const span = this.newEl('span')
      icon.classList.add('icon-arrow', type)
      span.classList.add('ir-hidden')
      span.innerText = `${type === 'prev' ? '이전' : '다음'} 슬라이드`
      button.appendChild(icon)
      button.appendChild(span)
      arrow.appendChild(button)
      arrows.appendChild(arrow)
    }    
    return arrows
  }
  arrowButton(type) {
    const button = this.newEl('button')
    button.addEventListener('click', () => {
      this.setActive(this.nextActiveIndex(type))
      this.sliding()
    }) 
    return button
  }
  setActive(nextActiveIndex) {
    this.activeIndex = nextActiveIndex

    // indicators
    const indicators = this.indicators.querySelectorAll('.indicator')
    const activeIndicator = this.indicators.querySelector('.indicator.active')
    activeIndicator && activeIndicator.classList.remove('active')
    indicators[nextActiveIndex].classList.add('active')
  }
  nextActiveIndex(prevOrNext) {
    const lastIndex = this.slides.length - 1
    if(prevOrNext === 'prev') {
      return this.activeIndex === 0 ? lastIndex : this.activeIndex - 1
    } else if(prevOrNext === 'next') {
      return this.activeIndex === lastIndex ? 0 : this.activeIndex + 1
    }
  }
  sliding() {
    this.slidingArea.style.transform = `translateX(-${this.viewportWidth() * this.activeIndex}px)`
  }
  indicatorsHTML() {
    const indicators = this.newEl('ul', 'indicators')
    for(let i = 0; i < this.slides.length; i++) {
      const indicatorClassName = i === 0 ? ['indicator', 'active'] : 'indicator'
      const indicator = this.newEl('li', indicatorClassName)
      const button = this.indicatorButton(i)
      const span = this.newEl('span')
      span.classList.add('ir-hidden')
      span.innerText = `${i + 1}번째 슬라이드`
      button.appendChild(span)
      indicator.appendChild(button)
      indicators.appendChild(indicator)
    }
    return indicators
  }
  indicatorButton(index) {
    const button = this.newEl('button')
    button.addEventListener('click', () => {
      this.setActive(index)
      this.sliding()
    }) 
    return button
  }
  setElementsWidth() {
    // slidingArea
    this.slidingArea.style.width = `${this.viewportWidth() * this.slides.length}px`
    // slide
    for(const slide of this.slides) {
      slide.style.width = `${this.viewportWidth() * this.colsPerView}px`
    }
  }
  viewportWidth() {
    return window.getComputedStyle(this.viewport).width.split('px')[0] * 1
  }
  newEl(tagName, className) {
    const el = document.createElement(tagName)
    if(className) {
      className = Array.isArray(className) ? className : [className]
      el.classList.add(...className)
    }
    return el
  }
}

export default Carousel