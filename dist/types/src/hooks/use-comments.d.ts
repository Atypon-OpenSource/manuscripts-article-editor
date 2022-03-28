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
import { Build, ManuscriptEditorState, ManuscriptSchema, UserProfileWithAvatar } from '@manuscripts/manuscript-transform';
import { CommentAnnotation, Contribution } from '@manuscripts/manuscripts-json-schema';
import { Annotation } from '@manuscripts/track-changes';
import { Command } from 'prosemirror-commands';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { CommentFilter } from '../components/projects/CommentListPatterns';
interface UnsavedComment extends Build<CommentAnnotation> {
    contributions: Contribution[];
}
declare type CommentState = Array<{
    comment: CommentAnnotation | UnsavedComment;
    annotation?: Annotation;
    saveStatus: string;
}>;
export declare const getInitialCommentState: (comments: CommentAnnotation[], annotations: Annotation[]) => CommentState;
export declare const updateComment: (id: string, commentData?: Partial<CommentAnnotation> | undefined, status?: string | undefined) => (current: CommentState) => CommentState;
export declare const insertCommentFromAnnotation: (annotation: Annotation, doc: ProsemirrorNode<ManuscriptSchema>, user: UserProfileWithAvatar) => (current: CommentState) => CommentState;
export declare const insertCommentReply: (target: string, user: UserProfileWithAvatar) => (current: CommentState) => CommentState;
export declare const removeComment: (id: string) => (current: CommentState) => CommentState;
export declare const topLevelComments: (state: CommentState, filter?: CommentFilter | undefined) => CommentState;
export declare const repliesOf: (state: CommentState, parentID: string) => CommentState;
export declare const isSavedComment: (comment: CommentAnnotation | UnsavedComment) => comment is CommentAnnotation;
export declare const getUnsavedComment: (state: CommentState) => string | null;
export declare const getHighlightColor: (state: CommentState, comment: CommentAnnotation | UnsavedComment) => string | undefined;
export declare const useNewAnnotationEffect: (effect: (annotation: Annotation) => void, annotations: Annotation[]) => void;
export declare const useComments: (comments: CommentAnnotation[], userProfile: UserProfileWithAvatar, editorState: ManuscriptEditorState, doCommand: (command: Command) => void) => {
    items: CommentState;
    focusedItem: string | null;
    saveComment: (comment: UnsavedComment | CommentAnnotation) => Promise<CommentAnnotation>;
    deleteComment: (id: string) => void;
    handleCreateReply: (id: string) => void;
    handleRequestSelect: (target: string) => void;
};
export {};
