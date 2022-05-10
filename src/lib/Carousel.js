class Carousel {
  constructor(elem, options) {
    this.elem = elem
    this.options = options
    this.viewport = elem.querySelector('.viewport')
    this.slidingArea = elem.querySelector('.wrap-slides')
    this.slides = this.slidingArea.children
    this.activeIndex = 0
    this.slidesPerView = options.slidesPerView || 1
    this.viewportWidth = null
    this.connectedCarousel = options.connectedCarousel || null
    this.indicators = this.options.indicator !== false ? this.indicatorsHTML() : false
    this.arrows = this.options.arrow !== false ? this.arrowsHTML() : false

    this.init()
  }

  init() {
    this.createUtils()
    this.setElementsWidth()
  }
  createUtils() {
    this.arrows && this.viewport.appendChild(this.arrows)
    this.indicators && this.elem.appendChild(this.indicators)
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
      this.changeActiveIndex(this.nextActiveIndex(type))
    }) 
    return button
  }
  changeActiveIndex(newIndex) {
    this.setActive(newIndex)
    this.sliding()
    if(this.connectedCarousel) {
      this.connectedCarousel.setActive(newIndex)
      this.connectedCarousel.sliding()
    }
  }
  sliding() {
    const activeRange = Math.trunc(this.activeIndex / this.slidesPerView)
    this.slidingArea.style.transform = `translateX(-${this.viewportWidth * activeRange}px)`
  }
  setActive(nextActiveIndex) {
    this.activeIndex = nextActiveIndex
    this.setActiveSlide(nextActiveIndex)
    this.indicators && this.setActiveIndicator(nextActiveIndex)
  }
  setActiveSlide(nextActiveIndex) {
    const activeSlide = [...this.slides].filter(slide => slide.classList.value.includes('active'))[0]
    activeSlide && activeSlide.classList.remove('active')
    this.slides[nextActiveIndex].classList.add('active')
  }
  setActiveIndicator(nextActiveIndex) {
    const indicators = this.indicators.querySelectorAll('.indicator')
    const activeIndicator = this.indicators.querySelector('.indicator.active')
    activeIndicator && activeIndicator.classList.remove('active')
    indicators[nextActiveIndex].classList.add('active')
  }
  nextActiveIndex(prevOrNext) {
    const lastRange = Math.trunc((this.slides.length - 1) / this.slidesPerView)
    const activeRange = Math.trunc(this.activeIndex / this.slidesPerView)
    if(prevOrNext === 'prev') {
      const prevRangeFirstIndex = this.activeIndex - (1 * this.slidesPerView)
      return activeRange === 0 ? lastRange * this.slidesPerView : prevRangeFirstIndex
    } else if(prevOrNext === 'next') {
      const nextRangeFirstIndex = (activeRange + 1) * this.slidesPerView
      return activeRange === lastRange ? 0 : nextRangeFirstIndex
    }
  }
  indicatorsHTML() {
    const areaIndicator = this.newEl('div', 'area-indicator')
    const viewport = this.newEl('div', 'viewport')
    const listIndicator = this.newEl('ul', ['list-indicator', 'wrap-slides'])
    for(let i = 0; i < this.slides.length; i++) {
      const indicatorClassName = i === 0 ? ['indicator', 'active'] : 'indicator'
      const indicator = this.newEl('li', indicatorClassName)
      const button = this.indicatorButton(i)
      const span = this.newEl('span')
      span.classList.add('ir-hidden')
      span.innerText = `${i + 1}번째 슬라이드`
      if(this.options?.indicator?.type === 'preview') {
        const slideImg = this.slides[i].querySelector('img')
        const img = this.newEl('img')
        img.src = slideImg.src
        img.alt = `${slideImg.alt} 미리보기`
        button.appendChild(img)
      }
      button.appendChild(span)
      indicator.appendChild(button)
      listIndicator.appendChild(indicator)
    }
    viewport.appendChild(listIndicator)
    areaIndicator.appendChild(viewport)
    if(this.options?.indicator?.type === 'preview') {
      const carousel = this
      const indicatorCarousel = new Carousel(areaIndicator, {
        indicator: false,
        slidesPerView: 5,
        connectedCarousel: carousel
      })
      this.connectedCarousel = indicatorCarousel
    }
    return areaIndicator
  }
  indicatorButton(index) {
    const button = this.newEl('button')
    button.addEventListener('click', () => {
      this.changeActiveIndex(index)
    }) 
    return button
  }
  async setElementsWidth() {
    // viewport 
    const viewportWidthStyle = await window.getComputedStyle(this.viewport).width
    const areaSlidingWidthStyle = window.getComputedStyle(this.elem).width
    const viewportWidth = viewportWidthStyle || areaSlidingWidthStyle
    this.viewportWidth =  viewportWidth.split('px')[0] * 1
    // slidingArea
    const numMultiplied = Math.ceil(this.slides.length / this.slidesPerView)
    this.slidingArea.style.width = `${this.viewportWidth * numMultiplied}px`
    // slide
    for(const slide of this.slides) {
      slide.style.width = `${this.viewportWidth / this.slidesPerView}px`
    }
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