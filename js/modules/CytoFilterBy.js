/* global _ */

import { CytoModule } from '../CytoModule.js'

export class CytoFilterBy extends CytoModule {
  constructor (
    app,
    /** @type {Record<string, HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} */ htmlInputs,
    /** @type {(eles, values) => Array} */ filterFunction,
  ) {
    super(app)

    this.htmlInputs = htmlInputs
    this.values = this.getAllValues()
    this.filterFunction = filterFunction
  }

  init() {
    /** @type {import('./CytoFilters.js').CytoFilters} */
    const filtersModule = this.app.modules.filters
    this.filter = filtersModule.addFilter((eles) => this._filter(eles))

    const updater = (key, input) => _.throttle(() => {
      const value = input.value
      this.values[key] = value
      this.filter.update()
    }, 1000/30)

    for (const key in this.htmlInputs) {
      const input = this.htmlInputs[key]
      const update = updater(key, input)
      input.addEventListener('input', update)
      input.addEventListener('change', update)
    }
  }

  start() {
    this.filter.update()
  }

  stop() {

  }

  getAllValues() {
    return Object.fromEntries(
      Object.entries(this.htmlInputs)
        .map(([key, input]) => [key, input.value]))
  }

  _filter(eles) {
    const values = this.values
    // const values = this.getAllValues()
    return this.filterFunction(eles, values)
  }
}
