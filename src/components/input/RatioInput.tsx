import { motion } from "motion/react"
import { IntInput } from "./IntInput"
import React from "react"
import { inputLabel } from "./InputStyle"

export const RatioInput = (props: {
  label: string,
  a: number,
  b: number,
  onChange: (a: number, b: number) => void
}) => {
  const { label, a, b, onChange } = props

  return <motion.div style={ratioinput}>
    <motion.div style={inputLabel}>{label}</motion.div>
    <motion.div style={ratioinputInputs}>
      <IntInput label='' value={a} onChange={(n)=>{onChange(n, b)}} min={1} max={16} width={30} />
      <motion.div>/</motion.div>
      <IntInput label='' value={b} onChange={(n)=>{onChange(a, n)}} min={1} max={16} width={30} />
    </motion.div>
  </motion.div>
}

const ratioinput: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
}

const ratioinputInputs: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '4px'
}