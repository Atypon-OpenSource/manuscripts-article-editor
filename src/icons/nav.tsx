import React from 'react'
import { IconProps } from './types'

const Nav = (props: IconProps) => (
  <svg
    width={props.size || 38}
    height={props.size || 38}
    viewBox={'0 0 38 38'}
    {...props}
  >
    <defs>
      <path
        d="M24.56 9.487a1.013 1.013 0 0 1 .44.834v7.88a4.09 4.09 0 0 1-1.69 3.31 1.064 1.064 0 0 1-1.688-.861v-6.624l-1.61.89a10.45 10.45 0 0 1-9.808.16l-1.942-.991v5.001a1.075 1.075 0 0 1-1.63.92A3.381 3.381 0 0 1 5 17.113v-6.86a.988.988 0 0 1 0-.057A1.196 1.196 0 0 1 6.777 9.15l3.494 1.938a9.984 9.984 0 0 0 9.741-.032l3.158-1.778a1.143 1.143 0 0 1 1.39.209z"
        id="nav-a"
      />
      <filter
        x="-32.5%"
        y="-51.1%"
        width="165%"
        height="202.2%"
        filterUnits="objectBoundingBox"
        id="nav-b"
      >
        <feGaussianBlur
          stdDeviation={3}
          in="SourceAlpha"
          result="shadowBlurInner1"
        />
        <feOffset
          dx={5}
          dy={7}
          in="shadowBlurInner1"
          result="shadowOffsetInner1"
        />
        <feComposite
          in="shadowOffsetInner1"
          in2="SourceAlpha"
          operator="arithmetic"
          k2={-1}
          k3={1}
          result="shadowInnerInner1"
        />
        <feColorMatrix
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          in="shadowInnerInner1"
        />
      </filter>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        d="M23.5 4.278l6 3.464a9 9 0 0 1 4.5 7.794v6.928a9 9 0 0 1-4.5 7.794l-6 3.464a9 9 0 0 1-9 0l-6-3.464A9 9 0 0 1 4 22.464v-6.928a9 9 0 0 1 4.5-7.794l6-3.464a9 9 0 0 1 9 0z"
        fill={props.color || '#cde0f5'}
      />
      <g transform="translate(4 4)">
        <use fill="#FFF" xlinkHref="#nav-a" />
        <use fill="#000" filter="url(#nav-b)" xlinkHref="#nav-a" />
      </g>
    </g>
  </svg>
)

export default Nav
