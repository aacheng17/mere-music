import React from 'react'
import { motion } from "motion/react"
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

  const displayHeight = React.useMemo(() => logView ? logHeight: height, [height, logHeight, logView])
  const backgroundColor = React.useMemo(() => `hsl(${(360 * (2 - freq.ratio)) / 4 + 200}, 70%, 65%)`, [freq])
  const roundedFreq = React.useMemo(() => (Math.round(freq.absoluteFreq * 100) / 100).toFixed(2), [freq.absoluteFreq])

  const animateContainer = React.useMemo(() => ({ x }), [x])

  const animate = React.useMemo(() => {
    return {
      y: isSemiHover ? -8 : 0,
      transition: {
        y: { duration: 0.1 }
      }
    }
  }, [isSemiHover])

  const stringLabel: React.CSSProperties = React.useMemo(() => ({ width: '0px', visibility: isSemiHover ? 'visible' : 'hidden' }), [isSemiHover])
  const pianoKey: React.CSSProperties = React.useMemo(() => ({ backgroundColor: [1, 3, 6, 8, 10].includes(freq.i) ? 'black' : '#fbf7f5' }), [freq.i])

  return (<motion.div style={stringContainer} animate={animateContainer}>
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
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    />
    {settings.scaleType === ScaleType.EQUAL && <motion.div style={pianoKey} animate={{ ...animate, height: '48px', width: stringWidth }}/>}
  </motion.div>)
}

const stringContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}
