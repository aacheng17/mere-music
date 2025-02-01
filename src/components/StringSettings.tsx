import React from "react";
import { AnimatePresence, motion } from "motion/react"
import { allOctaves, allScaleTypes, Octaves, ScaleType } from "../Models";
import { IntInput } from "./input/IntInput";
import { BoolInput } from "./input/BoolInput";
import { RatioInput } from "./input/RatioInput";
import { SelectInput } from "./input/SelectInput";
import { panel } from "./ComponentStyle";

export interface IStringSettingsModel {
  referenceNote: number,
  octaves: Octaves,
  notesPerOctave: number,
  octaveNum: number,
  octaveDen: number,

  scaleType: ScaleType,
  powersOf2Only: boolean,
  highestDenominator: number,
  baseNum: number,
  baseDen: number,

  logView: boolean,
  evenXSpacing: boolean
}

export const StringSettings = (props: {
  settings: IStringSettingsModel,
  onChangeSettings: (settings: IStringSettingsModel) => void
}) => {
  const { settings, onChangeSettings } = props

  const handleChangeSettings = React.useCallback((newSettings: Partial<IStringSettingsModel>) => {
    onChangeSettings({
      ...settings,
      ...newSettings
    })
  }, [onChangeSettings, settings])

  // GENERAL
  const generalTab = React.useMemo(() => {
    return <motion.div style={tabBody}>
      <motion.div style={settingsRow}>
        <IntInput label="Reference frequency" value={settings.referenceNote} onChange={(n) => handleChangeSettings({ referenceNote: n })} min={100} max={1000} />
        <SelectInput label="Octaves" options={allOctaves} value={settings.octaves} onChange={(n) => handleChangeSettings({ octaves: n })} />
        <IntInput label="Notes per octave" value={settings.notesPerOctave} onChange={(n) => handleChangeSettings({ notesPerOctave: n })} min={1} max={20} />
        <RatioInput label="Octave ratio" a={settings.octaveNum} b={settings.octaveDen} onChange={(a, b) => handleChangeSettings({ octaveNum: a, octaveDen: b })} />
      </motion.div>
    </motion.div>
  }, [handleChangeSettings, settings.notesPerOctave, settings.octaveDen, settings.octaveNum, settings.octaves, settings.referenceNote])

  // SCALE
  const scaleTab = React.useMemo(() => {
    return <motion.div style={tabBody}>
      <SelectInput label="Scale type" options={allScaleTypes} value={settings.scaleType} onChange={(n) => handleChangeSettings({ scaleType: n})} />
      <motion.div style={settingsRow}>
        {
          settings.scaleType === ScaleType.JUST && (<>
            <BoolInput label="Power of 2 only" value={settings.powersOf2Only} onChange={(n) => handleChangeSettings({ powersOf2Only: n})} />
            <IntInput label="Highest denominator" value={settings.highestDenominator} onChange={(n) => handleChangeSettings({ highestDenominator: n })} min={8} max={64} />
          </>)
        }
        {
          settings.scaleType === ScaleType.PYTHAGOREAN && (<>
            <RatioInput label="Reference ratio" a={settings.baseNum} b={settings.baseDen} onChange={(a, b) => handleChangeSettings({ baseNum: a, baseDen: b })} />
          </>)
        }
      </motion.div>
    </motion.div>
  }, [handleChangeSettings, settings.baseDen, settings.baseNum, settings.highestDenominator, settings.powersOf2Only, settings.scaleType])


  // APPEARANCE
  const appearanceTab = React.useMemo(() => {
    return <motion.div style={tabBody}>
      <motion.div style={settingsRow}>
        <BoolInput label="Log view" value={settings.logView} onChange={(n) => handleChangeSettings({ logView: n})} />
        <BoolInput label="Even x-axis spacing" value={settings.evenXSpacing} onChange={(n) => handleChangeSettings({ evenXSpacing: n})} />
      </motion.div>
    </motion.div>
  }, [handleChangeSettings, settings.evenXSpacing, settings.logView])

  const tabs = React.useMemo(() => [
    { label: "General", body: generalTab },
    { label: "Scale", body: scaleTab },
    { label: "Appearance", body: appearanceTab }
  ], [appearanceTab, generalTab, scaleTab])

  const [selectedTab, setSelectedTab] = React.useState(0)

  return (<div style={panel}>
    <nav style={nav}>
      <ul style={tabsContainer}>
        {tabs.map((item, i) => (
          <motion.li
            key={item.label}
            initial={false}
            animate={{
              backgroundColor:
                i === selectedTab ? "#eee" : "#eee0",
            }}
            style={tab}
            onClick={() => setSelectedTab(i)}
          >
            {`${item.label}`}
            {i === selectedTab ? (
              <motion.div
                style={underline}
                layoutId="underline"
                id="underline"
              />
            ) : null}
          </motion.li>
          ))}
      </ul>
    </nav>
    <main style={bodyContainer}>
      <AnimatePresence mode="wait">
        <motion.div
          style={{ width: "100%" }}
          key={tabs[selectedTab].label}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {tabs[selectedTab].body}
        </motion.div>
      </AnimatePresence>
    </main>
  </div>)
}

const nav: React.CSSProperties = {
  background: "#fdfdfd",
  padding: "5px 5px 0",
  borderRadius: "10px",
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderBottom: "1px solid #eeeeee",
  height: 44,
}

const tabsStyles: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  fontWeight: 500,
  fontSize: 14,
}

const tabsContainer: React.CSSProperties = {
  ...tabsStyles,
  display: "flex",
  width: "100%",
}

const tab: React.CSSProperties = {
  ...tabsStyles,
  borderRadius: 5,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  width: "100%",
  padding: "10px 15px",
  position: "relative",
  background: "white",
  cursor: "pointer",
  height: 24,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flex: 1,
  minWidth: 0,
  userSelect: "none",
  color: "#0f1115",
}

const underline: React.CSSProperties = {
  position: "absolute",
  bottom: -2,
  left: 0,
  right: 0,
  height: 2,
  backgroundColor: "aqua"
}

const bodyContainer: React.CSSProperties = {
  ...panel,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flex: 1
}

const tabBody: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px"
}

const settingsRow: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  gap: "16px"
}