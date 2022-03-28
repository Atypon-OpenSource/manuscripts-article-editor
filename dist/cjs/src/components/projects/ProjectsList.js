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
exports.ProjectsList = void 0;
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const collaborators_1 = require("../../lib/collaborators");
const projects_1 = require("../../lib/projects");
const store_1 = require("../../store");
const AcceptedLabel_1 = __importDefault(require("../AcceptedLabel"));
const ShareProjectButton_1 = __importDefault(require("../collaboration/ShareProjectButton"));
const ProjectContextMenuButton_1 = __importDefault(require("./ProjectContextMenuButton"));
const SidebarProject = styled_components_1.default.div `
  border-bottom: 1px solid;
  border-top: 1px solid;
  background-color: ${(props) => props.isActive ? props.theme.colors.background.fifth : 'transparent'};
  border-color: ${(props) => props.isActive ? props.theme.colors.border.primary : 'transparent'};
  border-radius: 0;
  ${(props) => !props.isActive &&
    'box-shadow: 0 1px 0 0 ' + props.theme.colors.border.secondary};
  box-sizing: border-box;
  cursor: pointer;
  padding: ${(props) => props.theme.grid.unit * 4}px;
  width: 100%;
  max-width: 564px;

  &:hover {
    box-shadow: unset;
    background-color: ${(props) => props.theme.colors.background.fifth};
  }
`;
const SidebarProjectHeader = styled_components_1.default.div `
  display: flex;
  align-items: center;
  @media (max-width: 450px) {
    margin-left: ${(props) => props.theme.grid.unit * 2}px;
  }
`;
const ProjectTitle = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.xlarge};
  font-weight: ${(props) => props.theme.font.weight.medium};
  font-style: normal;
  flex: 1;
`;
const ProjectContributors = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.medium};
  margin-top: ${(props) => props.theme.grid.unit * 2}px;

  @media (max-width: 450px) {
    margin-left: ${(props) => props.theme.grid.unit * 2}px;
  }
`;
const PlaceholderTitle = styled_components_1.default(title_editor_1.Title) `
  color: ${(props) => props.theme.colors.text.secondary};
`;
const ProjectContributor = styled_components_1.default.span ``;
const Edit = styled_components_1.default.div `
  button {
    padding: ${(props) => props.theme.grid.unit * 2}px;
  }

  svg {
    g[fill] {
      fill: ${(props) => props.theme.colors.brand.medium};
    }
  }
`;
const Container = styled_components_1.default.div `
  display: flex;
  align-items: center;
  @media (max-width: 450px) {
    margin-left: ${(props) => props.theme.grid.unit * 2}px;
  }
`;
const initials = (name) => name.given
    ? name.given
        .split(' ')
        .map((part) => part.substr(0, 1).toUpperCase() + '.')
        .join('')
    : '';
const ProjectsList = ({ closeModal, deleteProject, projects, saveProjectTitle, user, acceptedInvitations, }) => {
    const [collaboratorProfiles] = store_1.useStore((store) => store.collaboratorsProfiles || new Map());
    const [tokenData] = store_1.useStore((store) => store.tokenData);
    const tokenActions = tokenData.getTokenActions();
    return (react_1.default.createElement("div", null, projects.sort(projects_1.projectListCompare).map((project) => {
        const path = `/projects/${project._id}`;
        return (react_1.default.createElement(react_router_dom_1.Route, { path: path, exact: false, key: project._id }, ({ history, match }) => {
            return (react_1.default.createElement(SidebarProject, { key: project._id, isActive: match !== null, onClick: () => {
                    closeModal && closeModal();
                    history.push(path);
                } },
                react_1.default.createElement(SidebarProjectHeader, null,
                    react_1.default.createElement(ProjectTitle, null, project.title ? (react_1.default.createElement(title_editor_1.Title, { value: project.title })) : (react_1.default.createElement(PlaceholderTitle, { value: 'Untitled Project' }))),
                    acceptedInvitations.includes(project._id) && (react_1.default.createElement(AcceptedLabel_1.default, { shouldFade: true })),
                    react_1.default.createElement(Container, null,
                        react_1.default.createElement(Edit, null,
                            react_1.default.createElement(ProjectContextMenuButton_1.default, { project: project, deleteProject: deleteProject(project), saveProjectTitle: saveProjectTitle(project), closeModal: closeModal })),
                        tokenActions && (react_1.default.createElement(ShareProjectButton_1.default, { project: project, user: user, tokenActions: tokenActions })))),
                react_1.default.createElement(ProjectContributors, null, collaborators_1.buildCollaborators(project, collaboratorProfiles).map((collaborator, index) => (react_1.default.createElement(react_1.default.Fragment, { key: collaborator._id },
                    !!index && ', ',
                    react_1.default.createElement(ProjectContributor, { key: collaborator._id },
                        initials(collaborator.bibliographicName),
                        ' ',
                        collaborator.bibliographicName.family)))))));
        }));
    })));
};
exports.ProjectsList = ProjectsList;
//# sourceMappingURL=ProjectsList.js.map