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
import { ContainerInvitation, Contributor, UserProfile } from '@manuscripts/manuscripts-json-schema';
import { TitleEditorView } from '@manuscripts/title-editor';
import React from 'react';
import { Permissions } from '../../types/permissions';
import { InvitationValues } from '../collaboration/InvitationForm';
export declare const ExpanderButton: import("styled-components").StyledComponent<"button", import("styled-components").DefaultTheme, {
    type: "button" | "submit" | "reset";
} & {
    danger?: boolean | undefined;
    disabled?: boolean | undefined;
    mini?: boolean | undefined;
} & {
    defaultColor?: boolean | undefined;
    size?: number | undefined;
    iconColor?: string | undefined;
} & {
    size: number;
    defaultColor: boolean;
}, "type" | "size" | "defaultColor">;
interface Props {
    saveTitle: (title: string) => void;
    invitations: ContainerInvitation[];
    startEditing: () => void;
    editing: boolean;
    stopEditing: () => void;
    createAuthor: (priority: number, person?: UserProfile, name?: string, invitationID?: string) => void;
    removeAuthor: (data: Contributor) => Promise<void>;
    selectAuthor: (data: Contributor) => void;
    selectedAuthor: string | null;
    expanded: boolean;
    toggleExpanded: () => void;
    addingAuthors: boolean;
    nonAuthors: UserProfile[];
    numberOfAddedAuthors: number;
    addedAuthors: string[];
    isInvite: boolean;
    invitationValues: InvitationValues;
    invitationSent: boolean;
    openAddAuthors: (authors: Contributor[]) => void;
    handleAddingDoneCancel: () => void;
    handleInvite: (searchText: string) => void;
    handleInviteCancel: () => void;
    handleInvitationSubmit: (authors: Contributor[], values: InvitationValues) => Promise<void>;
    handleDrop: (authors: Contributor[], oldIndex: number, newIndex: number) => void;
    updateAuthor: (author: Contributor, email: string) => void;
    handleTitleStateChange: (view: TitleEditorView, docChanged: boolean) => void;
    permissions: Permissions;
    allowInvitingAuthors: boolean;
    showAuthorEditButton: boolean;
    disableEditButton?: boolean;
}
export declare const Metadata: React.FunctionComponent<Props>;
export {};
