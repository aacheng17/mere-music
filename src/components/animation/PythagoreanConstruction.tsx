import { delay, motion } from "motion/react";
import { IStringSettingsModel } from "../StringSettings";
import React from "react";
import { IScaleRatio, IVisualFreq } from "../../Models";
import { Strings } from "../Strings";
import { getAllFreqs, getOctaveInfo } from "./construction";

export const PythagoreanConstruction = ( props: { settings: IStringSettingsModel} ) => {
  const { settings } = props

  const [ ratioVisuals, setRatioVisuals ] = React.useState<IVisualFreq[]>([])
  const [ freqVisuals, setFreqVisuals ] = React.useState<IVisualFreq[]>([])

  const [ octaveMult, octavesBelow, octavesAbove ] = React.useMemo(() => getOctaveInfo(settings), [settings])

  const ratios: IScaleRatio[] = React.useMemo(() => {
    const ratios: number[] = [1]
    const effectiveNotesPerOctave = settings.baseNum === settings.baseDen ? 1 : settings.notesPerOctave
    for (let i=1; i<effectiveNotesPerOctave; i++) {
      let ratio: number = ratios[ratios.length - 1]
      ratio *= settings.baseNum / settings.baseDen
      if (ratio > octaveMult) while (ratio > octaveMult) ratio /= octaveMult
      if (ratio < 1/octaveMult) while (ratio < 1/octaveMult) ratio *= octaveMult
      ratios.push(ratio)
    }
    ratios.sort()
    return ratios.map((ratio, i) => ({ ratio, index: i }))
  }, [octaveMult, settings.baseDen, settings.baseNum, settings.notesPerOctave])

  const freqs = React.useMemo(() => {
    return getAllFreqs(ratios, settings.referenceNote, octaveMult, octavesAbove, octavesBelow)
  }, [octaveMult, octavesAbove, octavesBelow, ratios, settings.referenceNote])

  React.useEffect(() => {
    let t = 250

    setRatioVisuals(ratios.map(ratio => ({
      ...ratio,
      root: 440,
      octaveIndex: 0,
      visible: false
    })))
    for (let i = 0; i < ratios.length; i++) {
      t += 500 / ratios.length
      delay(() => setRatioVisuals(ratioVisuals => {
        const result = [ ...ratioVisuals ]
        result[i].visible = true
        return result
      }), t)
    }

    t += 250

    setFreqVisuals(freqs.map(freq => ({
      ...freq,
      visible: false
    })))
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