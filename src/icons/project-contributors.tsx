import React from 'react'
import { IconProps } from './types'

const ProjectContributors = (props: IconProps) => (
  <svg width={props.size || 24} height={props.size || 24} {...props}>
    <defs>
      <circle id="project-contributors-a" cx={9} cy={9} r={9} />
    </defs>
    <g transform="translate(3 3)" fill="none" fillRule="evenodd">
      <mask id="project-contributors-b" fill="currentColor">
        <use xlinkHref="#project-contributors-a" />
      </mask>
      <circle stroke="currentColor" strokeWidth={1.5} cx={9} cy={9} r={9.75} />
      <path
        d="M7.135 12.252v.975c0 .378-.36.733-.8.794l-1.799.245c-1.326.182-2.461 1.246-2.536 2.38C2 16.645 6.25 20 8.874 20 11.249 20 17 16.645 17 16.645c-.373-1.07-1.746-2.103-3.067-2.308l-1.947-.302c-.44-.068-.797-.43-.797-.808v-.975c.465-.452.604-1.145.766-1.906.255.05.33-.235.47-.79.14-.553.577-1.12.182-1.191a.44.44 0 0 0-.149-.003l.15-1.86c.063-.778-.335-1.637-.916-1.845-.963-.343-1.26-.526-1.86-.624-.598-.098-1.186.04-1.809.208-.622.169-1.186.607-1.652.844-.465.237-.707.772-.655 1.416l.15 1.86a.442.442 0 0 0-.142.004c-.395.07.042.638.182 1.192.14.554.215.84.434.8.196.751.33 1.444.795 1.895z"
        stroke="currentColor"
        strokeWidth={1.5}
        mask="url(#project-contributors-b)"
      />
    </g>
  </svg>
)

export default ProjectContributors
