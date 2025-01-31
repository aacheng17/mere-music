import { motion } from "motion/react"
import { inputLabel } from "./InputStyle"

export const Info = (props: { label: string, value: string }) => {
  const { label, value } = props
  
  return <motion.div style={boolInput}>
    <motion.div style={inputLabel}>{label}</motion.div>
    <motion.div>{value}</motion.div>
  </motion.div>
}

const boolInput: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
}