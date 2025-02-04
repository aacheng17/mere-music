export const stringWidth = 8
export const stringGap = 3
export const distanceBetweenStringCenters = stringWidth + stringGap

export class Ratio {
  private n: number
  private d: number
  private root: number
  private power: number
  private calculatedValue: number

  constructor(n?: number, d?: number, root?: number, power?: number) {
    this.n = n ?? 1
    this.d = d ?? 1
    this.root = root ?? 1
    this.power = power ?? 1
    this.calculatedValue = this.calculateValue()
  }

  private calculateValue() {
    return Math.pow(Math.pow(this.n, 1/this.root) / this.d, this.power)
  }

  static fromRatio(ratio: Ratio) {
    return new Ratio(ratio.n, ratio.d, ratio.root, ratio.power)
  }

  getValue() {
    return this.calculatedValue
  }

  multN(x: number) {
    this.n *= x
    this.calculatedValue = this.calculateValue()
  }

  multD(x: number) {
    this.d *= x
    this.calculatedValue = this.calculateValue()
  }
}

export class Freq {
  ratio: Ratio
  rootHertz: number
  octaveIndex: number
  noteIndexWithinOctave: number
  calculatedValue: number
  visible: boolean

  constructor(ratio: Ratio, rootHertz: number, octaveIndex: number, noteIndexWithinOctave: number, visible: boolean) {
    this.ratio = ratio
    this.rootHertz = rootHertz
    this.octaveIndex = octaveIndex
    this.noteIndexWithinOctave= noteIndexWithinOctave
    this.visible = visible
    this.calculatedValue = ratio.getValue() * rootHertz
  }

  getHertz() {
    return this.calculatedValue
  }
}

export enum Octaves {
  ONE = "One", TWO = "Two", PIANO = "Piano (3 above, 4 below reference)"
}

export const allOctaves = Object.values(Octaves).filter(item => isNaN(Number(item))).map(item => item as Octaves)

export enum ScaleType {
  EQUAL = "Equal temperament", JUST = "Just intonation", PYTHAGOREAN = "Pythagorean"
}

export const allScaleTypes = Object.values(ScaleType).filter(item => isNaN(Number(item))).map(item => item as ScaleType)