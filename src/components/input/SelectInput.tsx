import { motion } from "motion/react"
import React from "react"
import { inputLabel } from "./InputStyle"

export const SelectInput = <T extends string | number | readonly string[] | undefined>(
  props: { label: string, options: T[], value: T, onChange: (n: T) => void }
) => {
  const { label, options, value, onChange } = props
  
  return <motion.div style={selectInput}>
    <motion.div style={inputLabel}>{label}</motion.div>
    <motion.select
      value={value}
      onChange={e => onChange(e.target.value as T)}
    >
      {options.map(t => {
        return (<motion.option>{t}</motion.option>)
      })}
    </motion.select>
  </motion.div>
}

const selectInput: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
}