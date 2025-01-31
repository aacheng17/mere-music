import React from 'react'
import { motion } from "motion/react"
import { Freq, stringWidth } from '../Models';

export interface IStringProps {
  layoutId: string,
  freq: Freq,
  height: number,
  logHeight: number,
  x: number,
  logView: boolean,
  isSemiHover: boolean,
  onHoverStart?: ()=>void,
  onHoverEnd?: ()=>void
}

export const String = (props: IStringProps) => {
  const { layoutId, freq, height, logHeight, x, logView, isSemiHover, onHoverStart, onHoverEnd } = props

  const displayHeight = React.useMemo(() => logView ? logHeight: height, [height, logHeight, logView])
  const backgroundColor = React.useMemo(() => `hsl(${(360 * (2 - freq.ratio)) / 4 + 200}, 70%, 65%)`, [freq])
  const roundedFreq = React.useMemo(() => (Math.round(freq.absoluteFreq * 100) / 100).toFixed(2), [freq.absoluteFreq])

  const animateContainer = React.useMemo(() => ({ x }), [x])

  const animate = React.useMemo(() => {
    if (isSemiHover) return { y: 8 }
    return { y: 0 }
  }, [isSemiHover])

  const stringLabel: React.CSSProperties = React.useMemo(() => {
    return { width: '0px', visibility: isSemiHover ? 'visible' : 'hidden' }
  }, [isSemiHover])

  const pianoKey = React.useMemo(() => {

  },[])

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
        height: displayHeight,
        transition: {
          y: { duration: 0.1 }
        }
      }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    />
  </motion.div>)
}

const stringContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}
