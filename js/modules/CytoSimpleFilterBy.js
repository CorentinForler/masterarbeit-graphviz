import { CytoFilterBy } from './CytoFilterBy.js'

export class CytoSimpleFilterBy extends CytoFilterBy {
  constructor(app, element, field) {
    const inputs = {
      text: element,
    }
    const func = (eles, { text }) => {
      const textLower = text.toLowerCase().trim()
      if (!textLower) {
        return eles
      }
      return eles.filter((ele) => {
        if (!ele.isNode()) return true

        const value = ele.data(field)
        if (value) {
          return value.toLowerCase().includes(textLower)
        }
        return true
      })
    }
    super(app, inputs, func)
  }
}
