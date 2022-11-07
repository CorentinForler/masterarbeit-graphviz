import { CytoModule } from '../CytoModule.js'

export class CytoViewToggle extends CytoModule {
  constructor(app, hasGps = false) {
    super(app)

    this.buttons = this.app.$$('input[name="current-view-type"]')
    this.buttons.forEach(button => {
      button.addEventListener('change', () => {
        this._callback()
      })
    })

    this._hasGps = hasGps
  }

  init() {
    if (this._hasGps) {
      this.enable()
    } else {
      this.disable()
      this.setCurrentViewType('graph')
    }
  }

  enable() {
    this.enabled = true
    this.app.$('#current-view-type-btn-group').removeAttribute('hidden')
  }

  disable() {
    this.enabled = false
    this.app.$('#current-view-type-btn-group').setAttribute('hidden', 'hidden')
  }

  _callback() {
    const checkedButton = this.buttons.find(button => button.checked)
    if (checkedButton) {
      this.setCurrentViewType(checkedButton.dataset.viewType)
    }
  }

  setCurrentViewType(viewType) {
    this.buttons.forEach(button => {
      button.checked = (button.dataset.viewType === viewType)
    })
    if (viewType === 'graph') {
      this.app.$emit('view/map:hide')
      this.app.$emit('view/graph:show')
    } else if (viewType === 'map') {
      this.app.$emit('view/graph:hide')
      this.app.$emit('view/map:show')
    } else {
      throw new Error(`Unknown view type: ${viewType}`)
    }
  }
}
