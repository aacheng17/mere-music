import { delay, motion } from "motion/react";
import { IStringSettingsModel } from "../StringSettings";
import React from "react";
import { Strings } from "../Strings";
import { getAllFreqs, getEqualTemperamentRatios, getOctaveInfo } from "./construction";
import { Freq } from "../../Models";

export const EqualConstruction = ( props: { settings: IStringSettingsModel} ) => {
  const { settings } = props

  const [ ratioVisuals, setRatioVisuals ] = React.useState<Freq[]>([])
  const [ freqVisuals, setFreqVisuals ] = React.useState<Freq[]>([])

  const [ octaveMult, octavesBelow, octavesAbove ] = React.useMemo(() => getOctaveInfo(settings), [settings])

  const ratios = React.useMemo(() => getEqualTemperamentRatios(octaveMult, settings.notesPerOctave), [octaveMult, settings.notesPerOctave])

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