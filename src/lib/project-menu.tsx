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

import { MenuSpec } from '@manuscripts/manuscript-editor'
import { ManuscriptEditorView } from '@manuscripts/manuscript-transform'
import { Manuscript, Project } from '@manuscripts/manuscripts-json-schema'
import { parse as parseTitle } from '@manuscripts/title-editor'
import { History } from 'history'
import React from 'react'

import config from '../config'
import { ExportFormat } from '../pressroom/exporter'
import { RecentProject } from './user-project'

export interface ProjectMenuProps {
  view: ManuscriptEditorView
  project: Project
  manuscript: Manuscript
  getRecentProjects: () => RecentProject[]
  openTemplateSelector: (newProject?: boolean) => void
  deleteProjectOrManuscript: (id: Project | Manuscript) => void
  history: History
  openExporter: (format: ExportFormat, closeOnSuccess?: boolean) => void
  openImporter: () => void
  openRenameProject: (project: Project) => void
  publishTemplate: () => Promise<void>
  submitToReview: () => Promise<void>
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

export const buildProjectMenu = (props: ProjectMenuProps): MenuSpec => {
  const exportMenu: MenuSpec[] = [
    {
      id: 'export-pdf',
      label: 'PDF',
      run: () => props.openExporter('pdf'),
    },
    {
      id: 'export-docx',
      label: 'Microsoft Word',
      run: () => props.openExporter('docx'),
    },
    {
      id: 'export-epub',
      label: 'EPUB',
      run: () => props.openExporter('epub'),
    },
    {
      id: 'export-md',
      label: 'Markdown',
      run: () => props.openExporter('md'),
    },
    {
      id: 'export-tex',
      label: 'LaTeX',
      run: () => props.openExporter('tex'),
    },
    {
      id: 'export-html',
      label: 'HTML',
      run: () => props.openExporter('html'),
    },
    {
      id: 'export-jats',
      label: 'JATS',
      run: () => props.openExporter('jats'),
    },
    {
      id: 'export-icml',
      label: 'ICML',
      run: () => props.openExporter('icml'),
    },
    {
      id: 'export-manuproj',
      label: 'Manuscripts Archive',
      run: () => props.openExporter('manuproj'),
    },
  ]

  if (config.export.literatum) {
    exportMenu.push({
      id: 'export-do',
      label: 'Literatum Digital Object',
      run: () => props.openExporter('do', false),
    })
  }

  if (config.export.sts) {
    exportMenu.push({
      id: 'export-sts',
      label: 'STS',
      run: () => props.openExporter('sts'),
    })
  }

  if (config.submission.group_doi && config.submission.series_code) {
    exportMenu.push({
      id: 'export-submission',
      label: 'Literatum Submission',
      run: () => props.openExporter('submission', false),
    })

    exportMenu.push({
      id: 'export-pdf-prince',
      label: 'PDF (via Prince)',
      run: () => props.openExporter('pdf-prince'),
    })
  }

  const exportReferencesMenu: MenuSpec[] = [
    {
      id: 'export-bib',
      label: 'BibTeX',
      run: () => props.openExporter('bib'),
    },
    {
      id: 'export-ris',
      label: 'RIS',
      run: () => props.openExporter('ris'),
    },
    {
      id: 'export-mods',
      label: 'MODS',
      run: () => props.openExporter('mods'),
    },
  ]

  const submenu: MenuSpec[] = [
    {
      id: 'project-new',
      label: 'New',
      submenu: [
        {
          id: 'project-new-project',
          label: 'Project…',
          run: () => props.openTemplateSelector(true),
        },
        {
          id: 'project-new-manuscript',
          label: 'Manuscript…',
          run: () => props.openTemplateSelector(false),
        },
      ],
    },
    {
      id: 'project-open-recent',
      label: 'Open Recent',
      enable: props.getRecentProjects().length > 0,
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
      label: 'Import Manuscript…',
      run: props.openImporter,
    },
    {
      id: 'export',
      label: 'Export Manuscript as…',
      submenu: exportMenu,
    },
    {
      role: 'separator',
    },
    {
      id: 'export-bibliography',
      label: 'Export Bibliography as…',
      submenu: exportReferencesMenu,
      enable: (() => {
        let result = false

        props.view.state.doc.descendants((node) => {
          if (node.type === node.type.schema.nodes.citation) {
            result = true
          }
        })

        return result
      })(),
    },
    {
      role: 'separator',
    },
    {
      id: 'submit-to-review',
      label: 'Submit to Review…',
      run: config.export.to_review ? props.submitToReview : () => null,
      enable: config.export.to_review && window.navigator.onLine,
    },
    {
      role: 'separator',
    },
    {
      id: 'delete-project',
      label: 'Delete Project',
      run: () => props.deleteProjectOrManuscript(props.project),
    },
    {
      id: 'delete-manuscript',
      label: props.manuscript.title
        ? deleteManuscriptLabel(props.manuscript.title)
        : 'Delete Untitled Manuscript',
      run: () => props.deleteProjectOrManuscript(props.manuscript),
    },
    {
      role: 'separator',
    },
    {
      id: 'rename-project',
      label: 'Rename Project',
      run: () => props.openRenameProject(props.project),
    },
    {
      role: 'separator',
    },
    {
      id: 'project-diagnostics',
      label: 'View Diagnostics',
      run: () =>
        props.history.push(`/projects/${props.project._id}/diagnostics`),
    },
  ]

  if (config.templates.publish) {
    submenu.push(
      {
        role: 'separator',
      },
      {
        id: 'project-template',
        label: 'Publish Template',
        run: () => props.publishTemplate(),
      }
    )
  }

  return {
    id: 'project',
    label: 'Project',
    submenu,
  }
}
