"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsTab = void 0;
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
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../../../config"));
const store_1 = require("../../../store");
const CommentList_1 = require("./CommentList");
const CommentsTab = ({ selected, editor }) => {
    const [{ notes, user, collaborators, collaboratorsById, keywords, saveTrackModel, // saveTrackModel is only to be used for the models that are ProseMirror representable
    deleteModel, },] = store_1.useStore((store) => ({
        notes: store.notes,
        user: store.user,
        collaborators: store.collaborators || new Map(),
        collaboratorsById: store.collaboratorsById,
        keywords: store.keywords,
        saveTrackModel: store.saveTrackModel,
        deleteModel: store.deleteModel,
    }));
    const createKeyword = (name) => saveTrackModel(manuscript_transform_1.buildKeyword(name));
    const getCollaboratorById = (id) => collaboratorsById && collaboratorsById.get(id);
    const getKeyword = (id) => keywords.get(id);
    const listCollaborators = () => Array.from(collaborators.values());
    const listKeywords = () => Array.from(keywords.values());
    const can = style_guide_1.usePermissions();
    return (react_1.default.createElement(CommentsContainer, null,
        config_1.default.features.commenting && (react_1.default.createElement(style_guide_1.InspectorSection, { title: 'Comments', contentStyles: { margin: '0 25px 24px 0' } },
            react_1.default.createElement(CommentList_1.CommentList, { editor: editor }))),
        config_1.default.features.productionNotes && (react_1.default.createElement(style_guide_1.InspectorSection, { title: 'Notes', contentStyles: { margin: '0 25px 24px 0' } },
            react_1.default.createElement(style_guide_1.ManuscriptNoteList, { createKeyword: createKeyword, notes: notes || [], can: can, currentUserId: user === null || user === void 0 ? void 0 : user._id, getKeyword: getKeyword, listKeywords: listKeywords, selected: selected || null, getCollaboratorById: getCollaboratorById, listCollaborators: listCollaborators, saveModel: saveTrackModel, deleteModel: deleteModel, noteSource: 'EDITOR' })))));
};
exports.CommentsTab = CommentsTab;
const CommentsContainer = styled_components_1.default.div `
  margin-top: ${(props) => props.theme.grid.unit * 4}px;
`;
//# sourceMappingURL=CommentsTab.js.map