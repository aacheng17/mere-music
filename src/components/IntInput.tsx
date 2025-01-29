import { motion } from "motion/react"
import React from "react"

const stringToInt = (s: string) => {
  s = s.trim()
  s = s.replace(/^0+/, "") || "0"
  const n = Math.floor(Number(s))
  return n !== Infinity && String(n) === s && n >= 0 ? n : NaN
}

export const IntInput = (props: { label: string, value: number, onChange: (value: number) => void, min: number, max: number }) => {
  const { label, onChange, min, max } = props

  const [ value, setValue ] = React.useState(props.value.toString())

  const getInvalidMessage = React.useCallback((n: number) => {
    if (n > max) return `max ${max}`
    if (n < min) return `min ${min}`
    return undefined
  }, [max, min])

  const invalidDiv = React.useMemo(() => {
    const message = getInvalidMessage(stringToInt(value))
    return message ? <motion.div style={intinputInvalid}>{message}</motion.div> : null
  }, [getInvalidMessage, value])

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value
    const n = stringToInt(s)
    if (isNaN(n)) return
    setValue(s)
    if (getInvalidMessage(n)) return
    onChange(n)
  }, [getInvalidMessage, onChange])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !invalidDiv) e.target.blur()
    if (e.key === 'Escape') e.target.blur()
  }, [invalidDiv])

  const handleBlur = React.useCallback(() => {
      setValue(props.value.toString())
  }, [props.value])

  return <motion.div style={intinput}>
    <motion.div style={intinputLabel}>{label}</motion.div>
    <motion.input
      className='mm-intinput-input'
      type="number"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    />
    {invalidDiv}
  </motion.div>
}

const intinput: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
}

const intinputLabel: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '700'
}

const intinputInvalid: React.CSSProperties = {
  fontSize: '12px'
}
