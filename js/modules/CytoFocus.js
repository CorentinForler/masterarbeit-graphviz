import { CytoModule } from '../CytoModule.js'

export class CytoFocus extends CytoModule {
  constructor(/** @type {import('../App.js').App} */ app) {
    super(app)

    this.filter = null
    this.chosenNodes = null

    /** @readonly */
    // this.allSaved = []
  }

  init() {
    /** @type {import('./CytoFilters.js').CytoFilters} */
    const filtersModule = this.app.modules.filters
    this.filter = filtersModule.addFilter((eles) => this._filter(eles), false) // disabled by default
  }

  _filter(input) {
    if (this.chosenNodes && this.chosenNodes.length) {
      // .union() takes two collections and adds both together without duplicates
      const chosen = this.app.cy.collection().union(this.chosenNodes)
      const connected = chosen
        .union(chosen.predecessors())
        .union(chosen.successors())
      // in one line:
      // event.target.union(event.target.predecessors().union(event.target.successors()))
      const kept = connected.intersection(input)
      return kept
    } else {
      return input
    }
  }

  setFocusedNodes(nodes) {
    this.setFocusedNode(nodes)
  }

  setFocusedNode(node) {
    if (node) {
      this.filter.disable()
      if (Array.isArray(node)) {
        this.chosenNodes = node
      } else {
        this.chosenNodes = [node]
      }
      this.filter.enable()
    } else {
      this.chosenNodes = null
      this.filter.disable()
    }
  }

  start() {
    const cy = this.app.cy

    cy.on('dbltap', (event) => {
      if (event.target?.isNode?.()) {
        this.setFocusedNode(event.target)
      }
    })

    cy.on('tap', (e) => {
      if (this.chosenNodes && this.chosenNodes.length && e.target === cy) {
        this.setFocusedNode(null)
      }
    })

    // cy.on('layoutstop', () => {
    //   if (this.chosenNodes && this.chosenNodes.length) {
    //     setTimeout(() => {
    //       const chosen = this.app.cy.collection().union(this.chosenNodes)
    //       cy.center(chosen)
    //     }, 10)
    //   }
    // })
  }
}
