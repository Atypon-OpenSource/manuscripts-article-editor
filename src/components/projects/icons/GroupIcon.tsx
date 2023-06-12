/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
import React from 'react'
import styled from 'styled-components'

export const GroupIcon: React.FC<{ numberOfCitations: number }> = ({
  numberOfCitations,
}) => (
  <BadgeIcon
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="12"
      height="12"
      rx="6"
      fill={(numberOfCitations > 0 && '#BCE7F6') || '#FE8F1F'}
    />
    <text
      x="6"
      y="8"
      fill="#FFF"
      fontSize="9px"
      textAnchor="middle"
      fontWeight="400"
    >
      {numberOfCitations}
    </text>
  </BadgeIcon>
)

const BadgeIcon = styled.svg`
  top: -4px;
  right: 16px;
  position: absolute;
`
