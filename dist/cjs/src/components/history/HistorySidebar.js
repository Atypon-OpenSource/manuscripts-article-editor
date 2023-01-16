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
exports.HistorySidebar = void 0;
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importDefault(require("react"));
const PageSidebar_1 = __importDefault(require("../PageSidebar"));
const Sidebar_1 = require("../Sidebar");
const HistorySidebar = ({ project, manuscript, doc, }) => {
    return (react_1.default.createElement(PageSidebar_1.default, { direction: 'row', hideWhen: 'max-width: 900px', minSize: 260, name: 'sidebar', side: 'end', sidebarTitle: react_1.default.createElement(Sidebar_1.SidebarHeader, { title: react_1.default.createElement(title_editor_1.Title, { value: project.title || 'Untitled Project' }) }) },
        react_1.default.createElement(manuscript_editor_1.ManuscriptOutline, { manuscript: manuscript, selected: null, doc: doc })));
};
exports.HistorySidebar = HistorySidebar;
//# sourceMappingURL=HistorySidebar.js.map