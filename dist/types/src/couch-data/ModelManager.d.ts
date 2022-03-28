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
import { Attachment, Build, ContainedModel, ContainedProps, ManuscriptModel, ManuscriptNode } from '@manuscripts/manuscript-transform';
import { Bundle, ContainerInvitation, Correction, Manuscript, ManuscriptTemplate, Model, Project, Snapshot } from '@manuscripts/manuscripts-json-schema';
import { RxDatabase } from '@manuscripts/rxdb';
import { Commit } from '@manuscripts/track-changes';
import { JsonModel } from '../pressroom/importers';
import { ContainedIDs } from '../store';
import { Collection } from '../sync/Collection';
declare type ModelMap = Map<string, Model>;
interface ManuscriptModels {
    getModel: <T extends Model>(id: string) => T | undefined;
    saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>;
    saveManuscript: (data: Partial<Manuscript>) => Promise<void>;
    deleteModel: (id: string) => Promise<string>;
    bundle: Bundle | null;
    collection: Collection<ContainedModel>;
    modelMap: ModelMap;
    setModelsState: (modelMap: Map<string, Model>) => void;
}
export default class ModelManager implements ManuscriptModels {
    bundle: Bundle | null;
    collection: Collection<ContainedModel>;
    userCollection: Collection<ContainedModel>;
    modelMap: ModelMap;
    setModelsState: (modelMap: Map<string, Model>) => void;
    manuscriptID: string;
    containerID: string;
    snapshots: Snapshot[];
    commits: Commit[];
    db: RxDatabase<any>;
    constructor(modelMap: Map<string, Model>, setModelsState: (modelMap: Map<string, Model>) => void, manuscriptID: string, projectID: string, collection: Collection<ContainedModel>, userCollection: Collection<ContainedModel>, snapshots: Snapshot[], commits: Commit[], db: RxDatabase<any>);
    buildModelMapFromJson: (models: JsonModel[]) => Map<string, JsonModel>;
    saveDependenciesForNew: (dependencies: Array<Build<ContainedModel> & ContainedIDs>, collection: Collection<ContainedModel | ManuscriptModel>) => Promise<void>;
    getAttachment: (id: string, attachmentID: string) => Promise<Blob | undefined>;
    putAttachment: (id: string, attachment: Attachment) => Promise<undefined>;
    saveNewManuscript: (dependencies: Array<Build<ContainedModel> & ContainedIDs>, containerID: string, manuscript: Build<Manuscript>, newProject?: Build<Project> | undefined) => Promise<Build<Manuscript>>;
    updateManuscriptTemplate: (dependencies: Array<Build<ContainedModel> & ContainedIDs>, containerID: string, manuscript: Manuscript, updatedModels: ManuscriptModel[]) => Promise<Manuscript>;
    getUserTemplates: () => Promise<{
        userTemplates: ManuscriptTemplate[];
        userTemplateModels: ManuscriptModel[];
    }>;
    getTools: () => Promise<{
        snapshotID: null;
        commits: Commit[];
        commitAtLoad: null;
        snapshots: Snapshot[];
        doc: ManuscriptNode;
        ancestorDoc: ManuscriptNode;
        saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T & ContainedProps>;
        deleteModel: (id: string) => Promise<string>;
        saveManuscript: (data: Partial<Manuscript>) => Promise<undefined>;
        getModel: <T_1 extends Model>(id: string) => T_1 | undefined;
        saveNewManuscript: (dependencies: Array<Build<ContainedModel> & ContainedIDs>, containerID: string, manuscript: Build<Manuscript>, newProject?: Build<Project> | undefined) => Promise<Build<Manuscript>>;
        putAttachment: (id: string, attachment: Attachment) => Promise<undefined>;
        getAttachment: (id: string, attachmentID: string) => Promise<Blob | undefined>;
        updateManuscriptTemplate: (dependencies: Array<Build<ContainedModel> & ContainedIDs>, containerID: string, manuscript: Manuscript, updatedModels: ManuscriptModel[]) => Promise<Manuscript>;
        getInvitation: (invitingUserID: string, invitedEmail: string) => Promise<ContainerInvitation>;
        getUserTemplates: () => Promise<{
            userTemplates: ManuscriptTemplate[];
            userTemplateModels: ManuscriptModel[];
        }>;
    } | {
        snapshotID: string;
        commits: Commit[];
        commitAtLoad: Commit | null;
        snapshots: Snapshot[];
        doc: ManuscriptNode;
        ancestorDoc: ManuscriptNode;
        saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T & ContainedProps>;
        deleteModel: (id: string) => Promise<string>;
        saveManuscript: (data: Partial<Manuscript>) => Promise<undefined>;
        getModel: <T_1 extends Model>(id: string) => T_1 | undefined;
        saveNewManuscript: (dependencies: Array<Build<ContainedModel> & ContainedIDs>, containerID: string, manuscript: Build<Manuscript>, newProject?: Build<Project> | undefined) => Promise<Build<Manuscript>>;
        putAttachment: (id: string, attachment: Attachment) => Promise<undefined>;
        getAttachment: (id: string, attachmentID: string) => Promise<Blob | undefined>;
        updateManuscriptTemplate: (dependencies: Array<Build<ContainedModel> & ContainedIDs>, containerID: string, manuscript: Manuscript, updatedModels: ManuscriptModel[]) => Promise<Manuscript>;
        getInvitation: (invitingUserID: string, invitedEmail: string) => Promise<ContainerInvitation>;
        getUserTemplates: () => Promise<{
            userTemplates: ManuscriptTemplate[];
            userTemplateModels: ManuscriptModel[];
        }>;
    }>;
    saveCorrection: (correction: Correction) => Promise<ContainedModel>;
    saveCommit: (commit: Commit) => Promise<ContainedModel>;
    getModel: <T extends Model>(id: string) => T | undefined;
    bulkUpdate: (items: Array<ContainedModel>) => Promise<void>;
    saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T & ContainedProps>;
    deleteModel: (id: string) => Promise<string>;
    saveManuscript: (data: Partial<Manuscript>) => Promise<undefined>;
    getInvitation: (invitingUserID: string, invitedEmail: string) => Promise<ContainerInvitation>;
}
export {};
