import { delay, motion } from "motion/react";
import { IStringSettingsModel } from "../StringSettings";
import React from "react";
import { Freq, Ratio } from "../../Models";
import { Strings } from "../Strings";
import { getAllFreqs, getEqualTemperamentRatios, getOctaveInfo } from "./construction";

const getGcd = (a:number,b:number): number => {
  return b ? getGcd(b, a%b) : a;
};

const reduceFraction = (n:number, d:number) => {
  const x = getGcd(n,d);
  return [n/x, d/x];
}
const getId = (x:number[]) => `${x[0]},${x[1]}`
const fromId = (x:string) => x.split(',').map(s => parseInt(s, 10))

export const JustConstruction = ( props: { settings: IStringSettingsModel} ) => {
  const { settings } = props

  const [ ratioVisuals, setRatioVisuals ] = React.useState<Freq[]>([])
  const [ freqVisuals, setFreqVisuals ] = React.useState<Freq[]>([])

  const [ octaveMult, octavesBelow, octavesAbove ] = React.useMemo(() => getOctaveInfo(settings), [settings])

  const ratios = React.useMemo(() => {
    const possibleRatios = new Set<string>()
    const ratios: Ratio[] = []
    let n = 1, d = 1;
    while (d <= settings.highestDenominator) {
      const r = getId(reduceFraction(n, d))
      if (!possibleRatios.has(r)) possibleRatios.add(r)
      if (n / d >= 2) {
        if (settings.powersOf2Only) {
          d*=2
        } else { d+=1 }
        n = d+1
      } else {
        n++
      }
    }

    const etRatios = getEqualTemperamentRatios(octaveMult, settings.notesPerOctave)
    etRatios.forEach((etRatio) => {
      let lowestDiff = 1
      let lowestId: string = ''
      for (const x of possibleRatios) {
        const diff = Math.abs(fromId(x)[0] / fromId(x)[1] - etRatio.getValue())
        if (diff < lowestDiff) {
          lowestDiff = diff
          lowestId = x
        }
      }
      ratios.push(new Ratio(fromId(lowestId)[0], fromId(lowestId)[1]))
    })

    return ratios
  }, [octaveMult, settings.highestDenominator, settings.notesPerOctave, settings.powersOf2Only])

  const freqs = React.useMemo(() => {
    return getAllFreqs(ratios, settings.referenceNote, octaveMult, octavesAbove, octavesBelow)
  }, [octaveMult, octavesAbove, octavesBelow, ratios, settings.referenceNote])

  React.useEffect(() => {
    let t = 250

    setRatioVisuals(ratios.map((ratio, i) => new Freq(ratio, 440, 0, i, false)))
    for (let i = 0; i < ratios.length; i++) {
      t += 500 / ratios.length
      delay(() => setRatioVisuals(ratioVisuals => {
        const result = [ ...ratioVisuals ]
        result[i].visible = true
        return result
      }), t)
    }

    t += 250

    setFreqVisuals(freqs)
    for (let i = 0; i < freqs.length; i++) {
      t += 500 / freqs.length
      delay(() => setFreqVisuals(freqVisuals => {
        const result = [ ...freqVisuals ]
        result[i].visible = true
        return result
      }), t)
    }
  }, [freqs, ratios, settings.notesPerOctave])

  return <motion.div>
    <Strings freqs={ratioVisuals} settings={settings} />
    <Strings freqs={freqVisuals} settings={settings} />
  </motion.div>
}