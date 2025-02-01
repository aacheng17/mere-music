export const stringWidth = 8
export const stringGap = 3
export const distanceBetweenStringCenters = stringWidth + stringGap

export class Freq {
  root: number
  octaveIndex: number
  index: number
  n?: number
  d?: number
  ratio: number
  absoluteFreq: number
  
  constructor(root: number, octaveIndex: number, index: number, a: number, b?: number) {
    this.root = root
    this.octaveIndex = octaveIndex
    this.index = index
    
    if (b === undefined) {
      this.ratio = a
    } else {
      this.n = a
      this.d = b
      this.ratio = this.n / this.d
    }

    this.absoluteFreq = this.root * this.ratio
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