/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */
import {
  TriangleCollapsedIcon,
  TriangleExpandedIcon,
} from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

interface SectionHeaderProps {
  title: string
  isOpen: boolean
  onToggle: () => void
}

export const ToggleHeader: React.FC<SectionHeaderProps> = ({
  title,
  isOpen,
  onToggle,
}) => {
  return (
    <ToggleHeaderContainer
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
    >
      <span>{title}</span>
      <ToggleIcon
        isOpen={isOpen}
        // onClick={(e) => {
        //   e.stopPropagation()
        //   onToggle()
        // }}
      >
        {isOpen ? <TriangleExpandedIcon /> : <TriangleCollapsedIcon />}
      </ToggleIcon>
    </ToggleHeaderContainer>
  )
}

const ToggleHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 8px;
  margin: 8px;

  cursor: pointer;

  border-top: 1px solid #f2f2f2;

  font-size: 16px;
  font-weight: 700;
  font-family: Lato, sans-serif;
`

export const ToggleIcon = styled.div<{ isOpen: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #e2e2e2;
  text-align: center;
  cursor: pointer;

  svg {
    width: 19px;
    height: 19px;
    transition: transform 0.2s ease; // Smooth transition for rotation
  }

  // Style for TriangleCollapsedIcon (when collapsed)
  ${(props) =>
    !props.isOpen &&
    `
    svg {
      transform: rotate(270deg); // Point downward when collapsed
    }
  `}

  // Style for TriangleExpandedIcon (when expanded)
  ${(props) =>
    props.isOpen &&
    `
    svg {
      transform: rotate(0deg); // Point upward when expanded
    }
  `}
`
