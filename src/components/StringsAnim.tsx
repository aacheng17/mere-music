import { Anim, IAnimProps } from "./animation"

export const makeStringAnimProps = (props: IAnimProps, isFirst: boolean) => {
  switch (props.anim) {
    case Anim.SIMPLE:
      return props 
    case Anim.FROM_STRING:
      return isFirst ? { ...props, anim: Anim.SIMPLE } : props
  }
}