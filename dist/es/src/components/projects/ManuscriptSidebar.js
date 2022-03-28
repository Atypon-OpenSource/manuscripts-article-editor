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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const title_editor_1 = require("@manuscripts/title-editor");
const lodash_es_1 = require("lodash-es");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../../config"));
const store_1 = require("../../store");
const AddButton_1 = require("../AddButton");
const ShareProjectButton_1 = __importDefault(require("../collaboration/ShareProjectButton"));
const PageSidebar_1 = __importDefault(require("../PageSidebar"));
const Sidebar_1 = require("../Sidebar");
const SortableManuscript_1 = require("./SortableManuscript");
const CustomizedSidebarHeader = styled_components_1.default.div `
  align-items: flex-start;
  display: flex;
`;
const ProjectTitle = styled_components_1.default.div `
  flex: 1;
  overflow: hidden;
  padding-right: ${(props) => props.theme.grid.unit}px;
  font-size: 24px;
  line-height: 32px;
  user-select: text;

  & .ProseMirror {
    cursor: text;

    &:not(.ProseMirror-focused) {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &.empty-node::before {
      position: absolute;
      color: ${(props) => props.theme.colors.text.muted};
      cursor: text;
      content: 'Untitled Project';
      pointer-events: none;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &.empty-node:hover::before {
      color: ${(props) => props.theme.colors.text.secondary};
    }
  }
`;
const lowestPriorityFirst = (a, b) => {
    if (a.priority === b.priority) {
        return a.createdAt - b.createdAt;
    }
    return Number(a.priority) - Number(b.priority);
};
const ManuscriptSidebar = ({ openTemplateSelector, state, manuscript, view, permissions, project, saveProjectTitle, user, }) => {
    const [{ manuscripts, tokenActions, saveModel }] = store_1.useStore((store) => ({
        manuscripts: store.manuscripts || [],
        saveModel: store.saveModel,
        tokenActions: store.tokenActions,
    }));
    const selected = manuscript_editor_1.findParentNodeWithIdValue(state.selection);
    const [sortedManuscripts, setSortedManuscripts] = react_1.useState();
    react_1.useEffect(() => {
        setSortedManuscripts(manuscripts.sort(lowestPriorityFirst));
    }, [manuscripts]);
    const setIndex = react_1.useCallback((id, index) => {
        const manuscript = manuscripts.find((item) => item._id === id);
        manuscript.priority = index;
        manuscripts.sort(lowestPriorityFirst);
        for (const [index, manuscript] of manuscripts.entries()) {
            if (manuscript.priority !== index) {
                saveModel(Object.assign(Object.assign({}, manuscript), { priority: index })).catch((error) => {
                    console.error(error);
                });
            }
        }
    }, [saveModel, manuscripts]);
    if (!sortedManuscripts) {
        return null;
    }
    return (react_1.default.createElement(PageSidebar_1.default, { direction: 'row', hideWhen: 'max-width: 900px', minSize: 260, name: 'sidebar', side: 'end', sidebarTitle: config_1.default.leanWorkflow.enabled ? (react_1.default.createElement(react_1.default.Fragment, null)) : (react_1.default.createElement(Sidebar_1.SidebarHeader, { title: react_1.default.createElement(CustomizedSidebarHeader, null,
                react_1.default.createElement(ProjectTitle, null, saveProjectTitle ? (react_1.default.createElement(title_editor_1.TitleField, { id: 'project-title-field', 
                    // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                    tabIndex: 1, editable: permissions.write, value: project.title || '', handleChange: lodash_es_1.debounce(saveProjectTitle, 1000) })) : (react_1.default.createElement(title_editor_1.Title, { id: "project-title", editable: false, value: project.title || '' }))),
                react_1.default.createElement(ShareProjectButton_1.default, { project: project, user: user, tokenActions: tokenActions })) })), sidebarFooter: permissions.write && openTemplateSelector ? (react_1.default.createElement(AddButton_1.AddButton, { action: () => openTemplateSelector(false), size: 'small', title: 'New Manuscript' })) : (react_1.default.createElement(react_1.default.Fragment, null)) }, sortedManuscripts.map((item, index) => (react_1.default.createElement(SortableManuscript_1.SortableManuscript, { key: item._id, index: index, item: item, setIndex: setIndex }, selected && item._id === manuscript._id ? (react_1.default.createElement(manuscript_editor_1.ManuscriptOutline, { manuscript: manuscript, doc: (state === null || state === void 0 ? void 0 : state.doc) || null, view: view, selected: selected, permissions: permissions })) : (react_1.default.createElement(manuscript_editor_1.OutlineManuscript, { project: project, manuscript: item })))))));
};
exports.default = ManuscriptSidebar;
//# sourceMappingURL=ManuscriptSidebar.js.map