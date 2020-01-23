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

import { MenuItem } from '@manuscripts/manuscript-editor'
import { Manuscript, Project } from '@manuscripts/manuscripts-json-schema'
import { parse as parseTitle } from '@manuscripts/title-editor'
import { History } from 'history'
import React from 'react'
import config from '../config'
import { RecentProject } from './user-project'

interface Props {
  project: Project
  manuscript: Manuscript
  getRecentProjects: () => RecentProject[]
  openTemplateSelector: (newProject?: boolean) => void
  addManuscript: () => void
  deleteManuscript: (id: string) => Promise<void>
  deleteModel: (id: string) => Promise<string>
  history: History
  openExporter: (format: string) => void
  openImporter: () => void
  openRenameProject: (project: Project) => void
}

const truncateText = (text: string, maxLength: number) =>
  text.length > maxLength ? text.substring(0, maxLength) + '…' : text

const deleteManuscriptLabel = (title: string) => {
  const node = parseTitle(title)

  return (
    <span>
      Delete “
      <abbr style={{ textDecoration: 'none' }} title={node.textContent}>
        {truncateText(node.textContent, 15)}
      </abbr>
      ”
    </span>
  )
}

const confirmDeleteManuscriptMessage = (title: string) => {
  const node = parseTitle(title)

  return `Are you sure you wish to delete the manuscript with title "${node.textContent}"?`
}

const confirmDeleteProjectMessage = (title: string) => {
  const node = parseTitle(title)

  return `Are you sure you wish to delete the project with title "${node.textContent}"?`
}

export const buildProjectMenu = (props: Props): MenuItem => {
  const exportMenu: MenuItem[] = [
    {
      id: 'export-pdf',
      label: () => 'PDF',
      run: () => props.openExporter('.pdf'),
    },
    {
      id: 'export-docx',
      label: () => 'Microsoft Word',
      run: () => props.openExporter('.docx'),
    },
    {
      id: 'export-md',
      label: () => 'Markdown',
      run: () => props.openExporter('.md'),
    },
    {
      id: 'export-tex',
      label: () => 'LaTeX',
      run: () => props.openExporter('.tex'),
    },
    {
      id: 'export-jats',
      label: () => 'JATS XML',
      run: () => props.openExporter('.xml'),
    },
    {
      id: 'export-html',
      label: () => 'HTML',
      run: () => props.openExporter('.html'),
    },
    {
      id: 'export-manuproj',
      label: () => 'Manuscripts Archive',
      run: () => props.openExporter('.manuproj'),
    },
  ]

  if (config.export.literatum) {
    exportMenu.push({
      id: 'export-ado',
      label: () => 'Literatum Digital Object',
      run: () => props.openExporter('.do'),
    })
  }

  return {
    id: 'project',
    label: () => 'Project',
    submenu: [
      {
        id: 'project-new',
        label: () => 'New',
        submenu: [
          {
            id: 'project-new-project',
            label: () => 'Project…',
            run: () => props.openTemplateSelector(true),
          },
          {
            id: 'project-new-manuscript',
            label: () => 'Manuscript…',
            run: () => props.openTemplateSelector(false),
          },
        ],
      },
      {
        id: 'project-open-recent',
        label: () => 'Open Recent',
        enable: () => props.getRecentProjects().length > 0,
        submenu: props
          .getRecentProjects()
          .map(({ projectID, manuscriptID, projectTitle, sectionID }) => ({
            id: `project-open-recent-${projectID}-${manuscriptID}`,
            label: () => {
              if (!projectTitle) {
                return 'Untitled Project'
              }

              const node = parseTitle(projectTitle)

              return node.textContent
            },
            run: () => {
              const fragment = sectionID ? `#${sectionID}` : ''

              props.history.push(
                `/projects/${projectID}/manuscripts/${manuscriptID}${fragment}`
              )
            },
          })),
      },
      {
        role: 'separator',
      },
      {
        id: 'import',
        label: () => 'Import…',
        run: props.openImporter,
      },
      {
        id: 'export',
        label: () => 'Export as…',
        submenu: exportMenu,
      },
      {
        role: 'separator',
      },
      {
        id: 'delete-project',
        label: () => 'Delete Project',
        run: () =>
          confirm(
            props.project.title
              ? confirmDeleteProjectMessage(props.project.title)
              : 'Are you sure you wish to delete this untitled project?'
          ) &&
          props
            .deleteModel(props.manuscript.containerID)
            .then(() => props.history.push('/')),
      },
      {
        id: 'delete-manuscript',
        label: () =>
          props.manuscript.title
            ? deleteManuscriptLabel(props.manuscript.title)
            : 'Delete Untitled Manuscript',
        run: () =>
          confirm(
            props.manuscript.title
              ? confirmDeleteManuscriptMessage(props.manuscript.title)
              : `Are you sure you wish to delete this untitled manuscript?`
          ) && props.deleteManuscript(props.manuscript._id),
      },
      {
        role: 'separator',
      },
      {
        id: 'rename-project',
        label: () => 'Rename Project',
        run: () => props.openRenameProject(props.project),
      },
      {
        role: 'separator',
      },
      {
        id: 'project-diagnostics',
        label: () => 'View Diagnostics',
        run: () =>
          props.history.push(`/projects/${props.project._id}/diagnostics`),
      },
    ],
  }
}
