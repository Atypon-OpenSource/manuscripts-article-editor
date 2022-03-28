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
exports.Page = exports.Centered = exports.Main = void 0;
require("@manuscripts/style-guide/styles/tip.css");
const AppIcon_1 = __importDefault(require("@manuscripts/assets/react/AppIcon"));
const ContributorsIcon_1 = __importDefault(require("@manuscripts/assets/react/ContributorsIcon"));
const EditProjectIcon_1 = __importDefault(require("@manuscripts/assets/react/EditProjectIcon"));
const ReferenceLibraryIcon_1 = __importDefault(require("@manuscripts/assets/react/ReferenceLibraryIcon"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const react_helmet_1 = require("react-helmet");
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../config"));
const title_1 = require("../lib/title");
const Chatbox_1 = require("./Chatbox");
const MenuBar_1 = __importDefault(require("./nav/MenuBar"));
const OfflineIndicator_1 = __importDefault(require("./OfflineIndicator"));
const ProjectNavigator_1 = __importDefault(require("./ProjectNavigator"));
const Support_1 = require("./Support");
exports.Main = styled_components_1.default.main `
  height: 100%;
  flex: 1;
  position: relative;
  box-sizing: border-box;
`;
exports.Centered = styled_components_1.default(exports.Main) `
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;
const PageContainer = styled_components_1.default.div `
  display: flex;
  height: calc(100vh - 1px); /* allow 1px for the top border */
  box-sizing: border-box;
  color: ${(props) => props.theme.colors.text.primary};
  font-family: ${(props) => props.theme.font.family.sans};
  // border-top: 1px solid ${(props) => props.theme.colors.background.info};
`;
const ViewsBar = styled_components_1.default.div `
  align-items: center;
  background-color: ${(props) => props.theme.colors.border.tertiary};
  display: flex;
  height: 100%;
  flex-direction: column;
  width: 56px;
`;
const IconBar = styled_components_1.default.div `
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;

  div {
    margin: ${(props) => props.theme.grid.unit * 5}px 0 0;
    text-align: center;
    width: 56px;
  }
`;
const ViewLink = styled_components_1.default(react_router_dom_1.NavLink) `
  align-items: center;
  color: ${(props) => props.theme.colors.button.secondary.color.default};
  display: flex;
  justify-content: center;
  width: 100%;
  height: ${(props) => props.theme.grid.unit * 8}px;

  &:hover {
    color: ${(props) => props.theme.colors.brand.medium};
  }
  &.active {
    color: ${(props) => props.theme.colors.brand.medium};
    background: ${(props) => props.theme.colors.brand.xlight};
  }
`;
const ViewsSeparator = styled_components_1.default.div `
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  width: ${(props) => props.theme.grid.unit * 7}px;
`;
const StyledEditProjectIcon = styled_components_1.default(EditProjectIcon_1.default) `
  g {
    stroke: currentColor;
  }
`;
const ProjectLibraryIcon = styled_components_1.default(ReferenceLibraryIcon_1.default) `
  path {
    stroke: currentColor;
  }
`;
const ProjectContributorsIcon = styled_components_1.default(ContributorsIcon_1.default) `
  path {
    stroke: currentColor;
  }

  circle {
    stroke: currentColor;
  }
`;
const Page = ({ children, project, tokenActions, }) => (react_1.default.createElement(PageContainer, null,
    react_1.default.createElement(react_helmet_1.Helmet, null, project ? (react_1.default.createElement("title", null,
        "Manuscripts.io:",
        ' ',
        project.title ? title_1.titleText(project.title) : 'Untitled Project')) : (react_1.default.createElement("title", null, "Manuscripts.io"))),
    project && (react_1.default.createElement(ViewsBar, null,
        react_1.default.createElement(ProjectNavigator_1.default, null),
        config_1.default.leanWorkflow.enabled || config_1.default.native || (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(MenuBar_1.default, { tokenActions: tokenActions },
                react_1.default.createElement(style_guide_1.Tip, { title: 'Home', placement: 'right' },
                    react_1.default.createElement(OfflineIndicator_1.default, null,
                        react_1.default.createElement(AppIcon_1.default, { width: 34, height: 34 })))),
            react_1.default.createElement(ViewsSeparator, null))),
        react_1.default.createElement(IconBar, null,
            react_1.default.createElement(style_guide_1.Tip, { title: 'Edit ⌥⌘3', placement: 'right' },
                react_1.default.createElement(ViewLink, { to: `/projects/${project._id}`, isActive: (match, location) => /^\/projects\/.+?\/manuscripts\/.+/.test(location.pathname) },
                    react_1.default.createElement(StyledEditProjectIcon, null))),
            react_1.default.createElement(style_guide_1.Tip, { title: 'Library ⌥⌘4', placement: 'right' },
                react_1.default.createElement(ViewLink, { to: `/projects/${project._id}/library` },
                    react_1.default.createElement(ProjectLibraryIcon, null))),
            config_1.default.leanWorkflow.enabled || config_1.default.local || (react_1.default.createElement(style_guide_1.Tip, { title: 'Collaborators ⌥⌘5', placement: 'right' },
                react_1.default.createElement(ViewLink, { to: `/projects/${project._id}/collaborators`, exact: true },
                    react_1.default.createElement(ProjectContributorsIcon, { "data-cy": 'collaborators' }))))),
        react_1.default.createElement(Support_1.Support, null))),
    config_1.default.crisp.id && react_1.default.createElement(Chatbox_1.Chatbox, null),
    children));
exports.Page = Page;
//# sourceMappingURL=Page.js.map