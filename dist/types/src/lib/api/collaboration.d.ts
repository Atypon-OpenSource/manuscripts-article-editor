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
interface InvitedUser {
    email: string;
    name?: string;
}
export declare const requestProjectInvitationToken: (projectID: string, role: string) => Promise<import("axios").AxiosResponse<{
    token: string;
}>>;
export declare const acceptProjectInvitationToken: (token: string) => Promise<import("axios").AxiosResponse<{
    containerID: string;
    message: string;
}>>;
export declare const addProjectUser: (projectID: string, role: string, userID: string) => Promise<import("axios").AxiosResponse<any>>;
export declare const projectInvite: (projectID: string, invitedUsers: InvitedUser[], role: string, message?: string) => Promise<import("axios").AxiosResponse<any>>;
export declare const updateUserRole: (projectID: string, newRole: string | null, userID: string) => Promise<import("axios").AxiosResponse<any>>;
export declare const projectUninvite: (invitationId: string) => Promise<import("axios").AxiosResponse<any>>;
export declare const acceptProjectInvitation: (invitationId: string) => Promise<import("axios").AxiosResponse<{
    containerID: string;
    message: string;
}>>;
export declare const rejectProjectInvitation: (invitationId: string) => Promise<import("axios").AxiosResponse<any>>;
export {};
