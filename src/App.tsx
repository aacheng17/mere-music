import React from 'react'
import './App.css'
import { String } from './components/String'
import { motion } from "motion/react"

enum ScaleType {
  EQUAL = "Equal", JUST = "Just", PYTHAGOREAN = "Pythagorean"
}

const allScaleTypes = [ ScaleType.EQUAL, ScaleType.JUST, ScaleType.PYTHAGOREAN ]

const getGcd = (a:number,b:number): number => {
  return b ? getGcd(b, a%b) : a;
};

const reduceFraction = (n:number, d:number) => {
  const x = getGcd(n,d);
  return [n/x, d/x];
}
const getId = (x:number[]) => `${x[0]},${x[1]}`
const fromId = (x:string) => x.split(',').map(s => parseInt(s, 10))

export class Freq {
  n?: number
  d?: number
  ratio: number
  
  constructor(a: number, b?: number) {
    if (b === undefined) {
      this.ratio = a
    } else {
      this.n = a
      this.d = b
      this.ratio = this.n / this.d
    }
  }
}

function App() {
  const [notes, setNotes] = React.useState<number[]>([])

  const [ logView, setLogView ] = React.useState(false)
  const [ referenceNote, setReferenceNote ] = React.useState(440)
  const octaveMult = 2
  const octavesBelow = 4
  const octavesAbove = 3
  const [ notesPerOctave, setNotesPerOctave ] = React.useState(12)
  const [ scaleType, setScaleType ] = React.useState(ScaleType.EQUAL)

  // JUST
  const [ powersOf2Only, setPowersOf2Only ] = React.useState(true)
  const [ highestDenominator, setHighestDenominator ] = React.useState(16)

  // PYTHAGOREAN
  const [ baseNum, setBaseNum ] = React.useState(3)
  const [ baseDen, setBaseDen ] = React.useState(2)

  const [ hoveredFreq, setHoveredFreq ] = React.useState<number>()

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

  const getEqualTemperamentRatios = React.useCallback(() => {
    const k = Math.pow(octaveMult, 1/notesPerOctave)
    const ratios = [k]
    let ratio = k
    for (let i=1; i<notesPerOctave-1; i++) {
      ratio *= k
      ratios.push(ratio)
    }
    return ratios
  },[notesPerOctave])

  const getJustIntonationRatios = React.useCallback(() => {
    const possibleRatios = new Set<string>()
    const ratios = []
    let n = 2, d = 1;
    while (d <= highestDenominator) {
      const r = getId(reduceFraction(n, d))
      if (!possibleRatios.has(r)) possibleRatios.add(r)
      if (n / d >= 2) {
        if (powersOf2Only) {
          d*=2
        } else { d+=1 }
        n = d+1
      } else {
        n++
      }
    }
    
    for (const equalRatio of getEqualTemperamentRatios()) {
      let lowestDiff = 1
      let lowestId: string = ''
      for (const x of possibleRatios) {
        const diff = Math.abs(fromId(x)[0] / fromId(x)[1] - equalRatio)
        if (diff < lowestDiff) {
          lowestDiff = diff
          lowestId = x
        }
      }
      ratios.push(fromId(lowestId)[0] / fromId(lowestId)[1])
    }

    return ratios
  }, [getEqualTemperamentRatios, highestDenominator, powersOf2Only])

  React.useEffect(() => {
    switch (scaleType) {
      case ScaleType.EQUAL: {
        setNotesViaRatios(getEqualTemperamentRatios())
        break
      }
      case ScaleType.JUST: {
        setNotesViaRatios(getJustIntonationRatios())
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
  },[referenceNote, octavesBelow, octavesAbove, scaleType, notesPerOctave, baseNum, baseDen, setNotesViaRatios, octaveMult, getEqualTemperamentRatios, highestDenominator, powersOf2Only, getJustIntonationRatios])

  const stringElements = React.useMemo(() => {
    return notes.map((n, i) => {
      return (<String
        layoutId={`string${i}`}
        freq={n}
        referenceNote={referenceNote}
        logView={logView}
        hoveredFreq={hoveredFreq}
        onHoverStart={() => setHoveredFreq(n)}
        onHoverEnd={() => setHoveredFreq(undefined)}
      />)
    })
  }, [hoveredFreq, logView, notes, referenceNote])

  const makeHandleChangeInt = React.useCallback((setFunc: (n: number) => void, min: number, max: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value, 10)
    if (isNaN(n) || n < min || n > max) return
    setFunc(n)
  },[])

  return (
    <>
      <motion.input type="checkbox" checked={logView} onChange={() => setLogView(!logView)}/>
      {scaleTypeSelect}
      <motion.input type="number" defaultValue={notesPerOctave} onChange={makeHandleChangeInt(setNotesPerOctave, 1, 20)}/>
      <motion.input type="number" defaultValue={referenceNote} onChange={makeHandleChangeInt(setReferenceNote, 100, 1000)}/>
      {
        scaleType === ScaleType.JUST && (<>
          <motion.input type="checkbox" checked={powersOf2Only} onChange={() => setPowersOf2Only(!powersOf2Only)}/>
          <motion.input type="number" defaultValue={highestDenominator} onChange={makeHandleChangeInt(setHighestDenominator, 8, 32)}/>
        </>)
      }
      {
        scaleType === ScaleType.PYTHAGOREAN && (<>
          <motion.input type="number" defaultValue={baseNum} onChange={makeHandleChangeInt(setBaseNum, 1, 20)}/>
          <motion.input type="number" defaultValue={baseDen} onChange={makeHandleChangeInt(setBaseDen, 100, 1000)}/>
        </>)
      }
      <div className="mm-strings-container">
        {stringElements}
      </div>
    </>
  )
}

export default App
