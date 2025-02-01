import { motion } from "motion/react"
import { distanceBetweenStringCenters, Freq, stringGap } from "../Models"
import React from "react"
import { String } from './String'
import { NoteInfoPanel } from "./NoteInfoPanel"
import { IStringSettingsModel } from "./StringSettings"

const getStringLogHeight = (freq: Freq) => Math.log(20000 / freq.absoluteFreq) * 100

export const Strings = (props: { freqs: Freq[], settings: IStringSettingsModel }) => {
  const { freqs, settings } = props

  const [ hoveredStringIndex, setHoveredStringIndex ] = React.useState<number>()

  const [ stringElements, containerWidth ] = React.useMemo(() => {
    if (!freqs?.length) return []

    const containerWidth = distanceBetweenStringCenters * (freqs.length - 1)

    const stringData = freqs.map((freq, i) => {
      const height = 34300 / freq.absoluteFreq
      const logHeight = getStringLogHeight(freq)
      return {
        freq,
        height,
        logHeight,
        layoutId: `string${i}`,
        logView: settings.logView,
        isSemiHover: hoveredStringIndex !== undefined && (i % settings.notesPerOctave === hoveredStringIndex % settings.notesPerOctave) || false,
        onHoverStart: () => setHoveredStringIndex(i),
        onHoverEnd: () => setHoveredStringIndex(undefined),
        settings: settings
      }
    })

    let strings: JSX.Element[] = []

    if (settings.evenXSpacing) {
      strings = stringData.map(s => <String {...s} x={0} />)
    } else {
      const averageDiffLogHeight = (stringData[stringData.length-1].logHeight - stringData[0].logHeight) / (stringData.length - 1)
      strings = stringData.map((s, i) => {
        const x = i === 0 ? 0 : (stringData[i].logHeight - stringData[i-1].logHeight - averageDiffLogHeight) / Math.abs(averageDiffLogHeight) * distanceBetweenStringCenters
        return <String {...s} x={x} />
      })
    }
    
    return [ strings, containerWidth ]
  }, [freqs, hoveredStringIndex, settings])

  const stringsContainer: React.CSSProperties = React.useMemo(() => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: `${stringGap}px`,
    width: `${containerWidth}px`,
    margin: 'auto',
  }), [containerWidth])
  
  return <motion.div style={strings}>
    <NoteInfoPanel primaryNote={hoveredStringIndex ? freqs[hoveredStringIndex] : undefined} />
    <motion.div style={stringsContainer}>{stringElements}</motion.div>
  </motion.div>
}

const strings: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
}