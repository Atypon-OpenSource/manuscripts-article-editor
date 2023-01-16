/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
import { UserProfile } from '@manuscripts/manuscripts-json-schema';
import { CommentWithUserColor, ICreateCommentRequest, IUpdateCommentRequest, UserWithColor } from '@manuscripts/quarterback-types';
interface CommentState {
    commentsMap: Map<string, CommentWithUserColor>;
    changeComments: Map<string, CommentWithUserColor[]>;
    userColorsMap: Map<string, string>;
    usersMap: Map<string, UserWithColor>;
    openCommentLists: Set<string>;
}
export declare const useCommentStore: import("zustand").UseBoundStore<import("zustand").StoreApi<Omit<CommentState, "init" | "setUsers" | "toggleCommentListOpen" | "listComments" | "createComment" | "updateComment" | "deleteComment"> & {
    init(): void;
    setUsers(collaboratorsById: Map<string, UserProfile>): void;
    toggleCommentListOpen: (id: string) => void;
    listComments: (docId: string) => Promise<import("@manuscripts/quarterback-types").Maybe<import("@manuscripts/quarterback-types").IListCommentsResponse>>;
    createComment: (payload: ICreateCommentRequest, user: UserWithColor) => Promise<import("@manuscripts/quarterback-types").Maybe<import("@manuscripts/quarterback-types").ManuscriptComment>>;
    updateComment: (commentId: string, values: IUpdateCommentRequest) => Promise<import("@manuscripts/quarterback-types").Maybe<boolean>>;
    deleteComment: (snapId: string) => Promise<import("@manuscripts/quarterback-types").Maybe<boolean>>;
}>>;
export {};
