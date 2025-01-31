import { motion } from "motion/react"
import { panel } from "./ComponentStyle"
import { Freq } from "../Models"
import { Info } from "./input/Info"

export const NoteInfoPanel = (props: { primaryNote?: Freq }) => {
  const { primaryNote } = props

  return <motion.div style={noteInfoPanel}>
    {primaryNote && <Info label="Ratio" value={primaryNote.ratio.toString()} />}
  </motion.div>
}

const noteInfoPanel: React.CSSProperties = {
  ...panel,
  height: '200px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start'
}