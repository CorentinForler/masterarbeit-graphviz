import { CytoModule } from './CytoModule.js'

export class CytoModuleGroup extends CytoModule {
  constructor(app, subModules) {
    super(app)
    this.subModules = subModules
  }

  init() {
    this.subModules.forEach(m => m.init?.())
  }

  start() {
    this.subModules.forEach(m => m.start?.())
  }

  stop() {
    this.subModules.forEach(m => m.stop?.())
  }

  enable() {
    this.subModules.forEach(m => m.enable?.())
  }

  disable() {
    this.subModules.forEach(m => m.disable?.())
  }
}
