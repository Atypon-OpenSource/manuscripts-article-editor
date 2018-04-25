import React from 'react'
import { IconProps } from '../index'

const MarkdownFile = (props: IconProps) => (
  <svg width={29} height={32} viewBox="0 0 29 32" {...props}>
    <title>{props.title}</title>
    <g fill="none" fillRule="evenodd" opacity={0.327}>
      <path
        d="M26.047 11.731h-.725V8.255c-.007-.204-.052-.34-.147-.447l-5.821-6.607A.623.623 0 0 0 18.908 1H4.601c-.653 0-1.184.528-1.184 1.176v9.555h-.725c-.934 0-1.692.752-1.692 1.681v8.744c0 .928.758 1.682 1.692 1.682h.725v5.986c0 .648.53 1.176 1.184 1.176h19.537c.653 0 1.184-.528 1.184-1.176v-5.986h.725c.934 0 1.692-.753 1.692-1.682v-8.744c0-.929-.758-1.681-1.692-1.681zM4.601 2.176h13.715v6.02a.59.59 0 0 0 .592.588h5.23v2.947H4.601V2.176zm14.207 15.13c0 2.675-1.632 4.296-4.032 4.296-2.435 0-3.86-1.827-3.86-4.15 0-2.445 1.57-4.272 3.994-4.272 2.52 0 3.898 1.875 3.898 4.126zm5.33 12.199H4.601v-5.667h19.537v5.667z"
        fill="#97A2B1"
        fillRule="nonzero"
      />
      <path fill="#97A2B1" d="M9 13h12v9H9z" />
      <text
        fontFamily="Arial-Black, Arial Black"
        fontSize={12}
        fontWeight={700}
        fill="#F1F5FF"
        transform="translate(1 1)"
      >
        <tspan x={3.17} y={21}>
          MD
        </tspan>
      </text>
    </g>
  </svg>
)

export default MarkdownFile
