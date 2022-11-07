import { CytoFilterBy } from './CytoFilterBy.js'

export class CytoFilterByText extends CytoFilterBy {
  constructor(app) {
    const inputs = {
      text: document.getElementById('text-filter'),
    }
    const func = (eles, { text }) => {
      const textLower = text.toLowerCase().trim()
      if (!textLower) {
        return eles
      }
      return eles.filter((ele) => {
        if (!ele.isNode()) return true

        const label = ele.data('label')
        if (label) {
          return label.toLowerCase().includes(textLower)
        }
        return true
      })
    }
    super(app, inputs, func)
  }
}
