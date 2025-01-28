import React from 'react'
import { motion } from "motion/react"

export const String = (props: { layoutId: string, freq: number, referenceNote: number }) => {
  const { layoutId, freq, referenceNote } = props

  const hoverScaleY = React.useMemo(() => {
    return 15 / freq + 1
  }, [freq])

  return (<motion.div
    layoutId={layoutId}
    style={{
      width: 10,
      height: freq,
      backgroundColor: referenceNote === freq ? "#ff8800" : "#ff0088",
      borderRadius: 5,
    }}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    whileHover={{ scaleY: hoverScaleY, scaleX: 1.2}}
    transition={{ duration: 0.1 }}
  />)
}