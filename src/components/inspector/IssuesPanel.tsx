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
import React from 'react'
import styled from 'styled-components'

import { useStore } from '../../store'
import { IssuesSection } from './IssuesSection'

const IssuesContainer = styled.div`
  padding: ${(props) => props.theme.grid.unit * 2}px;
`

export const IssuesPanel: React.FC = () => {
  const [view] = useStore((store) => store.view)
  const inconsistencies = view?.state
    ? detectInconsistencyPluginKey.getState(view.state)?.inconsistencies || []
    : []

  const errors: Inconsistency[] = []
  const warnings: Inconsistency[] = []

  inconsistencies.forEach((inconsistency) => {
    if (inconsistency.severity === 'error') {
      errors.push(inconsistency)
    } else if (inconsistency.severity === 'warning') {
      warnings.push(inconsistency)
    }
  })

  return (
    <IssuesContainer>
      <IssuesSection title="Errors" items={errors} />
      <IssuesSection title="Warnings" items={warnings} />
    </IssuesContainer>
  )
}
