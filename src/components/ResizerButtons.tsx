/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import React from 'react'
import { css, styled } from '../theme/styled-components'
import { ResizerButton, ResizerButtonInnerProps } from './Panel'

export const ResizingOutlinerButton: React.FunctionComponent<
  ResizerButtonInnerProps
> = ({ ...props }) => (
  <ResizerButton {...props}>
    <svg width="16" height="13" viewBox="0 0 16 13">
      <g fill="#6E6E6E">
        <path d="M14.983 11.775H4.438a.787.787 0 110-1.574h10.545a.787.787 0 010 1.574zm0-4.939H4.438a.787.787 0 110-1.574h10.545a.787.787 0 010 1.574zm0-4.939H4.438a.787.787 0 110-1.574h10.545a.787.787 0 010 1.574z" />
        <circle cx="1.057" cy="1.171" r="1.057" />
        <circle cx="1.057" cy="6.049" r="1.057" />
        <circle cx="1.057" cy="10.927" r="1.057" />
      </g>
    </svg>
  </ResizerButton>
)

const collapsedStyling = css`
  right: ${props => props.theme.grid.unit * 5}px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`

const UnstyledResizingInspectorButton: React.FunctionComponent<
  ResizerButtonInnerProps
> = ({ ...props }) => (
  <ResizerButton {...props}>
    <svg width="8" height="16" viewBox="0 0 8 16">
      <path
        fill="#6E6E6E"
        d="M6.852 14.22l-.223.91c-.668.264-1.202.464-1.6.602-.397.139-.86.208-1.386.208-.809 0-1.438-.199-1.887-.592a1.915 1.915 0 01-.673-1.503c0-.236.016-.477.05-.724s.089-.524.163-.835l.835-2.955c.074-.283.137-.552.188-.805a3.52 3.52 0 00.076-.693c0-.377-.078-.641-.234-.79-.155-.148-.452-.223-.893-.223a2.34 2.34 0 00-.664.102 9.264 9.264 0 00-.584.192l.223-.911a20.68 20.68 0 011.57-.572c.5-.159.973-.238 1.42-.238.803 0 1.423.194 1.858.582.436.389.653.893.653 1.513 0 .129-.014.355-.045.679-.03.324-.086.62-.167.89L4.7 12.002a7.838 7.838 0 00-.182.811 4.174 4.174 0 00-.082.688c0 .391.088.658.262.8.176.142.48.212.91.212.202 0 .432-.036.688-.106.255-.07.44-.132.556-.187zm.21-12.359c0 .513-.193.951-.581 1.311a1.98 1.98 0 01-1.4.543 2.001 2.001 0 01-1.408-.543c-.391-.36-.587-.798-.587-1.31S3.282.91 3.673.545C4.063.182 4.533 0 5.08 0a1.97 1.97 0 011.4.546c.39.365.583.804.583 1.315z"
      />
    </svg>
  </ResizerButton>
)

export const ResizingInspectorButton = styled(UnstyledResizingInspectorButton)<{
  isCollapsed: boolean
}>`
  ${props => (props.isCollapsed ? collapsedStyling : 'right: 0;')}
`
