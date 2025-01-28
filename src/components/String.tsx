import React from 'react'
import { motion } from "motion/react"
import './String.css'

export const String = (props: {
  layoutId: string,
  freq: number,
  referenceNote: number,
  logView: boolean,
  hoveredFreq?: number,
  onHoverStart?: ()=>void,
  onHoverEnd?: ()=>void;
}) => {
  const { layoutId, freq, referenceNote, logView, hoveredFreq, onHoverStart, onHoverEnd } = props

  const height = React.useMemo(() => logView ? Math.log(freq)*100 : freq, [freq, logView])

  const hoverScaleY = React.useMemo(() => {
    return 15 / height + 1
  }, [height])

  const backgroundColor = React.useMemo(() => {
    if (referenceNote === freq) return "#3700b3"
    if (Number.isInteger(referenceNote/freq) || Number.isInteger(freq/referenceNote)) return "#6200EE"
    return "#03dac6"
  }, [freq, referenceNote])

  const isSemiHover = React.useMemo(() => {
    if (!hoveredFreq) return false
    if (Number.isInteger(hoveredFreq/freq) || Number.isInteger(freq/hoveredFreq)) return true
  }, [freq, hoveredFreq])

  const className = React.useMemo(() => {
    let s = 'mm-string-container'
    if (isSemiHover) s += ' semi-hover'
    return s
  }, [isSemiHover])

  const animate = React.useMemo(() => {
    if (isSemiHover) return { scaleY: hoverScaleY, scaleX: 1.2 }
    return {}
  },[hoverScaleY, isSemiHover])

  return (<div className={className}>
    <motion.div className='mm-string-label' animate={{ rotate: -90 }}>{freq}</motion.div>
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
  </div>)
}