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

interface Props {
  color: string
}

const RejectContents: React.FC = () => (
  <React.Fragment>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.10875 13.0509C2.73385 12.676 2.73385 12.0682 3.10875 11.6932L11.9334 2.86855C12.3084 2.49365 12.9162 2.49365 13.2911 2.86856C13.666 3.24346 13.666 3.8513 13.2911 4.2262L4.4664 13.0509C4.0915 13.4258 3.48366 13.4258 3.10875 13.0509Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.10875 2.86903C2.73385 3.24393 2.73385 3.85177 3.10875 4.22667L11.9334 13.0514C12.3084 13.4263 12.9162 13.4263 13.2911 13.0514C13.666 12.6765 13.666 12.0686 13.2911 11.6937L4.4664 2.86903C4.0915 2.49413 3.48366 2.49413 3.10875 2.86903Z"
      fill="currentColor"
    />
  </React.Fragment>
)

const AcceptContents: React.FC = () => (
  <path
    d="M3.71686 7.31556C3.26615 6.86763 2.53812 6.85599 2.08188 7.29814L2.33935 7.04862C1.88708 7.48693 1.88782 8.20466 2.33595 8.64676L5.38669 11.6564C5.83708 12.1008 6.57957 12.1155 7.04189 11.6924L13.6445 5.64912C14.1082 5.22466 14.1215 4.52909 13.6653 4.08694L13.9228 4.33646C13.4705 3.89815 12.723 3.88736 12.2576 4.30831L6.20219 9.78552L3.71686 7.31556Z"
    fill="currentColor"
  />
)

export const Reject: React.FC<Props> = ({ color }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color={color}
  >
    <RejectContents />
  </svg>
)

export const Accept: React.FC<Props> = ({ color }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color={color}
  >
    <AcceptContents />
  </svg>
)

export const SpriteMap: React.FC<Props> = ({ color }) => (
  <svg width={0} height={0}>
    <defs>
      <symbol
        id="track-changes-action-accept"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        color={color}
      >
        <AcceptContents />
      </symbol>
      <symbol
        id="track-changes-action-reject"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        color={color}
      >
        <RejectContents />
      </symbol>
    </defs>
  </svg>
)
