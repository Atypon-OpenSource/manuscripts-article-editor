/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { MenuItem } from '@manuscripts/manuscript-editor/dist/types/components/menu/ApplicationMenu'
import { Manuscript, Project } from '@manuscripts/manuscripts-json-schema'
import { parse as parseTitle } from '@manuscripts/title-editor'
import { History } from 'history'
import React from 'react'

export interface RecentProject {
  projectID: string
  manuscriptID: string
  projectTitle?: string
  sectionID?: string
}

interface Props {
  project: Project
  manuscript: Manuscript
  getRecentProjects: () => RecentProject[]
  openTemplateSelector: () => void
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

  return `Are you sure you wish to delete the manuscript with title "${
    node.textContent
  }"?`
}

const confirmDeleteProjectMessage = (title: string) => {
  const node = parseTitle(title)

  return `Are you sure you wish to delete the project with title "${
    node.textContent
  }"?`
}

export const buildProjectMenu = (props: Props): MenuItem => ({
  label: () => 'Project',
  submenu: [
    {
      label: () => 'New',
      submenu: [
        {
          label: () => 'Manuscript with Template…',
          run: props.openTemplateSelector,
        },
        {
          label: () => 'Manuscript',
          run: props.addManuscript,
        },
      ],
    },
    {
      label: () => 'Open Recent',
      enable: () => props.getRecentProjects().length > 0,
      submenu: props
        .getRecentProjects()
        .map(({ projectID, manuscriptID, projectTitle, sectionID }) => ({
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
      label: () => 'Import…',
      run: props.openImporter,
    },
    {
      label: () => 'Export as…',
      submenu: [
        {
          label: () => 'PDF',
          run: () => props.openExporter('.pdf'),
        },
        {
          label: () => 'Microsoft Word',
          run: () => props.openExporter('.docx'),
        },
        {
          label: () => 'Markdown',
          run: () => props.openExporter('.md'),
        },
        {
          label: () => 'LaTeX',
          run: () => props.openExporter('.tex'),
        },
        {
          label: () => 'JATS XML',
          run: () => props.openExporter('.xml'),
        },
        {
          label: () => 'Manuscripts Archive',
          run: () => props.openExporter('.manuproj'),
        },
      ],
    },
    {
      role: 'separator',
    },
    {
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
      label: () => 'Rename Project',
      run: () => props.openRenameProject(props.project),
    },
  ],
})
