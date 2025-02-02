import React from 'react'
import './App.css'
import { IStringSettingsModel, StringSettings } from './components/StringSettings'
import { Octaves, ScaleType } from './Models'
import { motion } from 'motion/react'
import { EqualConstruction } from './components/animation/EqualConstruction'
import { PythagoreanConstruction } from './components/animation/PythagoreanConstruction'
import { JustConstruction } from './components/animation/JustConstruction'

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

  return (
    <motion.div style={app}>
      <StringSettings settings={stringSettings} onChangeSettings={(settings: IStringSettingsModel) => setStringSettings(settings)} />
      {stringSettings.scaleType === ScaleType.EQUAL && <EqualConstruction settings={stringSettings} />}
      {stringSettings.scaleType === ScaleType.PYTHAGOREAN && <PythagoreanConstruction settings={stringSettings} />}
      {stringSettings.scaleType === ScaleType.JUST && <JustConstruction settings={stringSettings} />}
    </motion.div>
  )
}

const app: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
}

export default App
