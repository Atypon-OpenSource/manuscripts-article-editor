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
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
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
exports.Picker = exports.groupManuscripts = void 0;
// @TODO Consider creating a separate presentational component
// @TODO Check if <Item onClick> callback should be moved out as a named callback
const LogotypeColor_1 = __importDefault(require("@manuscripts/assets/react/LogotypeColor"));
const style_guide_1 = require("@manuscripts/style-guide");
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Dropdown_1 = require("../components/nav/Dropdown");
const Sidebar_1 = require("../components/Sidebar");
const config_1 = __importDefault(require("../config"));
const use_picker_contributors_data_1 = require("../hooks/use-picker-contributors-data");
const use_picker_manuscript_docs_1 = require("../hooks/use-picker-manuscript-docs");
const api_1 = require("../lib/api");
const store_1 = require("../store");
const DropdownMenu_1 = require("./DropdownMenu");
const Filter_1 = require("./Filter");
// type ProjectSelectable = Project
const lowestPriorityFirst = (a, b) => {
    if (a.priority === b.priority) {
        return a.createdAt - b.createdAt;
    }
    return Number(a.priority) - Number(b.priority);
};
const alphabetical = (a, b) => {
    if (!a.title) {
        return 1;
    }
    if (!b.title) {
        return -1;
    }
    return a.title.localeCompare(b.title);
};
// Creating and array of string representing project names and manuscripts following that name
// e.g.: ['My project', Manuscript, Manuscript, 'Other Project', Manuscript, Manuscript, Manuscript]
const groupManuscripts = (manuscripts, projects) => {
    const names = projects.reduce((acc, project) => {
        acc[project._id] = project.title || 'Untitled Project';
        return acc;
    }, {});
    const groups = manuscripts.reduce((acc, item) => {
        const key = names[item.containerID];
        acc[key] = acc[key] || [];
        acc[key].push(item);
        return acc;
    }, {});
    return Object.keys(groups).reduce((acc, item) => {
        acc.push(item);
        acc.push(...groups[item].sort(lowestPriorityFirst));
        return acc;
    }, []);
};
exports.groupManuscripts = groupManuscripts;
const Picker = () => {
    const selectManuscript = react_1.useCallback((manuscript, project) => {
        const targetOrigin = window.parent.origin;
        // validate target origin against whitelist from config
        if (!config_1.default.picker.origins.includes(targetOrigin)) {
            throw new Error('Origin not whitelisted');
        }
        api_1.fetchProjectScopedToken(project._id, 'export')
            .then((token) => {
            window.parent.postMessage({ type: 'selected-manuscript', manuscript, project, token }, targetOrigin);
        })
            .catch((error) => {
            console.error(error); // tslint:disable-line:no-console
        });
    }, []);
    const { data: contributors } = use_picker_contributors_data_1.usePickerContributorsData();
    const { data: manuscripts } = use_picker_manuscript_docs_1.usePickerManuscriptDocs();
    const maybeGroup = (items, projects) => {
        if (!selectedMenuProject) {
            exports.groupManuscripts(items, projects);
        }
        return items.sort(lowestPriorityFirst);
    };
    const closeWindow = () => {
        const targetOrigin = window.parent.origin;
        window.parent.postMessage({ type: 'close-window' }, targetOrigin);
    };
    const [selectedProject, setSelectedProject] = react_1.useState();
    const [selectedMenuProject, setSelectedMenuProject,] = react_1.useState();
    const [selectedManuscript, setSelectedManuscript] = react_1.useState();
    const [projects] = store_1.useStore((store) => store.projects);
    return (react_1.default.createElement(style_guide_1.StyledModal, { isOpen: true, shouldCloseOnOverlayClick: false },
        react_1.default.createElement(style_guide_1.ModalContainer, null,
            react_1.default.createElement(style_guide_1.ModalHeader, null,
                react_1.default.createElement(style_guide_1.CloseButton, { onClick: closeWindow, "data-cy": 'modal-close-button' })),
            react_1.default.createElement(Box, null,
                react_1.default.createElement(Row, null,
                    react_1.default.createElement(Column, null,
                        react_1.default.createElement(Heading, null,
                            react_1.default.createElement(LogotypeColor_1.default, { style: { maxWidth: '100%' } })),
                        react_1.default.createElement(Item, { onClick: () => {
                                setSelectedMenuProject(null);
                                setSelectedManuscript(undefined);
                            }, selected: !selectedMenuProject }, "All manuscripts"),
                        [...projects].sort(alphabetical).map((project) => (react_1.default.createElement(Item, { key: project._id, onClick: () => {
                                setSelectedMenuProject(project);
                                setSelectedProject(undefined);
                                setSelectedManuscript(undefined);
                            }, selected: selectedMenuProject === project }, project.title ? (react_1.default.createElement(title_editor_1.Title, { value: project.title })) : (react_1.default.createElement(Dropdown_1.PlaceholderTitle, { value: 'Untitled Project' })))))),
                    react_1.default.createElement(ProjectsColumn, null, projects.length && (manuscripts === null || manuscripts === void 0 ? void 0 : manuscripts.length) && (react_1.default.createElement(Filter_1.Filter, { rows: manuscripts.filter((manuscript) => selectedMenuProject
                            ? manuscript.containerID === selectedMenuProject._id
                            : true) }, (filtered) => {
                        return maybeGroup(filtered, projects).map((manuscript) => {
                            if (typeof manuscript === 'string') {
                                return (react_1.default.createElement(TitleItem, { key: manuscript }, manuscript));
                            }
                            return (react_1.default.createElement(Item, { key: manuscript._id, onClick: () => {
                                    setSelectedManuscript(manuscript);
                                    setSelectedProject(projects.find((project) => manuscript.containerID === project._id));
                                }, selected: selectedManuscript === manuscript },
                                react_1.default.createElement(IconWrapper, null,
                                    react_1.default.createElement(style_guide_1.ProjectIcon, { color: "#FDCD47" })),
                                react_1.default.createElement(ItemContent, null,
                                    manuscript.title ? (react_1.default.createElement(title_editor_1.Title, { value: manuscript.title })) : (react_1.default.createElement(Dropdown_1.PlaceholderTitle, { value: 'Untitled Manuscript' })),
                                    react_1.default.createElement(Contributors, null, contributors &&
                                        contributors
                                            .filter((contributor) => contributor.manuscriptID ===
                                            manuscript._id)
                                            .sort(lowestPriorityFirst)
                                            .map((contributor) => `${contributor.bibliographicName.given} ${contributor.bibliographicName.family}`)))));
                        });
                    })))),
                react_1.default.createElement(Footer, null,
                    react_1.default.createElement(DropdownMenu_1.DropdownMenu, null),
                    react_1.default.createElement(Actions, null,
                        react_1.default.createElement(style_guide_1.SecondaryButton, { onClick: closeWindow }, "Close"),
                        react_1.default.createElement(style_guide_1.PrimaryButton, { disabled: !selectedProject || !selectedManuscript, onClick: () => {
                                if (selectedProject && selectedManuscript) {
                                    selectManuscript(selectedManuscript, selectedProject);
                                }
                            } }, "Export")))))));
};
exports.Picker = Picker;
const Row = styled_components_1.default.div `
  min-height: 0;
  display: flex;
  flex: 1;
`;
const Footer = styled_components_1.default.footer `
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px -2px 12px rgba(216, 216, 216, 0.2);
  padding: 16px;
`;
const Box = styled_components_1.default(Sidebar_1.ModalBody) `
  overflow: hidden;
  display: flex;
  flex-flow: column;
  height: 615px;
  max-height: 100%;
  max-width: 790px;
`;
const Column = styled_components_1.default.div `
  flex: 1;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  text-overflow: ellipsis;
  display: flex;
  flex-direction: column;

  &:first-child {
    min-width: 260px;
    max-width: 33%;
    background: #fafafa;
  }

  &:not(:last-child) {
    border-right: 1px solid #ddd;
  }
`;
const Item = styled_components_1.default.div `
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: flex-start;

  background: ${(props) => (props.selected ? '#F2FBFC' : 'transparent')};
  border-top: ${(props) => (props.selected ? '1px solid #bce7f6' : 'none')}
  border-bottom: ${(props) => (props.selected ? '1px solid #bce7f6' : 'none')}

  &:hover {
    background: ${(props) => (props.selected ? '#F2FBFC' : 'transparent')};
    border-bottom-color: white;
  }
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
`;
const TitleItem = styled_components_1.default(Item) `
  padding: 16px 16px 4px;
  border-bottom: none;
  font-weight: bold;
`;
const ProjectsColumn = styled_components_1.default(Column) `
  padding: 1.5rem;
  ${Item} {
    padding-left: 0;
    padding-right: 0;
  }
`;
const Heading = styled_components_1.default.div `
  font-weight: bold;
  font-size: 200%;
  padding: 8px 16px;
  border-bottom: 1px solid #ddd;
`;
const IconWrapper = styled_components_1.default.span `
  flex: 0 auto;
  margin-right: 0.5em;
`;
const Actions = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-content: center;
  button + button {
    margin-left: 0.5rem;
  }
`;
const Contributors = styled_components_1.default.div `
  margin-top: 0.5rem;
  color: #6e6e6e;
`;
const ItemContent = styled_components_1.default.div `
  color: inherit;
`;
//# sourceMappingURL=Picker.js.map