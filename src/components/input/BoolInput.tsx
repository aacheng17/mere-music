import { motion } from "motion/react"
import React from "react"
import { inputLabel } from "./InputStyle"

export const BoolInput = (props: { label: string, value: boolean, onChange: (n: boolean) => void }) => {
  const { label, value, onChange } = props

  const handleChange = React.useCallback(() => {
    onChange(!value)
  }, [onChange, value])
  
  return <motion.div style={boolInput}>
    <motion.div style={inputLabel}>{label}</motion.div>
    <motion.input
      type="checkbox"
      checked={value}
      onChange={handleChange}
    />
  </motion.div>
}

const boolInput: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
}