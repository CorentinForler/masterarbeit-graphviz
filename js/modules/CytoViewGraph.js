import { CytoModule } from '../CytoModule.js'

export class CytoViewGraph extends CytoModule {
  constructor(app, allLayouts, defaultLayoutName) {
    super(app)

    this.currentLayout = null
    this.allLayouts = allLayouts
    this.previousParams = allLayouts[defaultLayoutName] || { name: 'random' }
    this.enabled = false
    this.updatedWhileDisabled = false

    this.app.$on('view/graph:show', this.enable.bind(this))
    this.app.$on('view/graph:hide', this.disable.bind(this))
    this.app.$on('view/graph:update', this.updateLayout.bind(this))
  }

  init() {
    this.currentLayout = this.app.cy.layout({ name: 'random' })
    this.currentLayout.run()

    this.app.$on('layout:update', (params) => {
      this.updateLayout(params)
    })

    this.app.cy.on('dbltap', (event) => {
      if (event.target === this.app.cy) {
        this.fit()
      }
    })
  }

  fit() {
    if (!this.enabled) return

    this.app.cy.fit(64) // fit with padding
  }

  updateLayout(params = null) {
    if (!this.enabled) {
      this.updatedWhileDisabled = true
      return
    }
    this.updatedWhileDisabled = false

    if (this.currentLayout) {
      this.currentLayout.stop()
    }

    const p = params || this.previousParams
    if (p) {
      this.currentLayout = this.app.cy.layout(p)
      this.previousParams = p
    }

    if (this.currentLayout) {
      this.currentLayout.run()
    }

    this.fit()
  }

  start() {
    if (!this.enabled) return
    this.updateLayout()
  }

  enable() {
    if (this.enabled) return
    this.enabled = true
    if (!this.currentLayout || this.updatedWhileDisabled) {
      this.updateLayout()
    }
  }

  disable() {
    if (!this.enabled) return
    this.enabled = false
  }
}
