export const stringWidth = 8
export const stringGap = 3

export class Freq {
  root: number
  n?: number
  d?: number
  ratio: number
  absoluteFreq: number
  
  constructor(root: number, a: number, b?: number) {
    this.root = root
    
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

export enum ScaleType {
  EQUAL = "Equal temperament", JUST = "Just intonation", PYTHAGOREAN = "Pythagorean"
}

export const allScaleTypes = [ ScaleType.EQUAL, ScaleType.JUST, ScaleType.PYTHAGOREAN ]