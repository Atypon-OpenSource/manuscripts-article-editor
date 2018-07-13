import React from 'react'
import { IconProps } from './types'

const User = (props: IconProps) => (
  <svg
    viewBox="0 0 45 45"
    width={props.size || 45}
    height={props.size || 45}
    className={props.className}
    {...props}
  >
    <defs>
      <ellipse id="user-a" cx={17.5} cy={17} rx={17.5} ry={17} />
    </defs>
    <g
      transform="translate(3 3)"
      fill={props.color || '#fff'}
      fillRule="evenodd"
    >
      <mask id="user-b" fill="#fff">
        <use xlinkHref="#user-a" />
      </mask>
      <ellipse
        stroke="#FFF"
        strokeWidth={2}
        cx={17.5}
        cy={17}
        rx={18.5}
        ry={18}
      />
      <path
        d="M13.874 23.868v2.04c0 .79-.7 1.533-1.557 1.659l-3.496.514c-2.579.38-4.787 2.605-4.932 4.975 0 0 9.325 2.833 13.987 2.833 5.06 0 15.18-2.833 15.18-2.833-.726-2.237-3.395-4.398-5.963-4.827l-3.787-.632c-.856-.143-1.55-.897-1.55-1.69v-2.039c.905-.945 1.174-2.395 1.49-3.985.496.105.643-.493.914-1.651.272-1.158 1.122-2.345.353-2.493a.795.795 0 0 0-.29-.005l.294-3.892c.122-1.625-.653-3.422-1.783-3.856-1.873-.72-2.45-1.1-3.615-1.306-1.165-.206-2.307.082-3.518.435-1.21.353-2.308 1.27-3.212 1.765-.905.495-1.376 1.615-1.275 2.962l.293 3.89a.8.8 0 0 0-.276.007c-.768.148.081 1.335.353 2.493.271 1.158.418 1.756.844 1.674.381 1.57.643 3.018 1.546 3.962z"
        fill="#FFF"
        mask="url(#user-b)"
      />
    </g>
  </svg>
)

export default User
