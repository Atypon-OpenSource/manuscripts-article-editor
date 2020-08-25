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

import { ManuscriptOutline } from '@manuscripts/manuscript-editor'
import { ManuscriptNode } from '@manuscripts/manuscript-transform'
import { Manuscript, Project } from '@manuscripts/manuscripts-json-schema'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import PageSidebar from '../PageSidebar'
import { SidebarHeader } from '../Sidebar'

interface Props {
  project: Project
  manuscript: Manuscript
  doc: ManuscriptNode
}

export const HistorySidebar: React.FC<Props> = ({
  project,
  manuscript,
  doc,
}) => {
  return (
    <PageSidebar
      direction={'row'}
      hideWhen={'max-width: 900px'}
      minSize={260}
      name={'sidebar'}
      side={'end'}
      sidebarTitle={
        <SidebarHeader
          title={<Title value={project.title || 'Untitled Project'} />}
        />
      }
    >
      <ManuscriptOutline
        manuscript={manuscript}
        selected={null}
        doc={doc}
        permissions={{ write: false }}
      />
    </PageSidebar>
  )
}
