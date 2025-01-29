import React from 'react'
import './App.css'
import { String } from './components/String'
import { motion } from "motion/react"
import { IStringSettingsModel, StringSettings } from './components/StringSettings'
import { Freq, ScaleType } from './Models'

const getGcd = (a:number,b:number): number => {
  return b ? getGcd(b, a%b) : a;
};

const reduceFraction = (n:number, d:number) => {
  const x = getGcd(n,d);
  return [n/x, d/x];
}
const getId = (x:number[]) => `${x[0]},${x[1]}`
const fromId = (x:string) => x.split(',').map(s => parseInt(s, 10))

function App() {
  const [ stringSettings, setStringSettings ] = React.useState<IStringSettingsModel>({
    referenceNote: 440,
    notesPerOctave: 12,

    scaleType: ScaleType.EQUAL,
    powersOf2Only: true,
    highestDenominator: 16,
    baseNum: 3,
    baseDen: 2,

    logView: false
  })
  const [notes, setNotes] = React.useState<Freq[]>([])

  const octaveMult = 2
  const octavesBelow = 4
  const octavesAbove = 3

  const [ hoveredStringIndex, setHoveredStringIndex ] = React.useState<number>()

  const setNotesViaRatios = React.useCallback((ratios: number[]) => {
    let octaves = [stringSettings.referenceNote]
    let c = stringSettings.referenceNote
    for (let i=0; i<octavesBelow; i++) {
      c /= octaveMult
      octaves = [ c, ...octaves]
    }
    c = stringSettings.referenceNote
    for (let i=0; i<octavesAbove; i++) {
      c *= octaveMult
      octaves.push(c)
    }

    const freqs = []
    for (const octave of octaves) {
      freqs.push(new Freq(octave, 1))
      for (const ratio of ratios) {
        freqs.push(new Freq(octave, ratio))
      }
    }

    setNotes(freqs)
  },[stringSettings.referenceNote])

  const getEqualTemperamentRatios = React.useCallback(() => {
    const k = Math.pow(octaveMult, 1/stringSettings.notesPerOctave)
    const ratios = [k]
    let ratio = k
    for (let i=1; i<stringSettings.notesPerOctave-1; i++) {
      ratio *= k
      ratios.push(ratio)
    }
    return ratios
  },[stringSettings.notesPerOctave])

  const getJustIntonationRatios = React.useCallback(() => {
    const possibleRatios = new Set<string>()
    const ratios = []
    let n = 2, d = 1;
    while (d <= stringSettings.highestDenominator) {
      const r = getId(reduceFraction(n, d))
      if (!possibleRatios.has(r)) possibleRatios.add(r)
      if (n / d >= 2) {
        if (stringSettings.powersOf2Only) {
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
  }, [getEqualTemperamentRatios, stringSettings.highestDenominator, stringSettings.powersOf2Only])

  React.useEffect(() => {
    switch (stringSettings.scaleType) {
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
        const effectiveNotesPerOctave = stringSettings.baseNum === stringSettings.baseDen ? 1 : stringSettings.notesPerOctave
        for (let i=1; i<effectiveNotesPerOctave; i++) {
          let ratio: number = ratios[ratios.length - 1] ?? 1
          ratio *= stringSettings.baseNum / stringSettings.baseDen
          if (ratio > octaveMult) while (ratio > octaveMult) ratio /= octaveMult
          if (ratio < 1/octaveMult) while (ratio < 1/octaveMult) ratio *= octaveMult
          ratios.push(ratio)
        }
        ratios.sort()
        setNotesViaRatios(ratios)
        break
      }
    }
  }, [getEqualTemperamentRatios, getJustIntonationRatios, setNotesViaRatios, stringSettings.baseDen, stringSettings.baseNum, stringSettings.notesPerOctave, stringSettings.scaleType])

  const stringElements = React.useMemo(() => {
    return notes.map((n, i) => {
      return (<String
        layoutId={`string${i}`}
        freq={n}
        isSemiHover={hoveredStringIndex && (i % stringSettings.notesPerOctave === hoveredStringIndex % stringSettings.notesPerOctave) || false}
        logView={stringSettings.logView}
        onHoverStart={() => setHoveredStringIndex(i)}
        onHoverEnd={() => setHoveredStringIndex(undefined)}
      />)
    })
  }, [notes, hoveredStringIndex, stringSettings.notesPerOctave, stringSettings.logView])

  return (
    <>
      <StringSettings settings={stringSettings} onChangeSettings={(settings: IStringSettingsModel) => setStringSettings(settings)} />
      <motion.div style={stringsContainer}>
        {stringElements}
      </motion.div>
    </>
  )
}

const stringsContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-between'
}

export default App
