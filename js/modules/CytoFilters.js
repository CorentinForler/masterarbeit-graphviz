import { CytoModule } from '../CytoModule.js'

function makeFilter(/** @type {(cy) => Array} */ filter, enabled = true) {
  return {
    filter,
    enabled,
    keptEles: [],
    removedEles: [],
  }
}

export class CytoFilters extends CytoModule {
  constructor (app) {
    super(app)

    /** @type {ReturnType<makeFilter>[]} */
    this.filters = []

    this.previouslyRemoved = []
    this.didFiltersDoAnything = false
    this.ready = false
  }

  init() {
    this.app.$on('filter:update', (index) => this._updateFilter(index))
    this.previouslyRemoved = this.app.cy.collection()
    this.ready = true
  }

  start() {
    this._updateFilters()
    this.didFiltersDoAnything = true
    this.done()
  }

  stop() {
    // this.filters.forEach(filter => this.app.cy.add(filter.removed))
  }

  done() {
    if (!this.ready) return
    if (this.didFiltersDoAnything) {
      this.app.$emit('filter:done')
    } else {
      window.DEBUG && console.info('CytoFilters: no changes, skipping $emit(filter:done)')
    }
  }

  addFilter(filter, enabled = true) {
    const index = this.filters.length
    this.filters.push(makeFilter(filter, enabled))
    this._updateFilter(index)
    this.done()
    return {
      // use arrow functions to bind `this` to the module
      update: () => {
        this._updateFilter(index)
        this.done()
      },
      update__norender: () => {
        this._updateFilter(index)
      },
      enable: () => {
        this.enableFilter(index)
      },
      disable: () => {
        this.disableFilter(index)
      },
      remove: () => {
        this.filters[index] = undefined
      },
    }
  }

  enableFilter(index) {
    const filter = this.filters[index]
    if (filter || filter.enabled === false) {
      filter.enabled = true
      this._updateFilter(index)
    }
    // always update layout after enabling a filter, even if it was already enabled
    this.done()
  }

  disableFilter(index) {
    const filter = this.filters[index]
    if (!filter || filter.enabled === false) {
      // early return: if filter is already disabled, then no propagation/re-render is necessary
      return
    }
    filter.enabled = false
    this._updateFilter(index)
    this.done()
  }

  _updateFilters() {
    if (!this.ready) return
    const input = this.app.getAllElements()
    this._show(input)
    const output = Object.values(this.filters)
      .filter(flt => flt && flt.enabled)
      .reduce((eles, flt) => flt.filter(eles), input)

    const removed = input.not(output)
    this.didFiltersDoAnything = !this.previouslyRemoved.equals(removed)
    this.previouslyRemoved = removed

    this._hide(removed)
  }

  _updateFilter(index) {
    return this._updateFilters()

    /*
    if (index >= this.filters.length) { return }

    const filter = this.filters[index]
    if (!filter) {
      return this._updateFilter(index + 1)
    }

    const input = (index > 0) ? this.filters[index - 1].keptEles : (this.app.getAllElements() || this.app.cy.elements())
    this._show(input)

    const output = filter.enabled ? filter.filter(input) : input
    const removed = input.not(output)

    if (output.not(input).length > 0) {
      console.warn(`CytoFilters: filter ${index} returned elements that are not in the input collection`, filter, output.not(input))
    }

    // if (filter.removedEles.length) {
    //   this._show(filter.removedEles) // restore previously removed elements
    // }
    this._hide(removed) // remove elements that are filtered out

    filter.keptEles = this.app.cy.elements() // output
    filter.removedEles = removed

    if (index < this.filters.length - 1) {
      return this._updateFilter(index + 1) // propagate to next filter
    } */
  }

  _show(eles) {
    // eles.show()
    eles.restore()
    // this.app.cy.add(eles)
    // eles.style({ 'visibility': 'visible' })
  }
  _hide(eles) {
    // eles.hide()
    eles.remove()
    // this.app.cy.remove(eles)
    // eles.style({ 'visibility': 'hidden' })
  }
}
