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
import { Build, ContainedModel } from '@manuscripts/manuscript-transform';
import { Manuscript, Model, Project, Snapshot, UserCollaborator, UserProfile } from '@manuscripts/manuscripts-json-schema';
import { AxiosInstance } from 'axios';
import { ContainedIDs } from '../store';
export default class Api {
    instance: AxiosInstance;
    constructor();
    setToken: (token: string) => void;
    get: <T>(url: string) => Promise<T | null>;
    post: <T>(path: string, data: unknown) => Promise<T | null>;
    delete: <T>(url: string) => Promise<import("axios").AxiosResponse<T>>;
    options: <T>(url: string) => Promise<import("axios").AxiosResponse<T>>;
    put: <T>(path: string, data: unknown) => Promise<import("axios").AxiosResponse<T>>;
    getProject: (projectID: string) => Promise<Project | null>;
    getProjectCollaborators: (projectID: string) => Promise<unknown>;
    getUserProjects: () => Promise<Project[] | null>;
    getUser: () => Promise<UserProfile | null>;
    getProjectModels: <T>(projectID: string, types?: string[]) => Promise<T[] | null>;
    deleteModel: (manuscriptID: string, modelID: string) => Promise<import("axios").AxiosResponse<unknown>>;
    deleteProject: (projectID: string) => Promise<import("axios").AxiosResponse<boolean>>;
    addManuscript: (projectID: string, data: unknown) => Promise<Manuscript | null>;
    getManuscript: (containerID: string, manuscriptID: string) => Promise<Model[] | null>;
    getManuscriptModels: <T>(containerID: string, manuscriptID: string, types: string[]) => Promise<T[] | null>;
    getCollaborators: (containerID: string) => Promise<UserCollaborator[] | null>;
    signUpAndGetToken: (username: string, password: string, name: string) => Promise<string | undefined>;
    saveProject: (projectId: string, models: Model[]) => Promise<unknown>;
    createProject: (title: string) => Promise<Project | null>;
    createNewManuscript: (projectID: string, manuscriptID: string, templateID?: string) => Promise<Manuscript | null>;
    saveProjectData: (projectID: string, data: Array<Build<ContainedModel> & ContainedIDs>) => Promise<(Pick<ContainedModel, never> & {
        _id: string;
        objectType: string;
        contributions?: import("@manuscripts/manuscripts-json-schema").Contribution[] | undefined;
    } & ContainedIDs)[]>;
    saveManuscriptData: (projectID: string, manuscriptID: string, models: Array<Build<ContainedModel>>) => Promise<void>;
    createUser: (email: string, password: string) => Promise<unknown>;
    createSnapshot: (containerID: string, snapshot: Snapshot) => Promise<unknown>;
}
