import { Freq, Octaves, Ratio } from "../../Models"
import { IStringSettingsModel } from "../StringSettings"

const getOctaveRange = (settings: IStringSettingsModel) => {
  switch (settings.octaves) {
    case Octaves.ONE:
      return [0, 0]
    case Octaves.TWO:
      return [1, 0]
    case Octaves.PIANO:
      return [4, 2]
  }
}

export const getOctaveInfo = (settings: IStringSettingsModel) => {
  const octaveMult = settings.octaveNum / settings.octaveDen
  const [ octavesBelow, octavesAbove ] = getOctaveRange(settings)
  return [ octaveMult, octavesBelow, octavesAbove]
}

export const getAllFreqs = (ratios: Ratio[], referenceNote: number, octaveMult: number, octavesAbove: number, octavesBelow: number) => {
  let octaveRoots = [referenceNote]
  for (let i=0; i<octavesBelow; i++) {
    octaveRoots = [ octaveRoots[0] / octaveMult, ...octaveRoots]
  }
  for (let i=0; i<octavesAbove; i++) {
    octaveRoots.push(octaveRoots[octaveRoots.length - 1] * octaveMult)
  }

  let freqs: Freq[] = []
  octaveRoots.forEach((root, octaveIndex) => {
    freqs = [ ...freqs, ...ratios.map((ratio, i) => new Freq(ratio, root, octaveIndex, i, true)) ]
  })

  return freqs
}

export const getEqualTemperamentRatios = (octaveMult: number, notesPerOctave: number) => {
  const ratios: Ratio[] = []
  for (let i=0; i<notesPerOctave; i++) {
    ratios.push(new Ratio(octaveMult, 1, notesPerOctave, i))
  }
  return ratios
}