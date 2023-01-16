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
import { Build, ContainedModel, ContainedProps } from '@manuscripts/manuscript-transform';
import { BibliographyItem, Correction, LibraryCollection, Manuscript, Model, Project, UserProfile } from '@manuscripts/manuscripts-json-schema';
import { Commit } from '@manuscripts/track-changes';
import Api from '../postgres-data/Api';
import { ContainedIDs, state } from '../store';
declare const buildUtilities: (data: Partial<state>, api: Api, updateState: (state: Partial<state>) => void) => {
    saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T & {
        containerID: string;
        manuscriptID?: string | undefined;
        templateID?: string | undefined;
    }>;
    deleteModel: (id: string) => Promise<string>;
    saveManuscript: (manuscriptData: Partial<Manuscript>) => Promise<undefined>;
    saveNewManuscript: (dependencies: Array<Build<ContainedModel> & ContainedIDs>, containerID: string, manuscript: Build<Manuscript>, newProject?: Build<Project> | undefined) => Promise<Build<Manuscript>>;
    getModel: <T_1 extends Model>(id: string) => T_1 | undefined;
    saveCommit: (commit: Commit) => (import("@manuscripts/manuscripts-json-schema").Commit & ContainedProps) | undefined;
    saveCorrection: (correction: Correction) => Promise<Correction & {
        containerID: string;
        manuscriptID?: string | undefined;
        templateID?: string | undefined;
    }>;
    createProjectLibraryCollection: (libraryCollection: Build<LibraryCollection>, projectID?: string | undefined) => Promise<void>;
    saveBiblioItem: (item: Build<BibliographyItem>, projectID: string) => Promise<BibliographyItem & ContainedProps>;
    deleteBiblioItem: (item: BibliographyItem) => Promise<boolean>;
    updateBiblioItem: (item: BibliographyItem) => Promise<BibliographyItem & {
        containerID: string;
        manuscriptID?: string | undefined;
        templateID?: string | undefined;
    }>;
    bulkUpdate: (items: Array<ContainedModel>) => Promise<void>;
    createUser: (profile: Build<UserProfile>) => Promise<void>;
    biblio: {
        filterLibraryItems: (query: string) => Promise<BibliographyItem[]>;
        matchLibraryItemByIdentifier: (item: BibliographyItem) => BibliographyItem | undefined;
        setLibraryItem: (item: BibliographyItem) => any;
        removeLibraryItem: (id: string) => void;
        getCitationProvider: () => undefined;
        getLibraryItem: (id: string) => BibliographyItem | undefined;
    } | undefined;
};
export default buildUtilities;
