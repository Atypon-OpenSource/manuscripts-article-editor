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
import { Affiliation, Contributor, ContributorRole, Project, UserProfile } from '@manuscripts/manuscripts-json-schema';
import { AuthorAffiliation, AuthorValues } from '@manuscripts/style-guide';
import React from 'react';
import { AffiliationMap } from '../../lib/authors';
import { TokenActions } from '../../store';
import { InvitationValues } from '../collaboration/InvitationForm';
export declare const ScrollableModalMain: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
interface AuthorsProps {
    authors: Contributor[];
    authorAffiliations: Map<string, AuthorAffiliation[]>;
    affiliations: AffiliationMap;
    selectedAuthor: Contributor | null;
    isRemoveAuthorOpen: boolean;
    project: Project;
    removeAuthor: (data: Contributor) => void;
    selectAuthor: (data: Contributor) => void;
    updateAuthor: (author: Contributor, email: string) => void;
    openAddAuthors: () => void;
    addAuthorAffiliation: (affiliation: Affiliation | string) => void;
    removeAuthorAffiliation: (affiliation: Affiliation) => void;
    updateAffiliation: (affiliation: Affiliation) => void;
    isRejected: (invitationID: string) => boolean;
    getAuthorName: (author: Contributor) => string;
    handleSaveAuthor: (values: AuthorValues) => Promise<void>;
    handleRemoveAuthor: () => void;
    handleDrop: (oldIndex: number, newIndex: number) => void;
    getSidebarItemDecorator?: (authorID: string) => JSX.Element | null;
    tokenActions: TokenActions;
    invitationSent: boolean;
    handleDismiss: () => void;
    contributorRoles: ContributorRole[];
    createContributorRole: (name: string) => Promise<ContributorRole>;
    allowInvitingAuthors: boolean;
}
export declare const AuthorsModal: React.FunctionComponent<AuthorsProps>;
interface AddAuthorsProps {
    nonAuthors: UserProfile[];
    authors: Contributor[];
    numberOfAddedAuthors: number;
    searchingAuthors: boolean;
    searchText: string;
    addedAuthors: string[];
    searchResults: UserProfile[];
    isCreateAuthorOpen: boolean;
    isAuthorExist: () => boolean;
    handleAddingDoneCancel: () => void;
    handleSearchChange: (event: React.FormEvent<HTMLInputElement>) => void;
    handleSearchFocus: () => void;
    handleInvite: (searchText: string) => void;
    handleCreateAuthor: () => void;
    createAuthor: (priority: number, person?: UserProfile, name?: string, invitationID?: string) => void;
}
export declare const AddAuthorsModal: React.FunctionComponent<AddAuthorsProps>;
interface InviteAuthorsProps {
    invitationValues: InvitationValues;
    handleInviteCancel: () => void;
    handleInvitationSubmit: (values: InvitationValues) => Promise<void>;
    invitationSent: boolean;
}
export declare const InviteAuthorsModal: React.FunctionComponent<InviteAuthorsProps>;
export {};
