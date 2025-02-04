import React from 'react'
import { AnimatePresence, delay, motion, TargetAndTransition } from "motion/react"
import { Freq, ScaleType, stringWidth } from '../Models';
import { IStringSettingsModel } from './StringSettings';
import { makeStringAnimData } from './StringAnim';
import { IAnimProps } from './animation';

export interface IStringProps {
  layoutId: string,
  freq: Freq,
  height: number,
  x: number,
  isSemiHover: boolean,
  onHoverStart?: ()=>void,
  onHoverEnd?: ()=>void,
  settings: IStringSettingsModel,
  animProps: IAnimProps,
  triggerAnim: number
}

export const String = (props: IStringProps) => {
  const { layoutId, freq, height, x, isSemiHover, onHoverStart, onHoverEnd, settings, animProps, triggerAnim } = props

  const isBlackKey = React.useMemo(() => [1, 4, 6, 9, 11].includes(freq.noteIndexWithinOctave), [freq])
  const roundedFreq = React.useMemo(() => (Math.round(freq.getHertz() * 100) / 100).toFixed(2), [freq])

  const backgroundColor = React.useMemo(() => {
    const octaveMult = settings.octaveNum / settings.octaveDen
    const lowestHue = 200
    const hueRange = 180
    const hue = lowestHue + (octaveMult - freq.ratio.getValue()) / octaveMult * hueRange
    return `hsl(${hue}, 70%, 65%)`
  }, [freq, settings.octaveDen, settings.octaveNum])

  const [ delays, setDelays ] = React.useState<(() => void)[]>([])
  const [ animate, setAnimate ] = React.useState<TargetAndTransition>()
  React.useEffect(() => {
    delays.forEach(delay => delay())
    const newDelays: (() => void)[] = []

    if (animProps) {
      const animData = makeStringAnimData({ ...animProps, height })
      setAnimate(animData.frames[0].animate)
      animData.frames.forEach(frame => {
        newDelays.push(delay(() => {setAnimate(frame.animate)}, animData.startTime + frame.time))
      })
      newDelays.push(delay(() => setDelays([]), animData.startTime + animData.frames[animData.frames.length-1].time + 1))
    }

    setDelays(newDelays)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerAnim])

  const animateContainer = React.useMemo(() => ({ x, opacity: freq.visible ? 1 : 0, y : freq.visible ? 0 : -16 }), [freq.visible, x])

  const gestureAnimate = React.useMemo(() => {
    if (delays.length) { return {} }
    return {
      y: isSemiHover ? -8 : 0,
      transition: {
        y: { duration: 0.1 }
      }
    }
  }, [delays.length, isSemiHover])

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

  return animate ? (<motion.div onHoverStart={onHoverStart} onHoverEnd={onHoverEnd} initial={false}>
    <motion.div style={stringContainer} animate={animateContainer} initial={false}>
      <motion.div style={stringLabel} animate={{ rotate: -90 }}>{roundedFreq}</motion.div>
      <motion.div
        initial={false}
        layoutId={layoutId}
        style={{
          width: stringWidth,
          backgroundColor: backgroundColor,
          borderRadius: 5,
        }}
        animate={{
          opacity: 1,
          height: height,
          ...animate,
          ...gestureAnimate
        }}
      />
      <AnimatePresence>
        {settings.scaleType === ScaleType.EQUAL && <motion.div style={pianoKeyContainer}>
          <motion.div
            style={pianoKey}
            animate={{ ...animate, height: '48px', width: stringWidth }}
            exit={{ opacity: 0, scale: 0 }}
          />
          {<motion.div style={pianoKeyLabel}>{pianoKeyNoteString}</motion.div>}
        </motion.div>}
      </AnimatePresence>
    </motion.div>
  </motion.div>) : null
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
