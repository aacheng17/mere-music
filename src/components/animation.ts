import { TargetAndTransition } from "motion/react"

export enum Anim {
  SIMPLE, FROM_STRING
}

export interface IAnimProps {
  anim: Anim
  startTime: number
  duration: number
}

export interface IAnimFrame {
  animate: TargetAndTransition,
  time: number
}

export interface IAnimData {
  startTime: number
  duration: number
  frames: IAnimFrame[]
}
