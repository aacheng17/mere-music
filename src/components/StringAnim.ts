import { stringGap, stringWidth } from "../Models"
import { Anim, IAnimData, IAnimProps } from "./animation"

export interface IFromStringProps extends IAnimProps {
  sourceHeight: number,
  height: number
}

export const makeStringAnimData = (props: IAnimProps): IAnimData => {
  switch (props.anim) {
    case Anim.SIMPLE: 
      return makeSimpleAnim(props)
    case Anim.FROM_STRING:
      return makeFromStringAnim(props as IFromStringProps)
  }
}

const makeSimpleAnim = (props: IAnimProps): IAnimData => {
  return {
    startTime: props.startTime,
    duration: props.duration,
    frames: [
      { animate: { opacity: 0 }, time: 0 },
      { animate: { opacity: 1 }, time: props.duration * 0.5 }
    ]
  }
}

const makeFromStringAnim = (props: IFromStringProps): IAnimData => {
  const sourceX = -(stringWidth + stringGap)
  return {
    startTime: props.startTime,
    duration: props.duration,
    frames: [
      { animate: { opacity: 0, x: sourceX, height: props.sourceHeight }, time: 0 },
      { animate: { opacity: 1, x: sourceX, height: props.sourceHeight }, time: 0.25 },
      { animate: { opacity: 1, x: 0, height: props.sourceHeight}, time: props.duration * 0.5 },
      { animate: { opacity: 1, x: 0, height: props.height }, time: props.duration * 0.75 }
    ]
  }
}