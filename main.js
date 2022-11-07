/* global cytoscape, _ */

import { App } from './js/App.js'
import { CytoFilterByText } from './js/modules/CytoFilterByText.js'
import { CytoFilterPanel } from './js/modules/CytoFilterPanel.js'
import { CytoFilters } from './js/modules/CytoFilters.js'
import { CytoFocus } from './js/modules/CytoFocus.js'
import { CytoInfoPanel } from './js/modules/CytoInfoPanel.js'
import { CytoSimpleFilterBy } from './js/modules/CytoSimpleFilterBy.js'
import { CytoTimelineFilter } from './js/modules/CytoTimelineFilter.js'
import { CytoViewGraph } from './js/modules/CytoViewGraph.js'
import { CytoViewMap } from './js/modules/CytoViewMap.js'
import { CytoViewToggle } from './js/modules/CytoViewToggle.js'

import { decryptString, importKeyFromBase64 } from './crypt.mjs'

function init(style, elements) {
  const hasGps = elements.some((e) => e.data.lat && e.data.lng)

  const cy = window.cy = cytoscape({
    container: document.getElementById('cy'),
    style: style,
    elements: elements,
    // .filter((x) => x.group === 'nodes' && (+x.data.id) < 32),
    // .filter((x, i, a) => x.group === 'nodes' || a.find((y) => y.data.id === x.source) && a.find((y) => y.data.id === x.target)),
    layout: { name: 'circle' },
  })

  const graphLayouts = {
    'cose': {
      name: 'cose',
      idealEdgeLength: 100,
      nodeOverlap: 20,
      refresh: 20,
      fit: true,
      padding: 30,
      randomize: false,
      componentSpacing: 100,
      nodeRepulsion: 400000,
      edgeElasticity: 100,
      nestingFactor: 5,
      gravity: 80,
      numIter: 500,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0,
      animate: 'end',
      animationDuration: 200,
    },
    'cose-bilkent': {
      name: 'cose-bilkent',
      quality: 'proof', // "draft", "default" or "proof"
      nodeDimensionsIncludeLabels: false, // Whether to include labels in node dimensions. Useful for avoiding label overlap
      refresh: 30, // number of ticks per frame; higher is faster but more jerky
      fit: true, // Whether to fit the network view after when done
      padding: 60, // Padding on fit
      randomize: false, // Whether to enable incremental mode
      nodeRepulsion: 90000, // Node repulsion (non overlapping) multiplier
      idealEdgeLength: 200, // Ideal (intra-graph) edge length
      edgeElasticity: 0.45, // Divisor to compute edge forces
      nestingFactor: 0.1, // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
      gravity: 0.25, // Gravity force (constant)
      numIter: 2500, // Maximum number of iterations to perform
      tile: true, // Whether to tile disconnected nodes
      animate: 'end', // Type of layout animation. The option set is {'during', 'end', false}
      animationDuration: 400, // Duration for animate:end
      tilingPaddingVertical: 10, // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
      tilingPaddingHorizontal: 10, // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
      gravityRangeCompound: 1.5, // Gravity range (constant) for compounds
      gravityCompound: 1.0, // Gravity force (constant) for compounds
      gravityRange: 3.8, // Gravity range (constant)
      initialEnergyOnIncremental: 0.5 // Initial cooling factor for incremental layout
    }
  }

  const tileServer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const app = new App(document.body)
  app.init(cy, {
    focus: new CytoFocus(app),
    layout: new CytoViewGraph(app, graphLayouts, 'cose-bilkent'),
    // gui: new CytoGui(app),
    filters: new CytoFilters(app),
    timelineFilter: new CytoTimelineFilter(app),
    filterByText: new CytoFilterByText(app),
    filterByCity: new CytoSimpleFilterBy(app, document.getElementById('city-filter'), 'city'),
    filterByCountry: new CytoSimpleFilterBy(app, document.getElementById('country-filter'), 'country'),
    filterByAddress: new CytoSimpleFilterBy(app, document.getElementById('address-filter'), 'gps_address'),
    filtersPanel: new CytoFilterPanel(app),
    mapLayout: new CytoViewMap(app, {hasGps, tileServer}),
    viewToggle: new CytoViewToggle(app, hasGps),
    infoPanel: new CytoInfoPanel(app),
  })

  app.start()

  const update = () => {
    app.$emit('view/map:update')
    app.$emit('view/graph:update')
    app.$emit('info-panel:update')
  }

  update()
  app.$on('filter:done', _.throttle(() => {
    update()
  }, 10, { leading: true, trailing: true }))

  // app.modules.filters.addFilter((eles) => {
  //   return eles //.filter('node[label="Simeon Srl (33041)"]')
  // })

  window.app = app
}

function load({ encrypted = false } = {}) {
  const resources = {}

  const urlParams = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
    set: (searchParams, prop, value) => {
      if (value === null) {
        searchParams.delete(prop)
      } else {
        searchParams.set(prop, value)
      }
      return true
    }
  })

  const datasets = {
    'dblp': 'data/dblp.json',
    'ofa': 'data/ofa.json',
  }
  const datasetUrl = datasets[urlParams.dataset] || datasets.ofa
  if (encrypted) {
    let passwd = urlParams.passwd
    if (!passwd) {
      passwd = localStorage.getItem('passwd')
    } else {
      localStorage.setItem('passwd', passwd)
    }

    if (!passwd) {
      alert('Invalid URL: missing `passwd` parameter')
      return
    }

    const prom = Promise.all([
      importKeyFromBase64(passwd),
      fetch(datasetUrl.replace('.json', '.json.enc'))
        .then((res) => res.blob()),
    ]).then(([key, res]) => {
      return decryptString(key, res)
    }).then((res) => JSON.parse(res))
      .catch((err) => {
        console.error(err)
        alert('Invalid URL: invalid `passwd` parameter')
      })
    resources.data = prom
  } else {
    resources.data = fetch(datasetUrl).then((res) => res.json())
  }

  resources.style = fetch('cy-style.json').then((res) => res.json())

  Promise.all([
    resources.style,
    resources.data,
  ]).then(([style, data]) => {
    init(style, data)
  })
}

load({ encrypted: true })
