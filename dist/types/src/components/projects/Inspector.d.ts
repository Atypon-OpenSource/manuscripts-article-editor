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
import { ActualManuscriptNode, ContainedModel, ManuscriptEditorView, Selected } from '@manuscripts/manuscript-transform';
import { Bundle, CommentAnnotation, Keyword, Manuscript, ManuscriptNote, Project, Section, Submission, Tag, UserProfile } from '@manuscripts/manuscripts-json-schema';
import { Transaction } from 'prosemirror-state';
import React from 'react';
import { AnyElement } from '../inspector/ElementStyleInspector';
import { SaveModel } from './ManuscriptInspector';
export declare const Inspector: React.FC<{
    bundle?: Bundle;
    comments?: CommentAnnotation[];
    commentTarget?: string;
    createKeyword: (name: string) => Promise<Keyword>;
    dispatchNodeAttrs: (id: string, attrs: Record<string, unknown>, nodispatch?: boolean) => Transaction | undefined;
    dispatchUpdate: () => void;
    doc: ActualManuscriptNode;
    element?: AnyElement;
    getCollaborator: (id: string) => UserProfile | undefined;
    getCollaboratorById: (id: string) => UserProfile | undefined;
    getCurrentUser: () => UserProfile;
    getKeyword: (id: string) => Keyword | undefined;
    listCollaborators: () => UserProfile[];
    listKeywords: () => Keyword[];
    notes?: ManuscriptNote[];
    noteTarget?: string;
    openCitationStyleSelector: () => void;
    saveManuscript: (data: Partial<Manuscript>) => Promise<void>;
    project: Project;
    saveModel: SaveModel;
    section?: Section;
    selected: Selected | null;
    selectedSection?: Selected;
    setCommentTarget: () => void;
    submission?: Submission;
    view: ManuscriptEditorView;
    tags: Tag[];
    manageManuscript: boolean;
    bulkUpdate: (items: Array<ContainedModel>) => Promise<void>;
    openTemplateSelector: (newProject: boolean, switchTemplate?: boolean) => void;
}>;
