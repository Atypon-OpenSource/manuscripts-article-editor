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
import { Build, ManuscriptEditorView, ManuscriptNode, ManuscriptSchema } from '@manuscripts/manuscript-transform';
import { Model } from '@manuscripts/manuscripts-json-schema';
import { SubmissionAttachment } from '@manuscripts/style-guide';
import { EditorState, Transaction } from 'prosemirror-state';
declare const useTrackedModelManagement: (doc: ManuscriptNode, view: ManuscriptEditorView | undefined, state: EditorState<ManuscriptSchema>, dispatch: (tr: Transaction<any>) => EditorState<ManuscriptSchema>, saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>, deleteModel: (id: string) => Promise<string>, finalModelMap: Map<string, Model>, getAttachments: () => SubmissionAttachment[]) => {
    saveTrackModel: <T_1 extends Model>(model: T_1 | Build<T_1> | Partial<T_1>) => Promise<T_1 | Build<T_1> | Partial<T_1>>;
    deleteTrackModel: (id: string) => Promise<string>;
    trackModelMap: Map<string, Model>;
    getTrackModel: (id: string) => Model | undefined;
};
export default useTrackedModelManagement;
