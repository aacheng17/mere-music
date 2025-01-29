import React from 'react'
import { motion } from "motion/react"
import { Freq } from '../Models';

export const String = (props: {
  layoutId: string,
  freq: Freq,
  logView: boolean,
  isSemiHover: boolean,
  onHoverStart?: ()=>void,
  onHoverEnd?: ()=>void
}) => {
  const { layoutId, freq, logView, isSemiHover, onHoverStart, onHoverEnd } = props

  const height: number = React.useMemo(() => logView ? Math.log(freq.absoluteFreq)*100 : freq.absoluteFreq, [freq.absoluteFreq, logView])
  const hoverScaleY = React.useMemo(() => 15 / height + 1, [height])
  const backgroundColor = React.useMemo(() => `hsl(${(360 * (2 - freq.ratio)) / 4 + 200}, 70%, 65%)`, [freq])
  const roundedFreq = React.useMemo(() => (Math.round(freq.absoluteFreq * 100) / 100).toFixed(2), [freq.absoluteFreq])

  const animate = React.useMemo(() => {
    if (isSemiHover) return { scaleY: hoverScaleY, scaleX: 1.2 }
    return { scaleY: 1, scaleX: 1 }
  }, [hoverScaleY, isSemiHover])

  const stringLabel: React.CSSProperties = React.useMemo(() => {
    return { width: '0px', visibility: isSemiHover ? 'visible' : 'hidden' }
  }, [isSemiHover])

  return (
    <motion.div style={stringContainer}>
    <motion.div style={stringLabel} animate={{ rotate: -90 }}>{roundedFreq}</motion.div>
    <motion.div
      layoutId={layoutId}
      style={{
        width: 8,
        backgroundColor: backgroundColor,
        borderRadius: 5,
      }}
      animate={{
        ...animate,
        height: height,
        transition: {
          height: { duration: 0.3, type: "ease" },
          scaleY: { duration: 0.04, type: "ease" },
          scaleX: { duration: 0.04, type: "ease" }
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
