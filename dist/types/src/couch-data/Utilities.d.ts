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
import { Attachment, Build, ContainedModel, ManuscriptModel } from '@manuscripts/manuscript-transform';
import { Bundle, ContainerInvitation, Manuscript, ManuscriptTemplate, Model, Project, Snapshot, UserProfile } from '@manuscripts/manuscripts-json-schema';
import { RxDatabase } from '@manuscripts/rxdb';
import { Commit } from '@manuscripts/track-changes';
import { ContainedIDs } from '../store';
import { Collection } from '../sync/Collection';
export default class Utilities {
    bundle: Bundle | null;
    collection: Collection<ContainedModel>;
    userCollection: Collection<ContainedModel>;
    setModelsState: (modelMap: Map<string, Model>) => void;
    manuscriptID: string;
    containerID: string;
    snapshots: Snapshot[];
    commits: Commit[];
    db: RxDatabase<any>;
    constructor(db: RxDatabase<any>);
    init: (userID: string) => Promise<void>;
    saveDependenciesForNew: (dependencies: Array<Build<ContainedModel> & ContainedIDs>, collection: Collection<ContainedModel | ManuscriptModel>) => Promise<void>;
    saveNewManuscript: (dependencies: Array<Build<ContainedModel> & ContainedIDs>, containerID: string, manuscript: Build<Manuscript>, newProject?: Build<Project> | undefined) => Promise<Build<Manuscript>>;
    updateManuscriptTemplate: (dependencies: Array<Build<ContainedModel> & ContainedIDs>, containerID: string, manuscript: Manuscript, updatedModels: ManuscriptModel[]) => Promise<Manuscript>;
    getUserTemplates: () => Promise<{
        userTemplates: ManuscriptTemplate[];
        userTemplateModels: ManuscriptModel[];
    }>;
    createUser: (profile: Build<UserProfile>) => Promise<void>;
    getAttachment: (id: string, attachmentID: string) => Promise<Blob | undefined>;
    putAttachment: (id: string, attachment: Attachment) => Promise<undefined>;
    getInvitation: (invitingUserID: string, invitedEmail: string) => Promise<ContainerInvitation>;
    getTools: () => {
        getInvitation: (invitingUserID: string, invitedEmail: string) => Promise<ContainerInvitation>;
        putAttachment: (id: string, attachment: Attachment) => Promise<undefined>;
        getAttachment: (id: string, attachmentID: string) => Promise<Blob | undefined>;
        createUser: (profile: Build<UserProfile>) => Promise<void>;
        updateManuscriptTemplate: (dependencies: Array<Build<ContainedModel> & ContainedIDs>, containerID: string, manuscript: Manuscript, updatedModels: ManuscriptModel[]) => Promise<Manuscript>;
        saveNewManuscript: (dependencies: Array<Build<ContainedModel> & ContainedIDs>, containerID: string, manuscript: Build<Manuscript>, newProject?: Build<Project> | undefined) => Promise<Build<Manuscript>>;
    };
}
