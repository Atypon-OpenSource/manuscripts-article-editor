"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProjectMenu = exports.buildExportReferencesMenu = exports.buildExportMenu = void 0;
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importDefault(require("react"));
const config_1 = __importDefault(require("../config"));
const truncateText = (text, maxLength) => text.length > maxLength ? text.substring(0, maxLength) + '…' : text;
const deleteManuscriptLabel = (title) => {
    const node = title_editor_1.parse(title);
    return (react_1.default.createElement("span", null,
        "Delete \u201C",
        react_1.default.createElement("abbr", { style: { textDecoration: 'none' }, title: node.textContent }, truncateText(node.textContent, 15)),
        "\u201D"));
};
const buildExportMenu = (openExporter) => {
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
    ];
    if (config_1.default.export.literatum) {
        submenu.push({
            id: 'export-do',
            label: 'Literatum Digital Object',
            run: () => openExporter('literatum-do', false),
        });
    }
    if (config_1.default.export.sts) {
        submenu.push({
            id: 'export-sts',
            label: 'STS',
            run: () => openExporter('sts'),
        });
    }
    if (config_1.default.submission.group_doi && config_1.default.submission.series_code) {
        submenu.push({
            id: 'export-submission',
            label: 'Literatum Submission',
            run: () => openExporter('literatum-bundle', false),
        });
        submenu.push({
            id: 'export-pdf-prince',
            label: 'PDF (via Prince)',
            run: () => openExporter('pdf-prince'),
        });
    }
    return {
        id: 'export',
        label: 'Export Manuscript as…',
        submenu,
    };
};
exports.buildExportMenu = buildExportMenu;
const buildExportReferencesMenu = (openExporter, state) => {
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
    ];
    return {
        id: 'export-bibliography',
        label: 'Export Bibliography as…',
        submenu,
        enable: (() => {
            let result = false;
            state.doc.descendants((node) => {
                if (node.type === node.type.schema.nodes.citation) {
                    result = true;
                }
            });
            return result;
        })(),
    };
};
exports.buildExportReferencesMenu = buildExportReferencesMenu;
const buildProjectMenu = (props) => {
    const exportManuscript = exports.buildExportMenu(props.openExporter);
    const exportReferences = exports.buildExportReferencesMenu(props.openExporter, props.view.state);
    const separator = {
        role: 'separator',
    };
    const submenu = config_1.default.leanWorkflow.enabled
        ? [exportManuscript, exportReferences]
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
                            return 'Untitled Project';
                        }
                        const node = title_editor_1.parse(projectTitle);
                        return node.textContent;
                    },
                    run: () => {
                        const fragment = sectionID ? `#${sectionID}` : '';
                        props.history.push(`/projects/${projectID}/manuscripts/${manuscriptID}${fragment}`);
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
                run: config_1.default.export.to_review ? props.submitToReview : () => null,
                enable: config_1.default.export.to_review && window.navigator.onLine,
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
        ];
    if (!config_1.default.leanWorkflow.enabled && config_1.default.templates.publish) {
        submenu.push(separator, {
            id: 'project-template',
            label: 'Publish Template',
            run: () => props.publishTemplate(),
        });
    }
    return {
        id: 'project',
        label: 'Project',
        submenu,
    };
};
exports.buildProjectMenu = buildProjectMenu;
//# sourceMappingURL=project-menu.js.map