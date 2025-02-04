import { delay, motion } from "motion/react";
import { IStringSettingsModel } from "../StringSettings";
import React from "react";
import { Freq, Ratio } from "../../Models";
import { Strings } from "../Strings";
import { getAllFreqs, getOctaveInfo } from "./construction";

export const PythagoreanConstruction = ( props: { settings: IStringSettingsModel} ) => {
  const { settings } = props

  const [ ratioVisuals, setRatioVisuals ] = React.useState<Freq[]>([])
  const [ freqVisuals, setFreqVisuals ] = React.useState<Freq[]>([])

  const [ octaveMult, octavesBelow, octavesAbove ] = React.useMemo(() => getOctaveInfo(settings), [settings])

  const ratios: Ratio[] = React.useMemo(() => {
    const ratios = [new Ratio()]
    const effectiveNotesPerOctave = settings.baseNum === settings.baseDen ? 1 : settings.notesPerOctave
    for (let i=1; i<effectiveNotesPerOctave; i++) {
      const ratio = Ratio.fromRatio(ratios[ratios.length - 1])
      ratio.multN(settings.baseNum)
      ratio.multD(settings.baseDen)
      while (ratio.getValue() > octaveMult) { ratio.multD(octaveMult) }
      while (ratio.getValue() < 1 / octaveMult) { ratio.multN(octaveMult) }
      console.log(ratio.getValue())
      ratios.push(ratio)
    }
    ratios.sort((a, b) => a.getValue() < b.getValue() ? -1 : 1)
    return ratios
  }, [octaveMult, settings.baseDen, settings.baseNum, settings.notesPerOctave])

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