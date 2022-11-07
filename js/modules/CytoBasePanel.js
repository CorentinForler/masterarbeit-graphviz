import { CytoModule } from '../CytoModule.js'

export class CytoBasePanel extends CytoModule {
  constructor(app, panelElement, appRootClass) {
    super(app)
    this.panelElement = typeof panelElement === 'string' ? this.app.$(panelElement) : panelElement
    this.appRootClass = appRootClass

    if (!(this.panelElement instanceof HTMLElement)) {
      throw new Error('panelElement must be a DOM element')
    }

    this.closePanel() // hide by default

    const btnClose = this.panelElement.querySelector('.app-panel-btn__close')
    const btnOpen = this.panelElement.querySelector('.app-panel-btn__open')

    btnClose.addEventListener('click', () => {
      this.closePanel()
    })

    btnOpen.addEventListener('click', () => {
      this.openPanel()
    })
  }

  isOpen() {
    return this.panelElement.classList.contains('app-panel__open')
  }

  openPanel() {
    this.panelElement.classList.add('app-panel__open')
    this.panelElement.classList.remove('app-panel__close')

    if (this.appRootClass) {
      this.app.domRoot.classList.add(this.appRootClass)
    }
  }

  closePanel() {
    this.panelElement.classList.add('app-panel__close')
    this.panelElement.classList.remove('app-panel__open')

    if (this.appRootClass) {
      this.app.domRoot.classList.remove(this.appRootClass)
    }
  }
}
