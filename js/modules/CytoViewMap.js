/* global _ */

import { CytoModule } from '../CytoModule.js'

const Leaflet = window.L

function _select(ele) {
  window.DEBUG && console.log('select', ele)
  if (ele.selected()) {
    // ele.unselect()
  } else {
    ele.select()
  }
}

function distanceInPixels(map, a, b) {
  return Leaflet.GeometryUtil.distance(map, a, b)
}

function distanceInRealWorldUnits(a, b) {
  return Leaflet.GeometryUtil.length([a, b])
}

function distanceAsString(a, b) {
  return Leaflet.GeometryUtil.readableDistance(distanceInRealWorldUnits(a, b), 'metric')
}

export class CytoViewMap extends CytoModule {
  constructor(app, {hasGps = false, tileServer = '/tile/{s}/{z}/{x}/{y}.png'} = {}) {
    super(app)

    this.enabled = hasGps
    this.leaflet = null
    this.options = {
      hasGps,
      tileServer,
    }

    this.app.$on('view/map:show', this.enable.bind(this))
    this.app.$on('view/map:hide', this.disable.bind(this))
    this.app.$on('view/map:update', this.update.bind(this))
  }

  init() {
    if (this.enabled) {
      this._initMap()
      this._initMarkers()

      const container = this.leaflet.mapContainer.parentElement
      const mapBackground = this.leaflet.map._panes.tilePane
      // reduce contrast of the map with respect to the markers
      mapBackground.style.filter = 'saturate(0.5)'

      container.addEventListener('dblclick', (event) => {
        if (this.enabled && this.leaflet) {
          // check that we're not tapping on a node (.leaflet-interactive)
          if (!event.target.classList.contains('leaflet-interactive')) {
            this.leaflet.fit(undefined, { animate: true })
          }
        }
      })
      this.app.cy.on('select unselect', _.debounce(() => {
        const tStart = performance.now()
        // this._recomputeStylesForMarkers(this.app.allElements)
        this.update()
        const tEnd = performance.now()
        window.DEBUG && console.log('map on: select/unselect', tEnd - tStart, 'ms')
      }, 16))

      this.leaflet.map.on('contextmenu', (e) => {
        e.originalEvent.preventDefault()

        const a = e.latlng
        if (typeof a.lat !== 'number' || typeof a.lng !== 'number') return

        const nodes = this.app.getAllElements().filter(el => {
          const b = {
            lat: el.data('lat'),
            lng: el.data('lng'),
          }
          if (typeof b.lat !== 'number' || typeof b.lng !== 'number') return false
          const distPx = distanceInPixels(this.leaflet.map, a, b)
          // if (distPx < 16)
          //   console.log(el.data('city'), distPx, distanceAsString(a, b))
          return distPx < 16 // in pixels
        })

        this.app.cy.$(':selected').unselect()
        nodes.select()
        this.leaflet.fit(nodes, { padding: [128, 128, 128, 128], animate: true })
        // this.app.modules.focus.setFocusedNodes(nodes)
        // this.leaflet.fit()
        // const currZoom = this.leaflet.map.getZoom()
        // this.leaflet.map.setView([lat, lng], currZoom)
      })
    }
  }

  _initMap() {
    if (!this.enabled) return

    const cy = this.app.cy
    const Leaflet = window.L

    this.leaflet = cy.L({
      minZoom: 0,
      maxZoom: 18,
      zoomSnap: 1,
      updateLayout: false,
    }, {
      getPosition: (node) => {
        const lng = node.data('lng')
        const lat = node.data('lat')
        return typeof lng === 'number' && typeof lat === 'number'
          ? { lat, lng }
          : null
      },
      // setPosition: (node, lngLat) => {
      //   node.data('lng', lngLat.lng)
      //   node.data('lat', lngLat.lat)
      //   console.log(node.id(), lngLat)
      // },
      animate: false,
      animationDuration: 0,
      doubleClickZoom: false,
    })

    // Place the map below the graph.
    // This is needed because cytoscape-leaflet uses 'absolute' positioning
    // but the canvas container of cytoscape is 'relative'.
    // this.leaflet.mapContainer.style.zIndex = '-1'

    const layer = Leaflet.tileLayer(this.options.tileServer, { minZoom: 0, maxZoom: 19 })
    layer.addTo(this.leaflet.map)

    const attribution = this.leaflet.map.attributionControl
    attribution.setPrefix('')
    attribution.addAttribution('© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>')

    const zoomControl = this.leaflet.map.zoomControl
    zoomControl.setPosition('bottomright')
  }

  _initMarkers() {
    if (!this.enabled) return

    const cy = this.app.cy

    this.app.getAllElements().hide()
    cy.nodes().forEach(this._initNodeMarker.bind(this))
    cy.edges().forEach(this._initEdgeMarker.bind(this))
  }

