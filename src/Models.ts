export const stringWidth = 8
export const stringGap = 3
export const distanceBetweenStringCenters = stringWidth + stringGap

export interface IRatio {
  n?: number
  d?: number
  ratio: number
}

export interface IScaleRatio extends IRatio {
  index: number
}

export interface IConcreteFreq extends IScaleRatio {
  root: number
  octaveIndex: number
}

export interface IVisualFreq extends IConcreteFreq {
  visible: boolean
}

export const getAbsoluteFreq = (freq: IVisualFreq) => freq.root * freq.ratio

export enum Octaves {
  ONE = "One", TWO = "Two", PIANO = "Piano (3 above, 4 below reference)"
}

export const allOctaves = Object.values(Octaves).filter(item => isNaN(Number(item))).map(item => item as Octaves)

export enum ScaleType {
  EQUAL = "Equal temperament", JUST = "Just intonation", PYTHAGOREAN = "Pythagorean"
}

export const allScaleTypes = Object.values(ScaleType).filter(item => isNaN(Number(item))).map(item => item as ScaleType)