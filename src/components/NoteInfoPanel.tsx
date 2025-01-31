import { motion } from "motion/react"
import { panel } from "./ComponentStyle"
import { Freq } from "../Models"
import { Info } from "./input/Info"

export const NoteInfoPanel = (props: { primaryNote?: Freq }) => {
  const { primaryNote } = props

  if (!primaryNote) return null

  return <motion.div style={noteInfoPanel}>
    <Info label="Ratio" value={primaryNote.ratio.toString()} />
  </motion.div>
}

const noteInfoPanel: React.CSSProperties = {
  ...panel,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start'
}