  _destroyMap() {
    this.app.cy.nodes().forEach(this._destroyNodeMarker.bind(this))
    this.app.cy.edges().forEach(this._destroyEdgeMarker.bind(this))
    this.app.getAllElements().show()
    this.leaflet.cy = this.app.cy
    this.leaflet.disable()
    // this.leaflet.destroy()
    // this.leaflet = null
  }

  enable() {
    if (this.enabled) return
    this.enabled = true
    if (!this.leaflet) {
      this.init()
    }
    this.app.getAllElements().hide()
    this.leaflet.enable()
    this.update()
    this.leaflet.mapContainer.hidden = false
  }

  disable() {
    if (!this.enabled) return
    this.enabled = false
    this.app.getAllElements().show()
    this.leaflet.disable()
    this.leaflet.mapContainer.hidden = true
    // this._destroyMap()
  }

  update() {
    if (!this.enabled) return
    if (!this.leaflet) this.init()

    const allElements = this.app.getAllElements()
    const elements = this.app.cy.elements()
    const removed = allElements.not(elements)
    // console.warn('removed:', removed)
    for (const ele of removed) {
      if (ele.isNode()) {
        this._destroyNodeMarker(ele)
      } else if (ele.isEdge()) {
        this._destroyEdgeMarker(ele)
      }
    }

    // console.warn('added:', elements)
    for (const ele of elements) {
      if (ele.isNode()) {
        this._initNodeMarker(ele)
      } else if (ele.isEdge()) {
        this._initEdgeMarker(ele)
      }
    }

    this._recomputeStylesForMarkers(elements)
  }

  _buildStyleTable() {
    this._styleTable = []
    const styles = Array.from(this.app.cy.style())
    for (const s of styles) {
      if (s.selector) {
        const styleObj = {}
        this._styleTable.push({
          selector: s.selector,
          style: styleObj, // reference
        })

        for (let { name, strValue } of s.properties) {
          if (name === 'z-index') continue

          if (name === 'line-color') {
            styleObj['stroke'] = strValue
          } else if (name === 'line-width') {
            styleObj['stroke-width'] = strValue
          } else if (name === 'opacity') {
            styleObj['stroke-opacity'] = strValue
          } else if (name === 'line-style') {
            if (strValue === 'dashed') {
              styleObj['stroke-dasharray'] = '5 5'
            } else if (strValue === 'dotted') {
              styleObj['stroke-dasharray'] = '1 5'
            }
          } else if (name === 'shape') {
            if (strValue === 'rectangle') {
              styleObj['border-radius'] = '1px'
            } else if (strValue === 'ellipse') {
              styleObj['border-radius'] = '99999px'
            } else if (strValue === 'diamond') {
              styleObj['border-radius'] = '4px'
            }
          }
          styleObj[name] = strValue
        }
      }
    }
  }

  _recomputeStylesForMarkers(elements) {
    if (!this._styleTable) this._buildStyleTable()

    for (const { selector, style } of this._styleTable) {
      for (const ele of elements) {
        const marker = ele.scratch('marker')

        if (!marker) continue
        if (!selector.matches(ele)) continue

        const markerEl = marker._icon || marker._path
        if (!markerEl) continue
        Object.assign(markerEl.style, style)
      }
    }
  }

  _initNodeMarker(node) {
    const lng = node.data('lng')
    const lat = node.data('lat')
    if (typeof lng === 'number' && typeof lat === 'number') {
      const prevMarker = node.scratch('marker')
      if (prevMarker) {
        return // prevMarker.remove()
      }
      const div = Leaflet.divIcon({ iconSize: [16, 16] })
      const marker = Leaflet.marker([lat, lng], { icon: div }).addTo(this.leaflet.map)
      node.scratch('marker', marker)
      marker.on('click', () => {
        _select(node)
      })
    }
  }

  _destroyNodeMarker(node) {
    const marker = node.scratch('marker')
    if (marker) {
      marker.remove()
      node.scratch('marker', null)
    }
  }

  _initEdgeMarker(edge) {
    const source = edge.source()
    const target = edge.target()
    if (source.data('lng') && target.data('lng')) {
      const prevLine = edge.scratch('marker')
      if (prevLine) {
        return // prevLine.remove()
      }
      const line = Leaflet.polyline([
        [source.data('lat'), source.data('lng')],
        [target.data('lat'), target.data('lng')],
      ], {
        color: '#f00',
        weight: 2,
        opacity: 0.5,
        smoothFactor: 1,
        zIndex: 43,
      }).addTo(this.leaflet.map)
      edge.scratch('marker', line)
      line.on('click', () => {
        _select(edge)
      })
    }
  }

  _destroyEdgeMarker(edge) {
    const line = edge.scratch('marker')
    if (line) {
      line.remove()
      edge.scratch('marker', null)
    }
  }
}
