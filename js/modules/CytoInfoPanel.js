/* global _ */

import { CytoBasePanel } from './CytoBasePanel.js'

function getPreferredLocale() {
  return navigator.languages[0] || 'fr'
}

const dateFormatter = new Intl.DateTimeFormat(getPreferredLocale(), {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatDate(date) {
  return date ? dateFormatter.format(date) : null
}

export class BaseInfoCardsRenderer {
  constructor(app) {
    this.app = app
  }

  /**
   * @param {HTMLElement} element is an empty DOM element
   * @param {Object} data is a non-null object
   */
  render(element, data) {
    if (data.isNode()) {
      const d = data.data()
      if (d.type === 'supplier' || d.type === 'client' || d.type === 'client+supplier') {
        element.classList.add('app-card')

        const titleElement = document.createElement('h3')
        titleElement.innerText = d.label

        const typeElement = document.createElement('div')
        typeElement.classList.add('app-card-badge')
        typeElement.innerText = d.type

        const selectBtn = document.createElement('button')
        selectBtn.classList.add('btn', 'btn-outline-primary', 'app-card-select-btn')
        selectBtn.innerHTML = 'Sélectionner'
        selectBtn.addEventListener('click', () => {
          this.app.cy.$(':selected').unselect()
          this.app.cy.$id(data.id()).select()
          // this.app.modules.focus?.setFocusedNode?.(data)
        })
        const focusBtn = document.createElement('button')
        focusBtn.classList.add('btn', 'btn-outline-primary', 'app-card-focus-btn')
        focusBtn.innerHTML = 'Focus'
        focusBtn.addEventListener('click', () => {
          this.app.cy.$(':selected').unselect()
          this.app.cy.$id(data.id()).select()
          this.app.modules.focus?.setFocusedNode?.(data)
        })
        const btns = document.createElement('div')
        btns.classList.add('app-card-btns')
        btns.append(focusBtn, selectBtn)

        const cityElement = document.createElement('div')
        cityElement.innerText = d.gps_address || [d.city, d.country].filter(x => x).join(', ')

        const detailsElement = document.createElement('details')
        detailsElement.append(this._makeDefinitionList(d))

        element.append(typeElement, btns, titleElement, cityElement, detailsElement)
        Object.assign(element.dataset, {
          type: d.type,
          id: d.id,
        })
        return
      }
    }

    return this._defaultRenderFunction(element, data)
  }

  _defaultRenderFunction(element, data) {
    element.classList.add('app-card')
    element.append(this._makeDefinitionList('data' in data ? data.data() : data))
  }

  _makeDefinitionList(kv) {
    const dl = document.createElement('dl')
    for (let [k, v] of Object.entries(kv)) {
      const dt = document.createElement('dt')
      dt.innerText = k
      dl.append(dt)
      const dd = document.createElement('dd')
      if (v === null || v === undefined || v === "") {
        v = 'ø'
      } else if (typeof v === 'object') {
        v = JSON.stringify(v, null, 0)
      } else if (typeof v === 'string' && v.match(/^\d{4}-\d{2}-\d{2}/)) {
        v = formatDate(new Date(v)) || v
      }
      dd.innerText = v
      dl.append(dd)
    }
    return dl
  }
}

export class CytoInfoPanel extends CytoBasePanel {
  constructor(app, renderer) {
    super(app, '#app-info-panel')

    this.container = document.getElementById('app-info-panel-contents')
    this.selection = []
    this.renderer = renderer || new BaseInfoCardsRenderer(this.app)

    this._throttledRender = _.throttle(this._render.bind(this), 100)

    // this.openPanel()
  }

  init() {
    this._render()

    this.app.cy.on('select unselect', _.debounce((e) => {
      const selected = this.app.cy.$(':selected')
      selected.union(e.target)
      this.updateSelection(selected)
    }, 16))
    this.app.$on('info-panel:update', () => {
      const selected = this.app.cy.$(':selected')
      this.updateSelection(selected)
    })
  }

  updateSelection(newSelection) {
    this.selection = newSelection
    this._render()
    // this._throttledRender()
  }

  _renderList(items) {
    for (const item of items) {
      const el = document.createElement('div')
      this.renderer.render(el, item)
      this.container.append(el)
    }
  }

  _render() {
    const tStart = performance.now()
    this.container.innerHTML = ''
    if (!('jsons' in this.selection)) return

    const items = this.selection
    this._renderList(items)

    const successors = this.selection.successors().nodes()
    if (successors.length){
      const hr = document.createElement('hr')
      const h3 = document.createElement('h3')
      h3.innerText = 'Successeurs'
      this.container.append(hr, h3)
      this._renderList(successors)
    }

    const predecessors = this.selection.predecessors().nodes()
    if (predecessors.length){
      const hr = document.createElement('hr')
      const h3 = document.createElement('h3')
      h3.innerText = 'Prédécesseurs'
      this.container.append(hr, h3)
      this._renderList(predecessors)
    }

    const tEnd = performance.now()
    window.DEBUG && (`Rendered ${items.length} items in ${tEnd - tStart}ms`)
  }
}
