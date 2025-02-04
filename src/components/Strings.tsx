import { motion } from "motion/react"
import { distanceBetweenStringCenters, Freq, stringGap } from "../Models"
import React from "react"
import { String } from './String'
import { IStringSettingsModel } from "./StringSettings"
import { Anim } from "./animation"
import { makeStringAnimProps } from "./StringsAnim"

const getStringLogHeight = (absoluteFreq: number) => Math.log(20000 / absoluteFreq) * 100

export const Strings = (props: { freqs: Freq[], settings: IStringSettingsModel, anim?: Anim }) => {
  const { freqs, settings, anim } = props

  const [ hoveredStringIndex, setHoveredStringIndex ] = React.useState<number>()
  const [ triggerAnim, setTriggerAnim ] = React.useState(0)

  const [ stringElements, containerWidth ] = React.useMemo(() => {
    if (!freqs.length) return []

    const containerWidth = distanceBetweenStringCenters * (freqs.length - 1)

    const stringData = freqs.map((freq, i) => {
      const absoluteFreq = freq.getHertz()
      const logHeight = getStringLogHeight(absoluteFreq)
      const displayHeight = settings.logView ? logHeight : (34300 / absoluteFreq)
      return {
        freq,
        height: displayHeight,
        logHeight,
        layoutId: `string${i}`,
        logView: settings.logView,
        isSemiHover: hoveredStringIndex !== undefined && (i % settings.notesPerOctave === hoveredStringIndex % settings.notesPerOctave) || false,
        onHoverStart: () => setHoveredStringIndex(i),
        onHoverEnd: () => setHoveredStringIndex(undefined),
        settings: settings
      }
    })

    let stringProps = []
    if (settings.evenXSpacing) {
      stringProps = stringData.map(s => ({ ...s, x: 0 }))
    } else {
      const averageDiffLogHeight = (stringData[stringData.length-1].logHeight - stringData[0].logHeight) / (stringData.length - 1)
      stringProps = stringData.map((s, i) => {
        const x = i === 0 ? 0 : (stringData[i].logHeight - stringData[i-1].logHeight - averageDiffLogHeight) / Math.abs(averageDiffLogHeight) * distanceBetweenStringCenters
        return { ...s, x }
      })
    }
    
    let t = 250
    return [ stringProps.map((s, i) => {
      const duration = 1000
      const isFirst = i === 0
      const animProps = makeStringAnimProps({ anim: anim ?? Anim.SIMPLE, startTime: t, duration, sourceHeight: isFirst ? undefined : stringProps[i-1].height}, isFirst)
      t += duration + 250
      return <String key={i} {...s} animProps={animProps} triggerAnim={triggerAnim} />
    }), containerWidth ]
  }, [anim, freqs, hoveredStringIndex, settings, triggerAnim])

  const stringsContainer: React.CSSProperties = React.useMemo(() => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: `${stringGap}px`,
    width: `${containerWidth}px`,
    margin: 'auto',
  }), [containerWidth])
  
  return <motion.div style={strings}>
    <motion.button style={{position: 'absolute'}} onClick={() => setTriggerAnim(t => (t+1)%2)}>Reset</motion.button>
    <motion.div style={stringsContainer}>{stringElements}</motion.div>
  </motion.div>
}

const strings: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
}