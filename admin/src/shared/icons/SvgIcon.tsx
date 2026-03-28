import { SvgProps } from "@/src/types/shared"
import type { FC } from "react"

const SvgIcon: FC<SvgProps> = (props) => {
  return (
    <svg className={props.className} style={props.style} onClick={props.onClick} id={props.id}>
      <use href={`/assets/svg/icon-sprite.svg#${props.iconId}`}></use>
    </svg>
  )
}

export default SvgIcon
