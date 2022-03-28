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
import { Build } from '@manuscripts/manuscript-transform';
import { ContainerInvitation, Contributor, ContributorRole, Manuscript, Model, Project, UserProfile } from '@manuscripts/manuscripts-json-schema';
import { AuthorAffiliation } from '@manuscripts/style-guide';
import React from 'react';
import { AffiliationMap } from '../../lib/authors';
import { TokenActions } from '../../store';
interface State {
    isRemoveAuthorOpen: boolean;
    invitationSent: boolean;
}
interface Props {
    project: Project;
    manuscript: Manuscript;
    authors: Contributor[];
    invitations: ContainerInvitation[];
    authorAffiliations: Map<string, AuthorAffiliation[]>;
    affiliations: AffiliationMap;
    selectedAuthor: string | null;
    removeAuthor: (data: Contributor) => Promise<void>;
    updateAuthor: (author: Contributor, email: string) => void;
    selectAuthor: (data: Contributor) => void;
    saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>;
    openAddAuthors: () => void;
    handleDrop: (authors: Contributor[], oldIndex: number, newIndex: number) => void;
    tokenActions: TokenActions;
    invitationSent: boolean;
    createAuthor: (priority: number, person?: UserProfile | null, name?: string, invitationID?: string) => void;
    contributorRoles: ContributorRole[];
    allowInvitingAuthors?: boolean;
}
declare class AuthorsModalContainer extends React.Component<Props, State> {
    state: {
        isRemoveAuthorOpen: boolean;
        invitationSent: boolean;
    };
    componentDidMount(): void;
    render(): JSX.Element;
    private createContributorRole;
    private handleRemoveAuthor;
    private handleDismiss;
    private removeAuthor;
    private getAuthorName;
    private isRejected;
    private getSidebarItemDecorator;
    private handleSaveAuthor;
    private addAuthorAffiliation;
    private removeAuthorAffiliation;
    private updateAffiliation;
    private getSelectedAuthor;
    private handleDrop;
    private createEmptyAuthor;
}
export default AuthorsModalContainer;
