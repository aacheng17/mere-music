import React from "react";
import { AnimatePresence, motion } from "motion/react"
import { allScaleTypes, ScaleType } from "../Models";

export interface IStringSettingsModel {
  referenceNote: number,
  notesPerOctave: number,

  scaleType: ScaleType,
  powersOf2Only: boolean,
  highestDenominator: number,
  baseNum: number,
  baseDen: number,

  logView: boolean
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

  const makeHandleToggleBool = React.useCallback((settingName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeSettings({[settingName]: !settings[settingName]})
  },[handleChangeSettings, settings])

  const makeHandleChangeInt = React.useCallback((settingName: string, min: number, max: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value, 10)
    if (isNaN(n) || n < min || n > max) return
    handleChangeSettings({[settingName]: n})
  },[handleChangeSettings])

  // GENERAL
  const generalTab = React.useMemo(() => {
    return <>
      <motion.input type="number" value={settings.referenceNote} onChange={makeHandleChangeInt('referenceNote', 100, 1000)}/>
      <motion.input type="number" value={settings.notesPerOctave} onChange={makeHandleChangeInt('notesPerOctave', 1, 20)}/>
    </>
  }, [makeHandleChangeInt, settings.notesPerOctave, settings.referenceNote])

  // SCALE
  const scaleTab = React.useMemo(() => {
    const scaleTypeSelect = (<motion.select
        value={settings.scaleType}
        onChange={e => handleChangeSettings({scaleType: e.target.value as ScaleType})}
      >
        {allScaleTypes.map(t => {
          return (<motion.option>{t}</motion.option>)
        })}
    </motion.select>)
    
    return <>
      {scaleTypeSelect}
      {
        settings.scaleType === ScaleType.JUST && (<>
          <motion.input type="checkbox" checked={settings.powersOf2Only} onChange={makeHandleToggleBool('powersOf2Only')}/>
          <motion.input type="number" defaultValue={settings.highestDenominator} onChange={makeHandleChangeInt('highestDenominator', 8, 32)}/>
        </>)
      }
      {
        settings.scaleType === ScaleType.PYTHAGOREAN && (<>
          <motion.input type="number" defaultValue={settings.baseNum} onChange={makeHandleChangeInt('baseNum', 1, 20)}/>
          <motion.input type="number" defaultValue={settings.baseDen} onChange={makeHandleChangeInt('baseDen', 100, 1000)}/>
        </>)
      }
    </>
  }, [handleChangeSettings, makeHandleChangeInt, makeHandleToggleBool, settings.baseDen, settings.baseNum, settings.highestDenominator, settings.powersOf2Only, settings.scaleType])


  // APPEARANCE
  const appearanceTab = React.useMemo(() => {
    return <>
      <motion.input type="checkbox" checked={settings.logView} onChange={makeHandleToggleBool('logView')}/>
    </>
  }, [makeHandleToggleBool, settings.logView])

  const tabs = React.useMemo(() => [
    { label: "General", body: generalTab },
    { label: "Scale", body: scaleTab },
    { label: "Appearance", body: appearanceTab }
  ], [appearanceTab, generalTab, scaleTab])

  const [selectedTab, setSelectedTab] = React.useState(0)

  return (<div>
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
    <main style={iconContainer}>
      <AnimatePresence mode="wait">
        <motion.div
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

const iconContainer: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
}