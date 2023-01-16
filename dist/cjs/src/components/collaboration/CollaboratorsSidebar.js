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
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const name_1 = require("../../lib/name");
const roles_1 = require("../../lib/roles");
const AddButton_1 = require("../AddButton");
const PageSidebar_1 = __importDefault(require("../PageSidebar"));
const Sidebar_1 = require("../Sidebar");
const CollaboratorSettingsButton_1 = __importDefault(require("./CollaboratorSettingsButton"));
const InvitedCollaboratorSettingsButton_1 = __importDefault(require("./InvitedCollaboratorSettingsButton"));
const CollaboratorInitial = styled_components_1.default.span `
  margin-right: ${(props) => props.theme.grid.unit}px;
  font-weight: ${(props) => props.theme.font.weight.light};
`;
const CollaboratorName = styled_components_1.default.div `
  font-size: 120%;
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: ${(props) => props.theme.font.weight.medium};
`;
const CollaboratorRole = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.normal};
  color: ${(props) => props.theme.colors.text.secondary};
`;
const Action = styled_components_1.default.div `
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
`;
const CollaboratorData = styled_components_1.default.div `
  padding-left: ${(props) => props.theme.grid.unit * 2}px;
`;
const UserDataContainer = styled_components_1.default.div `
  display: flex;
  align-items: center;
  overflow: hidden;
`;
const Invited = styled_components_1.default.div `
  display: flex;
  font-size: ${(props) => props.theme.font.size.small};
  color: ${(props) => props.theme.colors.brand.default};
`;
const InvitedContainer = styled_components_1.default.div `
  display: flex;
  align-items: center;
  padding-left: ${(props) => props.theme.grid.unit * 2}px;
`;
const AlertMessageContainer = styled_components_1.default.div `
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
`;
class CollaboratorsSidebar extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isSettingsOpen: false,
            hoveredID: '',
            selectedID: '',
            message: undefined,
        };
        this.handleHover = (hoveredID = '') => {
            if (!this.state.isSettingsOpen) {
                this.setState({ hoveredID });
            }
        };
        this.openPopper = (isOpen) => {
            this.setState({
                isSettingsOpen: isOpen,
            });
        };
        this.handleClickCollaborator = (collaborator) => {
            this.props.handleClickCollaborator(collaborator);
            this.setState({ selectedID: collaborator.userID });
        };
    }
    componentDidMount() {
        this.setState({
            message: this.props.infoMessage,
        });
    }
    render() {
        const { project, projectCollaborators, invitations, user, updateUserRole, projectInvite, projectUninvite, handleAddCollaborator, tokenActions, } = this.props;
        const { hoveredID, selectedID, message } = this.state;
        const collaboratorEmails = projectCollaborators
            .filter((collaborator) => collaborator.email)
            .map((collaborator) => collaborator.email);
        const filteredInvitations = invitations.filter((invitation) => !collaboratorEmails.includes(invitation.invitedUserEmail));
        return (react_1.default.createElement(PageSidebar_1.default, { direction: 'row', minSize: 260, name: 'collaborators-sidebar', side: 'end', sidebarTitle: react_1.default.createElement(Sidebar_1.SidebarHeader, { title: 'Collaborators' }) },
            roles_1.isOwner(project, user.userID) && (react_1.default.createElement(Action, null,
                react_1.default.createElement(AddButton_1.AddButton, { action: handleAddCollaborator, title: "New Collaborator", size: 'medium' }))),
            message && (react_1.default.createElement(AlertMessageContainer, null,
                react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.success, hideCloseButton: true, dismissButton: {
                        text: 'OK',
                        action: () => {
                            this.setState({
                                message: undefined,
                            });
                        },
                    } }, message))),
            filteredInvitations.map((invitation) => (react_1.default.createElement(Sidebar_1.SidebarPersonContainer, { key: invitation._id, onMouseEnter: () => this.handleHover(invitation._id), onMouseLeave: () => this.handleHover() },
                react_1.default.createElement(UserDataContainer, null,
                    react_1.default.createElement(style_guide_1.Avatar, { size: 36, color: '#6e6e6e' }),
                    react_1.default.createElement(CollaboratorData, null,
                        react_1.default.createElement(CollaboratorName, null, invitation.invitedUserName || invitation.invitedUserEmail),
                        react_1.default.createElement(CollaboratorRole, null, invitation.role))),
                react_1.default.createElement(InvitedContainer, null,
                    react_1.default.createElement(Invited, null, "Invited"),
                    (hoveredID === invitation._id ||
                        selectedID === invitation._id) &&
                        roles_1.isOwner(project, user.userID) && (react_1.default.createElement(InvitedCollaboratorSettingsButton_1.default, { invitation: invitation, projectInvite: projectInvite, projectUninvite: projectUninvite, openPopper: this.openPopper, tokenActions: tokenActions })))))),
            !!projectCollaborators &&
                projectCollaborators.map((collaborator) => (react_1.default.createElement(Sidebar_1.SidebarPersonContainer, { key: collaborator._id, selected: selectedID === collaborator.userID, onMouseEnter: () => this.handleHover(collaborator.userID), onMouseLeave: () => this.handleHover(), onClick: () => this.handleClickCollaborator(collaborator) },
                    react_1.default.createElement(UserDataContainer, null,
                        react_1.default.createElement(style_guide_1.Avatar, { src: collaborator.avatar, size: 36, color: '#6e6e6e' }),
                        react_1.default.createElement(CollaboratorData, null,
                            user.userID !== collaborator.userID ? (react_1.default.createElement(CollaboratorName, null,
                                react_1.default.createElement(CollaboratorInitial, null, name_1.initials(collaborator.bibliographicName)),
                                collaborator.bibliographicName.family)) : (react_1.default.createElement(CollaboratorName, null, "You")),
                            react_1.default.createElement(CollaboratorRole, null, roles_1.getUserRole(project, collaborator.userID)))),
                    (hoveredID === collaborator.userID ||
                        selectedID === collaborator.userID) &&
                        roles_1.isOwner(project, user.userID) && (react_1.default.createElement(CollaboratorSettingsButton_1.default, { project: project, collaborator: collaborator, openPopper: this.openPopper, updateUserRole: updateUserRole, tokenActions: tokenActions })))))));
    }
}
exports.default = CollaboratorsSidebar;
//# sourceMappingURL=CollaboratorsSidebar.js.map