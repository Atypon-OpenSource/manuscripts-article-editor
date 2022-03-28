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
import { ManuscriptNode, Selected } from '@manuscripts/manuscript-transform';
import { CommentAnnotation, Keyword, UserProfile } from '@manuscripts/manuscripts-json-schema';
import { EditorState, Transaction } from 'prosemirror-state';
import React from 'react';
import * as Pattern from './CommentListPatterns';
interface Props {
    comments: CommentAnnotation[];
    createKeyword: (name: string) => Promise<Keyword>;
    saveModel: (model: CommentAnnotation) => Promise<CommentAnnotation>;
    deleteModel: (id: string) => Promise<string>;
    doc: ManuscriptNode;
    getCollaborator: (id: string) => UserProfile | undefined;
    getCollaboratorById: (id: string) => UserProfile | undefined;
    getCurrentUser: () => UserProfile;
    getKeyword: (id: string) => Keyword | undefined;
    listCollaborators: () => UserProfile[];
    listKeywords: () => Keyword[];
    selected: Selected | null;
    commentTarget?: string;
    setCommentTarget: (commentTarget?: string) => void;
    state: EditorState;
    dispatch: (tr: Transaction) => EditorState | void;
    setCommentFilter: (selectResolved: Pattern.CommentFilter) => void;
    commentFilter: Pattern.CommentFilter;
}
export declare const CommentList: React.FC<Props>;
export {};
