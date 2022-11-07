/* global tippy, _ */

import { CytoModule } from '../CytoModule.js'

function timestamp(str) {
  if (typeof str === 'number') return str
  if (!str) return null
  if (typeof str.value === 'string') return timestamp(str.value)
  const ts = new Date(str).getTime()
  if (Number.isNaN(ts)) return null
  return ts
}
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

function h(tag, attrs, children){
  const el = document.createElement(tag)
  Object.keys(attrs).forEach(function(key){
    const val = attrs[key]
    el.setAttribute(key, val)
  })
  children.forEach(function(child){
    el.appendChild(child)
  })
  return el
}
function t(text){
  return document.createTextNode(text)
}

function $(...args) {
  return document.querySelector(...args)
}


function paramSlider(opts) {
  const { min, max, step = 1, value, label = '' } = opts

  const $input = h('input', {
    type: 'range',
    min: min,
    max: max,
    step: step || 1,
    value: value,
    'class': 'slider',
  }, [])

  const $label = h('label', { 'class': 'param label label-default' }, [
    $input,
    t(label)
  ])

  return [$label, $input]
}

function paramSelect(opts) {
  const { label = '', options } = opts

  const $input = h('select', {}, options.map(({ value, label }) => {
    return h('option', { value }, [t(label)])
  }))

  const $label = h('label', { 'class': 'param label label-default' }, [
    $input,
    t(label)
  ])

  return [$label, $input]
}


export class CytoGui extends CytoModule {
  constructor(app) {
    super(app)

    this.$paramList = document.querySelector('#config')
    if (!this.$paramList) {
      throw new Error('CytoGui: No #config container found.')
    }

    this.$buttonList = h('div', { 'class': 'param' }, [])
    this.$paramList.appendChild(this.$buttonList)

    /** Keep a record of the container of a given parameter input */
    this.domMapping = {}

    /** Keep a record of a given parameter input element */
    this.inputMapping = {}

    this.valueMapping = {}

    this.inputs = {}
    this.buttons = []

    this.app.$on('gui:parameter-changed', ({ name, value }) => {
      this.updateGraphLayout(this.valueMapping)
      console.log(name, value)
    })

    this.app.$on('gui:parameters-changed', (params) => {
      this.updateGraphLayout(params)
    })
  }

  init() {
    const cy = this.app.cy

    $('#config-toggle').addEventListener('click', function(){
      $('.config-container').classList.toggle('config-closed')
      cy.resize()
    })

    // const getLayout = () => layout
    // const focusMode = new CytoFocusMode(cy, getLayout)
    // focusMode.init()

    this.initTooltips()

    this.inputs = {
      name: {
        label: 'Algorithm',
        type: 'select',
        options: [
          { label: 'Cose', value: 'cose' },
          { label: 'Grid', value: 'grid' },
          { label: 'Random', value: 'random' },
          { label: 'Concentric', value: 'concentric' },
          { label: 'Circle', value: 'circle' },
          { label: 'avsdf', value: 'avsdf' },
          { label: 'breadthfirst', value: 'breadthfirst' },
        ],
      },
      idealEdgeLength: {
        label: 'Ideal Edge Length',
        min: 5,
        max: 200,
      },
      nodeOverlap: {
        label: 'Node Overlap',
        min: 1,
        max: 50,
      },
      componentSpacing: {
        label: 'Component Spacing',
        min: 1,
        max: 1000,
      },
      nodeRepulsion: {
        label: 'Node Repulsion',
        min: 100,
        max: 1000000,
      },
      edgeElasticity: {
        label: 'Edge Elasticity',
        min: 1,
        max: 1000,
      },
      nestingFactor: {
        label: 'Nesting Factor',
        min: 1,
        max: 10,
      },
      gravity: {
        label: 'Gravity',
        min: 1,
        max: 200,
      },
      numIter: {
        label: 'Num Iter',
        min: 1,
        max: 3000,
      },
      initialTemp: {
        label: 'Initial Temp',
        min: 0,
        max: 500,
      },
      coolingFactor: {
        label: 'Cooling Factor',
        min: 0,
        max: 1,
        step: 0.01,
      },
      minTemp: {
        label: 'Min Temp',
        min: 0,
        max: 2,
        step: 0.01,
      },
    }

    this.buttons = [
      {
        label: h('span', { 'class': 'fa fa-random' }, []),
        layoutOpts: {
          randomize: true,
          flow: null
        }
      },
      {
        label: h('span', { 'class': 'fa fa-long-arrow-down' }, []),
        layoutOpts: {
          flow: { axis: 'y', minSeparation: 30 }
        }
      },
    ]
  }

  linkInput(name, $container, $input) {
    this.inputs[name] = { type: 'custom' }
    this.domMapping[name] = $container
    this.inputMapping[name] = $input
    this.valueMapping[name] = this.inputMapping[name].value
  }

