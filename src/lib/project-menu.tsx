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
import {
  ManuscriptEditorState,
  ManuscriptEditorView,
} from '@manuscripts/manuscript-transform'
import { Manuscript, Project } from '@manuscripts/manuscripts-json-schema'
import { parse as parseTitle } from '@manuscripts/title-editor'
import { History } from 'history'
import React from 'react'

import config from '../config'
import { ExportFormat } from '../pressroom/exporter'
import { RecentProject } from './user-project'

type OpenExporter = (format: ExportFormat, closeOnSuccess?: boolean) => void

export interface ProjectMenuProps {
  view: ManuscriptEditorView
  project: Project
  manuscript: Manuscript
  getRecentProjects: () => RecentProject[]
  openTemplateSelector: (newProject?: boolean) => void
  deleteProjectOrManuscript: (model: Project | Manuscript) => void
  history: History
  openExporter: OpenExporter
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

export const buildExportMenu = (openExporter: OpenExporter): MenuSpec => {
  const submenu = [
    {
      id: 'export-pdf',
      label: 'PDF',
      run: () => openExporter('pdf'),
    },
    {
      id: 'export-docx',
      label: 'Microsoft Word',
      run: () => openExporter('docx'),
    },
    {
      id: 'export-epub',
      label: 'EPUB',
      run: () => openExporter('epub'),
    },
    {
      id: 'export-md',
      label: 'Markdown',
      run: () => openExporter('markdown'),
    },
    {
      id: 'export-tex',
      label: 'LaTeX',
      run: () => openExporter('latex'),
    },
    {
      id: 'export-html',
      label: 'HTML',
      run: () => openExporter('html'),
    },
    {
      id: 'export-jats',
      label: 'JATS',
      run: () => openExporter('jats'),
    },
    {
      id: 'export-icml',
      label: 'ICML',
      run: () => openExporter('icml'),
    },
    {
      id: 'export-manuproj',
      label: 'Manuscripts Archive',
      run: () => openExporter('manuproj'),
    },
  ]

  if (config.export.literatum) {
    submenu.push({
      id: 'export-do',
      label: 'Literatum Digital Object',
      run: () => openExporter('literatum-do', false),
    })
  }

  if (config.export.sts) {
    submenu.push({
      id: 'export-sts',
      label: 'STS',
      run: () => openExporter('sts'),
    })
  }

  if (config.submission.group_doi && config.submission.series_code) {
    submenu.push({
      id: 'export-submission',
      label: 'Literatum Submission',
      run: () => openExporter('literatum-bundle', false),
    })

    submenu.push({
      id: 'export-pdf-prince',
      label: 'PDF (via Prince)',
      run: () => openExporter('pdf-prince'),
    })
  }

  return {
    id: 'export',
    label: 'Export Manuscript as…',
    submenu,
  }
}

export const buildExportReferencesMenu = (
  openExporter: OpenExporter,
  state: ManuscriptEditorState
): MenuSpec => {
  const submenu = [
    {
      id: 'export-bib',
      label: 'BibTeX',
      run: () => openExporter('bibtex'),
    },
    {
      id: 'export-ris',
      label: 'RIS',
      run: () => openExporter('ris'),
    },
  ]

  return {
    id: 'export-bibliography',
    label: 'Export Bibliography as…',
    submenu,
    enable: (() => {
      let result = false

      state.doc.descendants((node) => {
        if (node.type === node.type.schema.nodes.citation) {
          result = true
        }
      })

      return result
    })(),
  }
}

export const buildProjectMenu = (props: ProjectMenuProps): MenuSpec => {
  const exportManuscript = buildExportMenu(props.openExporter)
  const exportReferences = buildExportReferencesMenu(
    props.openExporter,
    props.view.state
  )
  const viewDiagnostics = {
    id: 'project-diagnostics',
    label: 'View Diagnostics',
    run: () => props.history.push(`/projects/${props.project._id}/diagnostics`),
  }
  const separator = {
    role: 'separator',
  }

  const submenu: MenuSpec[] = config.leanWorkflow.enabled
    ? [exportManuscript, exportReferences, separator, viewDiagnostics]
    : [
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
        separator,
        {
          id: 'import',
          label: 'Import Manuscript…',
          run: props.openImporter,
        },
        exportManuscript,
        separator,
        exportReferences,
        separator,
        {
          id: 'submit-to-review',
          label: 'Submit to Review…',
          run: config.export.to_review ? props.submitToReview : () => null,
          enable: config.export.to_review && window.navigator.onLine,
        },
        separator,
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
        separator,
        {
          id: 'rename-project',
          label: 'Rename Project',
          run: () => props.openRenameProject(props.project),
        },
        separator,
        viewDiagnostics,
      ]

  if (!config.leanWorkflow.enabled && config.templates.publish) {
    submenu.push(separator, {
      id: 'project-template',
      label: 'Publish Template',
      run: () => props.publishTemplate(),
    })
  }

  return {
    id: 'project',
    label: 'Project',
    submenu,
  }
}
