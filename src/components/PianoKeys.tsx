import { motion } from "motion/react"
import { distanceBetweenStringCenters, Freq, stringGap, stringWidth } from "../Models"
import React from "react"

export const PianoKeys = (props: { freqs: Freq[] }) => {
  const { freqs } = props

  const keys = React.useMemo(() => {
    return freqs.map((_, i) => <PianoKey degree={i % 12} />)
  }, [freqs])

  const container: React.CSSProperties = React.useMemo(() => ({
    width: `${distanceBetweenStringCenters * (freqs.length - 1)}px`,
    height: '48px',
    display: 'flex',
    gap: `${stringGap}px`,
    margin: 'auto'
  }), [freqs])

  return <motion.div style={container}>
    {keys}
  </motion.div>
}

export const PianoKey = (props: { degree: number }) => {
  const { degree } = props

  if (degree === 0 || degree === 5) {
    return <motion.div style={whiteKeyContainer}><motion.div style={whiteKey0a}/><motion.div style={whiteKey0b}/></motion.div>
  } else if (degree === 1 || degree === 3 || degree === 6 || degree === 8 || degree === 10) {
    return <motion.div style={blackKey}></motion.div>
  } else if (degree === 2 || degree === 7 || degree === 9) {
    return <motion.div style={whiteKeyContainer}><motion.div style={whiteKey0a}/><motion.div style={whiteKey0b}/><motion.div style={whiteKey0c}/></motion.div>
  } else {
    return <motion.div style={whiteKeyContainer}><motion.div style={whiteKey0a}/><motion.div style={whiteKey0c}/></motion.div>
  }
}

const keyHeight = 64
const blackKeyHeight = keyHeight * 3 / 5
const whiteKeyHeight = keyHeight - blackKeyHeight - stringGap

const key: React.CSSProperties = {
  width: '100%',
  borderRadius: '2px'
}

const blackKey: React.CSSProperties = {
  ...key,
  height: `${blackKeyHeight}px`,
  backgroundColor: 'black'
}

const whiteKeyContainer: React.CSSProperties = {
  ...key,
  height: `${keyHeight}px`,
  position: 'relative'
}

const whiteKey0a: React.CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: '#fbf7f5'
}

const whiteKey0b: React.CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: `${whiteKeyHeight}px`,
  backgroundColor: '#fbf7f5',
  top: `${keyHeight - whiteKeyHeight}px`,
  left: `${distanceBetweenStringCenters / 2}px`,
}

const whiteKey0c: React.CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: `${whiteKeyHeight}px`,
  backgroundColor: '#fbf7f5',
  top: `${keyHeight - whiteKeyHeight}px`,
  right: `${distanceBetweenStringCenters / 2}px`
}
