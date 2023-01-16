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
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../../config"));
const invitation_1 = require("../../lib/invitation");
const store_1 = require("../../store");
const AddButton_1 = require("../AddButton");
const ImportContainer_1 = __importDefault(require("../ImportContainer"));
const ModalHookableProvider_1 = require("../ModalHookableProvider");
const ModalProvider_1 = require("../ModalProvider");
const ProjectsButton_1 = __importDefault(require("../nav/ProjectsButton"));
const Sidebar_1 = require("../Sidebar");
const TemplateSelector_1 = __importDefault(require("../templates/TemplateSelector"));
const ProjectsListPlaceholder_1 = require("./ProjectsListPlaceholder");
const Container = styled_components_1.default(Sidebar_1.Sidebar) `
  background-color: ${(props) => props.theme.colors.background.primary};
  overflow: auto;
`;
const Header = styled_components_1.default(Sidebar_1.SidebarHeader) `
  @media (max-width: 450px) {
    margin-left: ${(props) => props.theme.grid.unit * 2}px;
  }
`;
const SidebarAction = styled_components_1.default.div `
  margin: ${(props) => props.theme.grid.unit * 3}px;
  @media (max-width: 450px) {
    margin-left: ${(props) => props.theme.grid.unit * 4}px;
  }
`;
const ProjectsContainer = styled_components_1.default.div `
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: ${(props) => props.theme.grid.unit * 5}px
    ${(props) => props.theme.grid.unit * 15}px;
  padding-right: 0;
  width: 100%;

  @media (max-width: ${(props) => props.theme.grid.tablet - 1}px) {
    padding: unset;
  }
`;
const ProjectsSidebar = (props) => {
    const [{ invitations, projectsInvitations, projects, user }] = store_1.useStore((store) => ({
        invitations: store.invitations || [],
        projectsInvitations: store.projectsInvitations,
        projects: store.projects,
        user: store.user,
    }));
    const { addModal } = ModalHookableProvider_1.useModal();
    const openTemplateSelector = (props, user) => () => {
        addModal('template-selector', ({ handleClose }) => (react_1.default.createElement(TemplateSelector_1.default, { user: user, handleComplete: handleClose })));
    };
    const containerInvitations = invitation_1.buildContainerInvitations(projectsInvitations);
    const allInvitations = [
        ...invitations,
        ...containerInvitations,
    ];
    const invitationReceived = allInvitations.filter((invitation) => invitation.invitedUserEmail === user.email &&
        !invitation.acceptedAt &&
        invitation.containerID.startsWith('MPProject'));
    return projects.length || invitationReceived.length ? (react_1.default.createElement(Container, { id: 'projects-sidebar' },
        react_1.default.createElement(ProjectsContainer, null,
            react_1.default.createElement(Header, { title: react_1.default.createElement("span", { className: 'sidebar-title' }, "Projects") }),
            !config_1.default.leanWorkflow.enabled && (react_1.default.createElement(SidebarAction, null,
                react_1.default.createElement(AddButton_1.AddButton, { action: openTemplateSelector(props, user), size: 'medium', title: 'New Project' }))),
            react_1.default.createElement(ProjectsButton_1.default, { isDropdown: false, closeModal: props.closeModal })))) : (react_1.default.createElement(ImportContainer_1.default, { importManuscript: props.importManuscript, render: ({ handleClick, isDragAccept }) => (react_1.default.createElement(ProjectsListPlaceholder_1.ProjectsListPlaceholder, { handleClick: handleClick, openTemplateSelector: openTemplateSelector(props, user), isDragAccept: isDragAccept })) }));
};
exports.default = ModalProvider_1.withModal(ProjectsSidebar);
//# sourceMappingURL=ProjectsSidebar.js.map