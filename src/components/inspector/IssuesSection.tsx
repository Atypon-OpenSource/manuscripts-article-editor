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

import { Inconsistency } from '@manuscripts/body-editor'
import { ToggleHeader } from '@manuscripts/style-guide'
import { NodeSelection } from 'prosemirror-state'
import React, { useState } from 'react'
import styled from 'styled-components'

import { scrollIntoView } from '../../lib/utils'
import { useStore } from '../../store'

type IssuesSectionProps = {
  title: string
  items: Inconsistency[]
  selectedInconsistencyKey: string | null
  setSelectedInconsistencyKey: (key: string | null) => void
}

export const IssuesSection: React.FC<IssuesSectionProps> = ({
  title,
  items,
  selectedInconsistencyKey,
  setSelectedInconsistencyKey,
}) => {
  const [isOpen, setIsOpen] = useState(items.length > 0)
  const toggleOpen = () => setIsOpen((prev) => !prev)
  const [view] = useStore((store) => store.view)

  const handleInconsistencyClick = (
    key: string,
    inconsistency: Inconsistency
  ) => {
    setSelectedInconsistencyKey(key)
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
  return (
    <section className={`${title.toLowerCase()}-section`}>
      <ToggleHeader
        title={`${title} (${items.length})`}
        isOpen={isOpen}
        onToggle={toggleOpen}
      />
      {isOpen && items.length > 0 && (
        <InconsistenciesList>
          {items.map((inconsistency, index) => {
            const key = `${title}-${index}`
            return (
              <InconsistencyItem
                key={key}
                isFocused={selectedInconsistencyKey === key}
                severity={inconsistency.severity}
                onClick={() => handleInconsistencyClick(key, inconsistency)}
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
          })}
        </InconsistenciesList>
      )}
    </section>
  )
}

const InconsistenciesList = styled.div`
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 3}px;
`

const InconsistencyItem = styled.div<{
  isFocused: boolean
  severity: 'error' | 'warning'
}>`
  padding: 12px 8px;
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  font-family: 'Lato', sans-serif;

  border: ${(props) =>
    props.isFocused
      ? `1px solid ${
          props.severity === 'error'
            ? props.theme.colors.button.error.border.default
            : '#FE8F1F'
        }`
      : `1px solid #C9C9C9`};

  box-shadow: ${(props) =>
    props.isFocused
      ? `-4px 0 0 0 ${
          props.severity === 'error'
            ? props.theme.colors.button.error.border.default
            : '#FE8F1F'
        }`
      : 'none'};

  background-color: ${(props) =>
    props.isFocused
      ? props.severity === 'error'
        ? `${props.theme.colors.background.error} !important`
        : '#fffcdb !important'
      : '#fff'};

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
