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
import { Attachment, Build, ContainedModel, ManuscriptModel, ManuscriptNode, ModelAttachment } from '@manuscripts/manuscript-transform';
import { CommentAnnotation, ContainerInvitation, Manuscript, ManuscriptNote, ManuscriptTemplate, Model, Project, ProjectInvitation, Snapshot, Tag, UserProfile } from '@manuscripts/manuscripts-json-schema';
import { Commit } from '@manuscripts/track-changes';
import { BiblioTools } from '../couch-data/Bibilo';
import { TokenData } from '../couch-data/TokenData';
import { StoreDataSourceStrategy } from '.';
export interface TokenActions {
    delete: () => void;
    update: (token: string) => void;
}
export declare type action = {
    action?: string;
    [key: string]: any;
};
export declare type ImportError = {
    error: boolean;
    message: string;
};
export declare type ImportOk = {
    ok: boolean;
};
export declare type bulkCreate = <T>(models: Array<Build<T> & ContainerIDs & ModelAttachment>) => Promise<Array<ImportError | ImportOk>>;
export interface ContainerIDs {
    containerID?: string;
    manuscriptID?: string;
    templateID?: string;
}
export interface ContainedIDs {
    containerID: string;
    manuscriptID?: string;
}
export declare type state = {
    [key: string]: any;
    project: Project;
    manuscript: Manuscript;
    manuscripts?: Manuscript[];
    doc: ManuscriptNode;
    ancestorDoc: ManuscriptNode;
    user: UserProfile;
    tokenData: TokenData;
    projectID: string;
    submissionID?: string;
    userID?: string | undefined;
    userProfileID?: string | undefined;
    manuscriptID: string;
    containerID: string;
    biblio: BiblioTools;
    commitAtLoad?: Commit | null;
    invitations?: ContainerInvitation[];
    projectInvitations?: ProjectInvitation[];
    containerInvitations?: ContainerInvitation[];
    projects: Project[];
    getModel: <T extends Model>(id: string) => T | undefined;
    saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>;
    saveManuscript: (data: Partial<Manuscript>) => Promise<void>;
    deleteModel: (id: string) => Promise<string>;
    bulkUpdate: (items: Array<ContainedModel>) => Promise<void>;
    bulkCreate: bulkCreate;
    deleteProject: (projectID: string) => Promise<string>;
    updateProject: (projectID: string, data: Partial<Project>) => Promise<Project>;
    saveNewManuscript: (dependencies: Array<Build<ContainedModel> & ContainedIDs>, containerID: string, manuscript: Build<Manuscript>, newProject?: Build<Project>) => Promise<Build<Manuscript>>;
    updateManuscriptTemplate: (dependencies: Array<Build<ContainedModel> & ContainedIDs>, containerID: string, manuscript: Manuscript, updatedModels: ManuscriptModel[]) => Promise<Manuscript>;
    getInvitation: (invitingUserID: string, invitedEmail: string) => Promise<ContainerInvitation>;
    commits: Commit[];
    modelMap: Map<string, Model>;
    snapshotID: string | null;
    snapshots?: Snapshot[];
    comments?: CommentAnnotation[];
    notes?: ManuscriptNote[];
    tags?: Tag[];
    collaborators?: Map<string, UserProfile>;
    collaboratorsProfiles?: Map<string, UserProfile>;
    collaboratorsById?: Map<string, UserProfile>;
    getAttachment?: (id: string, attachmentID: string) => Promise<Blob | undefined>;
    putAttachment?: (id: string, attachment: Attachment) => Promise<void>;
    getUserTemplates?: () => Promise<{
        userTemplates: ManuscriptTemplate[];
        userTemplateModels: ManuscriptModel[];
    }>;
};
export declare type reducer = (payload: any, store: state, action?: string) => state;
export declare type dispatch = (action: action) => void;
export interface Store {
    state: state | null;
    dispatchAction(action: action): void;
    reducer?: reducer;
    beforeAction?(action: string, payload: any, store: state, setState: (state: state) => void): void | action;
    unmountHandler?(state: state): void;
    subscribe(fn: () => void): () => void;
    queue: Set<(state: state) => void>;
    unmount(): void;
    setState(state: state): void;
    getState(): state;
    dispatchQueue(): void;
}
export declare class GenericStore implements Store {
    reducer: (payload: any, store: state, action?: string | undefined) => any;
    unmountHandler: ((state: state) => void) | undefined;
    state: state | null;
    private sources;
    beforeAction?: (action: string, payload: any, store: state, setState: (state: state) => void) => void | action;
    constructor(reducer?: (payload: any, store: state, action?: string | undefined) => any, unmountHandler?: (state: state) => void, state?: {});
    queue: Set<(state: state) => void>;
    getState(): state;
    setState(state: state | ((state: state) => state)): void;
    init: (sources: StoreDataSourceStrategy[]) => Promise<void>;
    dispatchQueue(): void;
    subscribe(fn: (state: state) => void): () => void;
    dispatchAction({ action, ...payload }: {
        [x: string]: any;
        action?: string | undefined;
    }): void;
    unmount(): void;
}
