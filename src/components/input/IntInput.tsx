import { motion } from "motion/react"
import React from "react"
import { inputLabel } from "./InputStyle"

const stringToInt = (s: string) => {
  s = s.trim()
  s = s.replace(/^0+/, "") || "0"
  const n = Math.floor(Number(s))
  return n !== Infinity && String(n) === s && n >= 0 ? n : NaN
}

export const IntInput = (props: {
  label: string,
  value: number,
  onChange: (value: number) => void,
  min: number,
  max: number,
  width?: number
}) => {
  const { label, onChange, min, max } = props
  const width = React.useMemo(() => props.width === undefined ? 48 : props.width, [props.width])

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
    if (e.key === 'Enter' && !invalidDiv) e.currentTarget.blur()
    if (e.key === 'Escape') e.currentTarget.blur()
  }, [invalidDiv])

  const handleBlur = React.useCallback(() => {
      setValue(props.value.toString())
  }, [props.value])

  const intinputInput: React.CSSProperties = React.useMemo(() => ({
    outline: invalidDiv ? '1px solid #FF033E ' : undefined,
    width: `${width}px`
  }), [invalidDiv, width])

  return <motion.div style={intinput}>
    <motion.div style={inputLabel}>{label}</motion.div>
    <motion.input
      type="number"
      value={value}
      style={intinputInput}
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

const intinputInvalid: React.CSSProperties = {
  fontSize: '12px',
  color: '#FF033E'
}
