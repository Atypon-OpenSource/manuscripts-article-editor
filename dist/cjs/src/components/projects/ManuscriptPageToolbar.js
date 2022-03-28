"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManuscriptPageToolbar = exports.EditorType = void 0;
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const style_guide_1 = require("@manuscripts/style-guide");
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importDefault(require("react"));
var EditorType;
(function (EditorType) {
    EditorType["manuscript"] = "manuscript";
    EditorType["title"] = "title";
})(EditorType = exports.EditorType || (exports.EditorType = {}));
const config_1 = __importDefault(require("../../config"));
exports.ManuscriptPageToolbar = react_1.default.memo(({ editor, view }) => {
    const can = style_guide_1.usePermissions();
    switch (editor) {
        case EditorType.manuscript:
            return can.seeEditorToolbar ? (react_1.default.createElement(manuscript_editor_1.ManuscriptToolbar, { can: can, view: view, state: view.state, dispatch: view.dispatch, footnotesEnabled: config_1.default.features.footnotes })) : null;
        case EditorType.title:
            return react_1.default.createElement(title_editor_1.TitleToolbar, { view: view });
        default:
            return null;
    }
});
//# sourceMappingURL=ManuscriptPageToolbar.js.map