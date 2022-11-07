/* global noUiSlider, _ */

import { CytoModule } from '../CytoModule.js'

function timestamp(str) {
  if (typeof str === 'number') return str
  if (!str) return null
  if (typeof str.value === 'string') return timestamp(str.value)
  const ts = new Date(str).getTime()
  if (Number.isNaN(ts)) return null
  return ts
}
function getPreferredLocale() {
  return navigator.languages[0] || 'fr'
}
const dateFormatter = new Intl.DateTimeFormat(getPreferredLocale(), {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  // hour: '2-digit',
  // minute: '2-digit',
})
function formatDate(date) {
  return date ? dateFormatter.format(date) : null
}

export class CytoTimelineFilter extends CytoModule {
  constructor (app) {
    super(app)

    /** @type {ReturnType<makeFilter>[]} */
    this.filters = []
  }

  init() {
    const [minDate, maxDate] = this.getRangeFromData()
    this.filteredRange = [minDate, maxDate]

    this.root = this.app.domRoot.querySelector('#timeline-filter')
    const step = 1 * 24 * 60 * 60 * 1000 // 1 day in milliseconds
    this.slider = noUiSlider.create(this.root, {
      behaviour: 'drag',
      connect: true,
      tooltips: [true, true],
      format: { to: (v) => Number(v), from: (v) => Number(v) },
      // format: { to: (v) => formatDate(new Date(v)), from: v => Number(v) },
      range: {
        min: minDate - step,
        max: maxDate + step,
      },
      step: step,
      start: [minDate, maxDate]
    })

    /** @type {import('./CytoFilters.js').CytoFilters} */
    const filtersModule = this.app.modules.filters
    this.filter = filtersModule.addFilter((eles) => this._filter(eles))

    const onChange = _.throttle((values) => {
      this.filteredRange = values
      setTimeout(() => {
        this.filter.update()
      }, 0)
    }, 1000/30)
    this.slider.on('change', onChange)

    const tooltips = [...this.root.querySelectorAll('.noUi-tooltip')]
    this.slider.on('update', (values, handle) => {
      // this.filteredRange = values
      // this.filter.update()
      // this.filter.update__norender()
      onChange(values)
      tooltips[handle].innerHTML = formatDate(new Date(+values[handle]))
    })
  }

  _filter(eles) {
    const [min, max] = this.filteredRange
    if (min === null && max === null) {
      return eles
    }

    return eles.filter((ele) => {
      if (!ele.isNode()) return true

      const dateStart = timestamp(ele.data('dateStart'))
      const dateEnd = timestamp(ele.data('dateEnd'))
      const minDate = dateStart ? dateStart : dateEnd
      const maxDate = dateEnd ? dateEnd : dateStart

      if (min !== null && maxDate && maxDate < min) {
        return false
      }
      if (max !== null && minDate && minDate > max) {
        return false
      }
      return true
    })
  }

  start() {
    this.filter.update()
  }

  stop() {

  }

  getRangeFromData() {
    const nodes = this.app.getAllElements().nodes()
    const allDateStart = nodes.map((ele) => timestamp(ele.data('dateStart')))
    const allDateEnd = nodes.map((ele) => timestamp(ele.data('dateEnd')))

    const allDates = [...allDateStart, ...allDateEnd]
    const filteredDates = allDates.filter((date) => date !== null)

    const min = Math.min(...filteredDates)
    const max = Math.max(...filteredDates)
    return [min || max, max || min]
  }
}
