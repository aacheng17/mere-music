import { motion } from "motion/react";
import { IStringSettingsModel } from "../StringSettings";
import React from "react";
import { Strings } from "../Strings";
import { getAllFreqs, getEqualTemperamentRatios, getOctaveInfo } from "./construction";
import { Freq } from "../../Models";
import { Anim } from "../animation";

export const EqualConstruction = ( props: { settings: IStringSettingsModel} ) => {
  const { settings } = props

  const [ octaveMult, octavesBelow, octavesAbove ] = React.useMemo(() => getOctaveInfo(settings), [settings])

  const ratios = React.useMemo(() =>
    getEqualTemperamentRatios(octaveMult, settings.notesPerOctave)
  , [octaveMult, settings.notesPerOctave])

  const stepOneFreqs = React.useMemo(() => ratios.map((ratio, i) => new Freq(ratio, 440, 0, i, true)), [ratios])

  const freqs = React.useMemo(() => {
    return getAllFreqs(ratios, settings.referenceNote, octaveMult, octavesAbove, octavesBelow)
  }, [octaveMult, octavesAbove, octavesBelow, ratios, settings.referenceNote])

  return <motion.div>
    <Strings freqs={stepOneFreqs} settings={settings} anim={Anim.FROM_STRING} />
    <Strings freqs={freqs} settings={settings} />
  </motion.div>
}
