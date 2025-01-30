import { motion } from "motion/react"
import React from "react"
import { inputLabel } from "./InputStyle"
import { allScaleTypes, ScaleType } from "../../Models"

export const SelectInput = (props: { label: string, value: ScaleType, onChange: (n: ScaleType) => void }) => {
  const { label, value, onChange } = props
  
  return <motion.div style={selectInput}>
    <motion.div style={inputLabel}>{label}</motion.div>
    <motion.select
      value={value}
      onChange={e => onChange(e.target.value as ScaleType)}
    >
      {allScaleTypes.map(t => {
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