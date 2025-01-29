import { motion } from "motion/react"
import { IntInput } from "./IntInput"
import React from "react"

export const RatioInput = (props: {
  label: string,
  a: number,
  b: number,
  onChange: (a: number, b: number) => void
}) => {
  const { label, onChange } = props

  const [ a, setA ] = React.useState(props.a)
  const [ b, setB ] = React.useState(props.b)

  return <motion.div style={ratioinput}>
    <IntInput label={label} value={a} onChange={()=>{}} min={1} max={2} />
    <IntInput label='' value={b} onChange={()=>{}} min={1} max={16} />
  </motion.div>
}

const ratioinput: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row'
}