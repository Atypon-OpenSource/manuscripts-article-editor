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
import { Model, Project, Submission } from '@manuscripts/manuscripts-json-schema';
import JSZip from 'jszip';
import { GetAttachment } from '../components/projects/Exporter';
import { ProjectDump } from './importers';
export declare const removeEmptyStyles: (model: {
    [key: string]: any;
}) => void;
export declare const createProjectDump: (modelMap: Map<string, Model>, manuscriptID?: string | null | undefined) => ProjectDump;
export declare const buildProjectBundle: (getAttachment: GetAttachment, modelMap: Map<string, Model>, manuscriptID: string | null, format: ExportFormat) => Promise<JSZip>;
export declare const generateDownloadFilename: (title: string) => string;
export declare type ExportManuscriptFormat = 'docx' | 'epub' | 'pdf' | 'pdf-prince' | 'latex' | 'html' | 'icml' | 'markdown' | 'literatum-do' | 'jats' | 'sts' | 'literatum-bundle' | 'literatum-eeo' | 'manuproj';
export declare type ImportManuscriptFormat = 'xml' | 'pdf' | 'word' | 'word-arc' | 'zip';
export declare type ExportBibliographyFormat = 'bibtex' | 'ris';
export declare type ExportFormat = ExportManuscriptFormat | ExportBibliographyFormat;
export declare const downloadExtension: (format: ExportFormat) => string;
export declare const exportProject: (getAttachment: GetAttachment, modelMap: Map<string, Model>, manuscriptID: string | null, format: ExportFormat, project?: Project | undefined, submission?: Submission | undefined) => Promise<Blob>;
