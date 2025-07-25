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
  detectInconsistencyPluginKey,
  Inconsistency,
} from '@manuscripts/body-editor'
import { ArrowDownCircleIcon } from '@manuscripts/style-guide'
import { NodeSelection } from 'prosemirror-state'
import React, { useState } from 'react'
import styled from 'styled-components'

import { scrollIntoView } from '../../lib/utils'
import { useStore } from '../../store'

const IssuesContainer = styled.div`
  padding: ${(props) => props.theme.grid.unit * 2}px;
`

const CollapsibleHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 4px 12px;
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
  background: none;
  border: none;
  width: 100%;
`

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: ${(props) => props.theme.font.size.medium};
  font-weight: 700;
  font-family: 'Lato', sans-serif;
  color: ${(props) => props.theme.colors.text.primary};
`

const CollapseIcon = styled.span<{ isCollapsed: boolean }>`
  background: #fff;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${(props) =>
    props.isCollapsed ? 'rotate(0deg)' : 'rotate(-180deg)'};
  transition: transform 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: none;
  }

  svg {
    width: 19px;
    height: 19px;
  }
`

const InconsistenciesList = styled.div`
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 3}px;
`

const InconsistencyItem = styled.div<{ isFocused: boolean }>`
  padding: 12px 8px;
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
  border: ${(props) =>
    props.isFocused ? `1px solid #F35143` : `1px solid #C9C9C9`};
  box-shadow: ${(props) => (props.isFocused ? `-4px 0 0 0  #F35143` : `none`)};
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) =>
    props.isFocused ? '#FFF1F0' + ' !important' : '#fff'};
  position: relative;
  font-family: 'Lato', sans-serif;
  &:hover {
    background-color: #f2f2f2;
  }

  &:last-child {
    margin-bottom: 0;
  }
`

const InconsistencyTitle = styled.span`
  margin: 0;
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.font.size.small};
  line-height: 1.4;
  font-weight: 700;
  margin-right: 3.2px;
`

const InconsistencyMessage = styled.span`
  margin: 0;
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.font.size.small};
  line-height: 1.4;
`

const NoIssuesMessage = styled.div`
  padding: ${(props) => props.theme.grid.unit * 4}px;
  text-align: center;
  color: ${(props) => props.theme.colors.text.secondary};
  font-style: italic;
`

export const IssuesPanel: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedInconsistencyIndex, setSelectedInconsistencyIndex] = useState<
    number | null
  >(null)
  const [view] = useStore((store) => store.view)

  const inconsistencies = view?.state
    ? detectInconsistencyPluginKey.getState(view.state)?.inconsistencies || []
    : []

  const handleInconsistencyClick = (
    inconsistency: Inconsistency,
    index: number
  ) => {
    setSelectedInconsistencyIndex(index)
    if (view) {
      const tr = view.state.tr
      tr.setSelection(NodeSelection.create(tr.doc, inconsistency.pos))
      view.dispatch(tr)

      const domNode = view.nodeDOM(inconsistency.pos)
      if (domNode && domNode instanceof HTMLElement) {
        scrollIntoView(domNode)
      }
    }
  }

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <IssuesContainer>
      <CollapsibleHeader onClick={toggleCollapsed}>
        <HeaderTitle>Errors ({inconsistencies.length})</HeaderTitle>
        <CollapseIcon isCollapsed={isCollapsed}>
          <ArrowDownCircleIcon />
        </CollapseIcon>
      </CollapsibleHeader>

      {!isCollapsed && (
        <InconsistenciesList>
          {inconsistencies.length === 0 ? (
            <NoIssuesMessage>No errors found</NoIssuesMessage>
          ) : (
            inconsistencies.map(
              (inconsistency: Inconsistency, index: number) => (
                <InconsistencyItem
                  key={inconsistency.pos}
                  isFocused={selectedInconsistencyIndex === index}
                  onClick={() => handleInconsistencyClick(inconsistency, index)}
                  data-cy="inconsistency"
                >
                  <InconsistencyTitle>
                    {inconsistency.nodeDescription}:
                  </InconsistencyTitle>
                  <InconsistencyMessage>
                    {inconsistency.message}
                  </InconsistencyMessage>
                </InconsistencyItem>
              )
            )
          )}
        </InconsistenciesList>
      )}
    </IssuesContainer>
  )
}