  registerInput(name, spec) {
    this.inputs[name] = spec
    this.initInput(name)
  }

  initInput(name) {
    const spec = this.inputs[name]
    if (spec.type === 'select') {
      this.makeInput(name, spec)
    } else if (spec.type === 'custom') {
      // skip
    } else {
      this.makeSlider(name, spec)
    }
  }

  start() {
    for (const name in this.inputs) {
      this.initInput(name)
    }
    for (const btn of this.buttons) {
      this.makeButton(btn)
    }

    // this.updateGraphLayout({
    //   name: 'cola',
    //   nodeSpacing: 5,
    //   edgeLengthVal: 5,
    //   animate: true,
    //   randomize: false,
    //   maxSimulationTime: 1500
    // })
    this.updateGraphLayout({
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
      animate: false,
    })
  }

  stop() {

  }

  updateGraphLayout(opts = {}) {
    this.valueMapping.randomize = false
    Object.assign(this.valueMapping, opts)

    for (const name in opts) {
      const value = opts[name]
      const $input = this.inputMapping[name]
      if ($input) { $input.value = value }
    }

    this.app.$emit('layout:update', this.valueMapping)
  }

  initTooltips() {
    const cy = this.app.cy

    const makeTippy = (node, html) => {
      return tippy(node.popperRef(), {
        html: html,
        theme: 'dark',
        trigger: 'manual',
        arrow: true,
        placement: 'bottom',
        hideOnClick: false,
        interactive: true
      }).tooltips[0]
    }

    const hideTippy = (node) => {
      const tippy = node.data('tippy')
      if (tippy) { tippy.hide() }
    }

    const hideAllTippies = () => {
      this.app.getAllElements().forEach(hideTippy)
    }

    // hide all
    cy.on('tap', (e) => {
      if (e.target === cy) {
        hideAllTippies()
      }
    })
    cy.on('tap', 'edge', () => {
      hideAllTippies()
    })
    cy.on('zoom pan', () => {
      hideAllTippies()
    })

    const span = (txt) => h('span', {}, [t(txt)])

    cy.nodes().forEach((x) => {
      const label = x.data('label')
      const dateStart = formatDate(timestamp(x.data('dateStart')))
      const dateEnd = formatDate(timestamp(x.data('dateEnd')))

      const popupText = [label, dateStart, dateEnd].map(span)
      const tippy = makeTippy(x, h('div', { 'class': 'ofa-tippy' }, popupText))

      x.data('tippy', tippy)

      x.on('mouseover', () => {
        hideAllTippies()
        tippy.show()
      })
      x.on('mouseout', () => {
        tippy.hide()
      })
    })

    // cy.edges().forEach((x) => {
    //   const weight = x.data('weight')
    //   const src = x.source().data('label')
    //   const tgt = x.target().data('label')

    //   const popupText = [weight, src, tgt].map(span)
    //   const tippy = makeTippy(x, h('div', { 'class': 'ofa-tippy' }, popupText))

    //   x.data('tippy', tippy)

    //   x.on('tap', () => {
    //     hideAllTippies()
    //     tippy.show()
    //   })
    // })
  }


  makeInput(name, spec) {
    const funcs = {
      'select': paramSelect,
      'number': paramSlider,
    }
    const [$container, $input] = funcs[spec.type](spec)
    this.$paramList.appendChild($container)

    if ('value' in spec) {
      this.valueMapping[name] = spec.value
      $input.value = spec.value
    }
    this.inputMapping[name] = $input
    this.domMapping[name] = $container

    const update = _.throttle(() => {
      const value = $input.value
      this.setValue(name, value)
      this.app.$emit('gui:parameter-changed', { name, value })
    }, 1000/30)

    $input.addEventListener('input', update)
    $input.addEventListener('change', update)
  }


  makeSlider(name, spec) {
    spec.type = 'number'
    this.makeInput(name, spec)
  }

  makeButton(opts) {
    const $button = h('button', { 'class': 'btn btn-default' }, [ opts.label ])

    this.$buttonList.appendChild( $button )

    $button.addEventListener('click', () => {
      if (opts.fn) {
        opts.fn()
      }

      if (opts.layoutOpts) {
        this.app.$emit('gui:parameters-changed', opts.layoutOpts)
      }
    })
  }

  setValue(name, value) {
    this.valueMapping[name] = value
    this.inputMapping[name].value = value
  }

  updateValues(values) {
    for (const name in this.domMapping) {
      if (name in values) {
        this.setValue(name, values[name])
      } else {
        this.domMapping[name].remove()
        delete this.domMapping[name]
        delete this.inputMapping[name]
        delete this.valueMapping[name]
      }
    }

    this.app.$emit('gui:parameters-changed', values)
  }
}
