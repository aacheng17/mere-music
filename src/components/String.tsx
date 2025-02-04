import React from 'react'
import { AnimatePresence, motion } from "motion/react"
import { Freq, ScaleType, stringWidth } from '../Models';
import { IStringSettingsModel } from './StringSettings';

export interface IStringProps {
  layoutId: string,
  freq: Freq,
  height: number,
  logHeight: number,
  x: number,
  logView: boolean,
  isSemiHover: boolean,
  onHoverStart?: ()=>void,
  onHoverEnd?: ()=>void,
  settings: IStringSettingsModel
}

export const String = (props: IStringProps) => {
  const { layoutId, freq, height, logHeight, x, logView, isSemiHover, onHoverStart, onHoverEnd, settings } = props

  const isBlackKey = React.useMemo(() => [1, 4, 6, 9, 11].includes(freq.noteIndexWithinOctave), [freq])
  const displayHeight = React.useMemo(() => logView ? logHeight: height, [height, logHeight, logView])
  const roundedFreq = React.useMemo(() => (Math.round(freq.getHertz() * 100) / 100).toFixed(2), [freq])

  const backgroundColor = React.useMemo(() => {
    const octaveMult = settings.octaveNum / settings.octaveDen
    const lowestHue = 200
    const hueRange = 180
    const hue = lowestHue + (octaveMult - freq.ratio.getValue()) / octaveMult * hueRange
    return `hsl(${hue}, 70%, 65%)`
  }, [freq, settings.octaveDen, settings.octaveNum])

  const animateContainer = React.useMemo(() => ({ x, opacity: freq.visible ? 1 : 0, y : freq.visible ? 0 : -16 }), [freq.visible, x])

  const animate = React.useMemo(() => {
    return {
      y: isSemiHover ? -8 : 0,
      transition: {
        y: { duration: 0.1 }
      }
    }
  }, [isSemiHover])

  const stringLabel: React.CSSProperties = React.useMemo(() => ({ width: '0px', visibility: isSemiHover ? 'visible' : 'hidden' }), [isSemiHover])
  const pianoKeyNoteString = React.useMemo(() => {
    switch (freq.noteIndexWithinOctave) {
      case 0: return 'A'
      case 2: return 'B';
      case 3: return 'C';
      case 5: return 'D';
      case 7: return 'E';
      case 8: return 'F';
      case 10: return 'G';
    }
  }, [freq.noteIndexWithinOctave])
  const pianoKey: React.CSSProperties = React.useMemo(() => ({ backgroundColor: isBlackKey ? 'black' : '#fbf7f5' }), [isBlackKey])

  return (<motion.div onHoverStart={onHoverStart} onHoverEnd={onHoverEnd}>
    <motion.div style={stringContainer} animate={animateContainer}>
      <motion.div style={stringLabel} animate={{ rotate: -90 }}>{roundedFreq}</motion.div>
      <motion.div
        layoutId={layoutId}
        style={{
          width: stringWidth,
          backgroundColor: backgroundColor,
          borderRadius: 5,
        }}
        animate={{
          ...animate,
          height: displayHeight
        }}
      />
      <AnimatePresence>
        {settings.scaleType === ScaleType.EQUAL && <motion.div style={pianoKeyContainer}>
          <motion.div
            style={pianoKey}
            animate={{ ...animate, height: '48px', width: stringWidth }}
            exit={{ opacity: 0, scale: 0 }}
          />
          <motion.div style={pianoKeyLabel}>{pianoKeyNoteString}</motion.div>
        </motion.div>}
      </AnimatePresence>
    </motion.div>
  </motion.div>)
}

const stringContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const pianoKeyContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const pianoKeyLabel: React.CSSProperties = { maxWidth: stringWidth, height: '14px', fontSize: '14px', lineHeight: '14px' }
