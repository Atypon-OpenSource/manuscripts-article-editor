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
import 'intl-pluralrules';
import React from 'react';
export declare const SignInMessage: () => JSX.Element;
export declare const SignOutMessage: () => JSX.Element;
export declare const ManageProfileMessage: () => JSX.Element;
export declare const PreferencesMessage: () => JSX.Element;
export declare const ManuscriptsTitleMessage: () => JSX.Element;
export declare const EmptyManuscriptsMessage: () => JSX.Element;
export declare const ImportManuscriptMessage: () => JSX.Element;
export declare const ChangePasswordMessage: () => JSX.Element;
export declare const DeleteAccountMessage: () => JSX.Element;
export declare const SelectCollaboratorMessage: () => JSX.Element;
export declare const AddCollaboratorsMessage: () => JSX.Element;
export declare const AddedCollaboratorsMessage: React.FunctionComponent<{
    addedCount: number;
}>;
export declare const AddAuthorsMessage: () => JSX.Element;
export declare const SelectAuthorMessage: () => JSX.Element;
export declare const AddedAuthorsMessage: React.FunctionComponent<{
    addedCount: number;
}>;
export declare const CheckCollaboratorsSearchMessage: React.FunctionComponent<{
    searchText: string;
}>;
export declare const InviteCollaboratorsMessage: () => JSX.Element;
export declare const FeedbackMessage: () => JSX.Element;
export declare const ProjectRenameMessage: () => JSX.Element;
export declare const acceptInvitationErrorMessage: (status: number) => "Invitation is no longer valid." | "Project no longer exists." | "There was an error accepting the invitation.";
export declare const acceptInvitationTokenErrorMessage: (status: number) => "Invitation is no longer valid." | "Project no longer exists." | "There was an error accepting the invitation.";
