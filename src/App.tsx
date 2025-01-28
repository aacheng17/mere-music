import React from 'react'
import './App.css'
import { String } from './components/String'
import { motion } from "motion/react"

enum ScaleType {
  EQUAL = "Equal", JUST = "Just", PYTHAGOREAN = "Pythagorean"
}

const allScaleTypes = [ ScaleType.EQUAL, ScaleType.JUST, ScaleType.PYTHAGOREAN ]

function App() {
  const [notes, setNotes] = React.useState<number[]>([])

  const [ referenceNote, setReferenceNote ] = React.useState(440)
  const octaveMult = 2
  const octavesBelow = 4
  const octavesAbove = 3
  const [ notesPerOctave, setNotesPerOctave ] = React.useState(12)
  const [ scaleType, setScaleType ] = React.useState(ScaleType.EQUAL)

  // JUST

  // PYTHAGOREAN
  const [ baseNum, setBaseNum ] = React.useState(3)
  const [ baseDen, setBaseDen ] = React.useState(2)

  const scaleTypeSelect = React.useMemo(() => {
    return (
      <motion.select
        value={scaleType}
        onChange={e => setScaleType(e.target.value as React.SetStateAction<ScaleType>)}
      >
        {allScaleTypes.map(t => {
          return (<motion.option>{t}</motion.option>)
        })}
      </motion.select>)
  }, [scaleType])

  const setNotesViaRatios = React.useCallback((ratios: number[]) => {
    let octaves = [referenceNote]
    let c = referenceNote
    for (let i=0; i<octavesBelow; i++) {
      c /= octaveMult
      octaves = [ c, ...octaves]
    }
    c = referenceNote
    for (let i=0; i<octavesAbove; i++) {
      c *= octaveMult
      octaves.push(c)
    }

    const result = []
    for (const octave of octaves) {
      result.push(octave)
      for (const ratio of ratios) {
        result.push(octave * ratio)
      }
    }

    setNotes(result)
  },[referenceNote])

  React.useEffect(() => {
    switch (scaleType) {
      case ScaleType.EQUAL: {
        const k = Math.pow(octaveMult, 1/notesPerOctave)
        const ratios = [k]
        let ratio = k
        for (let i=1; i<notesPerOctave-1; i++) {
          ratio *= k
          ratios.push(ratio)
        }
        setNotesViaRatios(ratios)
        break
      }
      case ScaleType.JUST: {
        break
      }
      case ScaleType.PYTHAGOREAN: {
        const ratios = []
        const effectiveNotesPerOctave = baseNum === baseDen ? 1 : notesPerOctave
        for (let i=1; i<effectiveNotesPerOctave; i++) {
          let ratio: number = ratios[ratios.length - 1] ?? 1
          ratio *= baseNum / baseDen
          if (ratio > octaveMult) while (ratio > octaveMult) ratio /= octaveMult
          if (ratio < 1/octaveMult) while (ratio < 1/octaveMult) ratio *= octaveMult
          ratios.push(ratio)
        }
        ratios.sort()
        setNotesViaRatios(ratios)
        break
      }
    }
  },[referenceNote, octavesBelow, octavesAbove, scaleType, notesPerOctave, baseNum, baseDen, setNotesViaRatios, octaveMult])

  const stringElements = React.useMemo(() => {
    return notes.map((n, i) => {
      return (<String layoutId={`string${i}`} freq={n} referenceNote={referenceNote} />)
    })
  }, [notes, referenceNote])

  const makeHandleChangeInt = React.useCallback((setFunc: (n: number) => void, min: number, max: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value, 10)
    if (isNaN(n) || n < min || n > max) return
    setFunc(n)
  },[])

  return (
    <>
      {scaleTypeSelect}
      <motion.input type="number" defaultValue={notesPerOctave} onChange={makeHandleChangeInt(setNotesPerOctave, 1, 20)}/>
      <motion.input type="number" defaultValue={referenceNote} onChange={makeHandleChangeInt(setReferenceNote, 100, 1000)}/>
      {
        scaleType === ScaleType.PYTHAGOREAN && (<>
          <motion.input type="number" defaultValue={baseNum} onChange={makeHandleChangeInt(setBaseNum, 1, 20)}/>
          <motion.input type="number" defaultValue={baseDen} onChange={makeHandleChangeInt(setBaseDen, 100, 1000)}/>
        </>)
      }
      <div className="mm-string-container">
        {stringElements}
      </div>
    </>
  )
}

export default App
