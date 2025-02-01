import React from 'react'
import './App.css'
import { IStringSettingsModel, StringSettings } from './components/StringSettings'
import { Freq, Octaves, ScaleType } from './Models'
import { Strings } from './components/Strings'
import { motion } from 'motion/react'

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
    octaves: Octaves.ONE,
    notesPerOctave: 12,
    octaveNum: 2,
    octaveDen: 1,

    scaleType: ScaleType.EQUAL,
    powersOf2Only: true,
    highestDenominator: 16,
    baseNum: 3,
    baseDen: 2,

    logView: false,
    evenXSpacing: false
  })

  const octaveMult = React.useMemo(() => stringSettings.octaveNum / stringSettings.octaveDen, [stringSettings.octaveDen, stringSettings.octaveNum])
  const [ octavesBelow, octavesAbove ] = React.useMemo(() => {
    switch (stringSettings.octaves) {
      case Octaves.ONE:
        return [0, 1]
      case Octaves.TWO:
        return [1, 1]
      case Octaves.PIANO:
        return [4, 3]
    }
  }, [stringSettings.octaves])

  const getFreqsViaRatios = React.useCallback((ratios: number[]) => {
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

    const freqs: Freq[] = []
    octaves.forEach((octave, octaveI) => {
      freqs.push(new Freq(octave, octaveI, 0, 1))
      let i = 1
      for (const ratio of ratios) {
        freqs.push(new Freq(octave, octaveI, i, ratio))
        i++
      }
    })

    return freqs
  }, [octaveMult, octavesAbove, octavesBelow, stringSettings.referenceNote])

  const getEqualTemperamentRatios = React.useCallback(() => {
    const k = Math.pow(octaveMult, 1/stringSettings.notesPerOctave)
    const ratios = [k]
    let ratio = k
    for (let i=1; i<stringSettings.notesPerOctave-1; i++) {
      ratio *= k
      ratios.push(ratio)
    }
    return ratios
  }, [octaveMult, stringSettings.notesPerOctave])

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

  const freqs = React.useMemo(() => {
    let ratios: number[] = []
    switch (stringSettings.scaleType) {
      case ScaleType.EQUAL: {
        ratios = getEqualTemperamentRatios()
        break
      }
      case ScaleType.JUST: {
        ratios = getJustIntonationRatios()
        break
      }
      case ScaleType.PYTHAGOREAN: {
        const effectiveNotesPerOctave = stringSettings.baseNum === stringSettings.baseDen ? 1 : stringSettings.notesPerOctave
        for (let i=1; i<effectiveNotesPerOctave; i++) {
          let ratio: number = ratios[ratios.length - 1] ?? 1
          ratio *= stringSettings.baseNum / stringSettings.baseDen
          if (ratio > octaveMult) while (ratio > octaveMult) ratio /= octaveMult
          if (ratio < 1/octaveMult) while (ratio < 1/octaveMult) ratio *= octaveMult
          ratios.push(ratio)
        }
        ratios.sort()
        break
      }
    }

    return getFreqsViaRatios(ratios)
  }, [getEqualTemperamentRatios, getFreqsViaRatios, getJustIntonationRatios, octaveMult, stringSettings.baseDen, stringSettings.baseNum, stringSettings.notesPerOctave, stringSettings.scaleType])

  return (
    <motion.div style={app}>
      <StringSettings settings={stringSettings} onChangeSettings={(settings: IStringSettingsModel) => setStringSettings(settings)} />
      <Strings freqs={freqs} settings={stringSettings} />
    </motion.div>
  )
}

const app: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
}

export default App
