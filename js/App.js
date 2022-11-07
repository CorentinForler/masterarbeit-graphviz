/* global cytoscape */

export class App {
  constructor(/** @type {HTMLElement} */ domRoot) {
    this.domRoot = domRoot

    /** @type {cytoscape.Core} */
    this.cy = null

    /** @type {Record<string, import('./CytoModule.js').CytoModule>} */
    this.modules = {}

    this.eventHandlers = {}
  }

  // cytoscape instance + list of modules
  init(/** @type {cytoscape.Core} */ cy, /** @type {Record<string, import('./CytoModule.js').CytoModule>} */ modules) {
    /** @type {cytoscape.Core} */
    this.cy = cy

    this.allElements = this.cy.elements()

    /** @type {Record<string, import('./CytoModule.js').CytoModule>} */
    this.modules = modules

    for (const moduleName in this.modules) {
      this.modules[moduleName].init()
    }
  }

  start() {
    for (const moduleName in this.modules) {
      this.modules[moduleName].start()
    }
  }

  stop() {
    for (const moduleName in this.modules) {
      this.modules[moduleName].stop()
    }
  }

  $(selector) {
    return this.domRoot.querySelector(selector)
  }

  $$(selector) {
    return [...this.domRoot.querySelectorAll(selector)]
  }

  $on(eventName, handler) {
    // console.info(`$on(${eventName}, ${handler})`)
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = []
    }
    this.eventHandlers[eventName].push(handler)
    return () => this.off(eventName, handler)
  }

  $emit(eventName, ...args) {
    // console.info(`$emit(${eventName}, ${JSON.stringify(args, 0, 2)})`)
    if (!this.eventHandlers[eventName]) { return }
    this.eventHandlers[eventName].forEach((handler) => {
      handler(...args)
    })
  }

  $off(eventName, handler) {
    // console.info(`$off(${eventName}, ${handler})`)
    if (!this.eventHandlers[eventName]) { return }
    this.eventHandlers[eventName] = this.eventHandlers[eventName].filter((h) => h !== handler)
  }

  getAllElements() {
    return this.allElements
  }

  updateAllElements() {
    this.allElements = this.cy.elements()
  }
}
