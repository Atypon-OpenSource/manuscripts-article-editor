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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const api_1 = require("../../lib/api");
const invitation_1 = require("../../lib/invitation");
const tracking_1 = require("../../lib/tracking");
const store_1 = require("../../store");
const Messages_1 = require("../Messages");
const InvitationsList_1 = require("../projects/InvitationsList");
const ProjectsList_1 = require("../projects/ProjectsList");
const Sidebar_1 = require("../Sidebar");
const ProjectsDropdown_1 = require("./ProjectsDropdown");
const ProjectsMenu_1 = __importDefault(require("./ProjectsMenu"));
const Container = styled_components_1.default.div `
  font-weight: ${(props) => props.theme.font.weight.medium};
`;
const StyledSidebarContent = styled_components_1.default(Sidebar_1.SidebarContent) `
  overflow: auto;
  padding: 0;

  @media (min-width: ${(props) => props.theme.grid.tablet}px) {
    padding-right: ${(props) => props.theme.grid.unit * 15}px;
  }
`;
const ProjectsButton = (props) => {
    const [{ user, projects, deleteProject, updateProject, invitations, projectInvitations, },] = store_1.useStore((store) => ({
        user: store.user,
        projects: store.projects,
        deleteProject: store.deleteProject,
        updateProject: store.updateProject,
        invitations: store.invitations || [],
        projectInvitations: store.projectInvitations || [],
    }));
    const [state, setState] = react_1.useState({
        handledInvitations: new Set(),
        acceptedInvitations: [],
        rejectedInvitations: [],
        acceptError: null,
        rejectedInvitation: null,
        invitingUserProfile: null,
    });
    const buildInvitationData = (invitations, user) => {
        const { handledInvitations } = state;
        const invitationsData = [];
        for (const invitation of invitations) {
            const { acceptedAt, invitingUserProfile } = invitation;
            if (acceptedAt) {
                continue;
            } // ignore accepted invitations
            if (!invitingUserProfile) {
                continue;
            } // inviting profile is needed
            if (invitingUserProfile._id === user._id) {
                continue;
            } // ignore invitations sent by this user
            if (handledInvitations.has(invitation._id)) {
                continue;
            } // ignore handled invitations
            invitationsData.push({
                invitation,
                invitingUserProfile,
                container: {
                    _id: invitation.containerID,
                    title: invitation.containerTitle,
                },
            });
        }
        return invitationsData;
    };
    const removeInvitationData = (id) => {
        const { handledInvitations } = state;
        handledInvitations.add(id);
        setState((state) => (Object.assign(Object.assign({}, state), { handledInvitations })));
    };
    const acceptInvitation = (invitation) => __awaiter(void 0, void 0, void 0, function* () {
        yield api_1.acceptProjectInvitation(invitation._id).then(({ data }) => {
            const acceptedInvitations = state.acceptedInvitations.concat(invitation.containerID);
            setState((state) => (Object.assign(Object.assign({}, state), { acceptedInvitations })));
            removeInvitationData(invitation._id);
            tracking_1.trackEvent({
                category: 'Invitations',
                action: 'Accept',
                label: `projectID=${data.containerID}`,
            });
        }, (error) => {
            const errorMessage = error.response
                ? Messages_1.acceptInvitationErrorMessage(error.response.status)
                : '';
            setState((state) => (Object.assign(Object.assign({}, state), { acceptError: { invitationId: invitation._id, errorMessage } })));
        });
    });
    const confirmReject = (invitingUserProfile, invitation) => __awaiter(void 0, void 0, void 0, function* () {
        setState((state) => (Object.assign(Object.assign({}, state), { invitingUserProfile, rejectedInvitation: invitation })));
    });
    const rejectInvitation = (invitation) => __awaiter(void 0, void 0, void 0, function* () {
        yield api_1.rejectProjectInvitation(invitation._id);
        const rejectedInvitations = state.rejectedInvitations.concat(invitation.containerID);
        setState((state) => (Object.assign(Object.assign({}, state), { rejectedInvitations })));
        removeInvitationData(invitation._id);
        setState((state) => (Object.assign(Object.assign({}, state), { rejectedInvitation: null, invitingUserProfile: null })));
    });
    const { closeModal } = props;
    const { acceptedInvitations, rejectedInvitations, acceptError, rejectedInvitation, } = state;
    const actions = {
        primary: {
            action: () => rejectInvitation(rejectedInvitation),
            title: 'Reject',
            isDestructive: true,
        },
        secondary: {
            action: () => setState((state) => (Object.assign(Object.assign({}, state), { rejectedInvitation: null, invitingUserProfile: null }))),
            title: 'Cancel',
        },
    };
    const containerInvitations = invitation_1.buildContainerInvitations(projectInvitations);
    const allInvitations = [
        ...invitations,
        ...containerInvitations,
    ].filter((invitation) => invitation.containerID.startsWith('MPProject'));
    const invitationsByContainer = invitation_1.groupInvitations(allInvitations, 'Container');
    const leastLimitingInvitations = [];
    for (const invitations of Object.values(invitationsByContainer)) {
        leastLimitingInvitations.push(invitation_1.findLeastLimitingInvitation(invitations));
    }
    const invitationsData = buildInvitationData(leastLimitingInvitations, user);
    const projectsIDs = projects.map((project) => project._id);
    const filteredInvitationsData = invitationsData.filter((invitationData) => projectsIDs.indexOf(invitationData.container._id) < 0);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        !props.isDropdown ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(StyledSidebarContent, null,
                react_1.default.createElement(InvitationsList_1.InvitationsList, { invitationsData: filteredInvitationsData, acceptInvitation: acceptInvitation, acceptError: acceptError, confirmReject: confirmReject }),
                react_1.default.createElement(ProjectsList_1.ProjectsList, { projects: projects, acceptedInvitations: acceptedInvitations, deleteProject: (project) => () => deleteProject(project._id), saveProjectTitle: (project) => (title) => updateProject(project._id, { title }), closeModal: closeModal, user: user })))) : (react_1.default.createElement(ProjectsDropdown_1.ProjectsDropdown, { notificationsCount: filteredInvitationsData.length },
            react_1.default.createElement(ProjectsMenu_1.default, { invitationsData: filteredInvitationsData, projects: projects, removeInvitationData: removeInvitationData, acceptedInvitations: acceptedInvitations, rejectedInvitations: rejectedInvitations, acceptError: acceptError, acceptInvitation: acceptInvitation, confirmReject: confirmReject, user: user }))),
        state.rejectedInvitation && (react_1.default.createElement(style_guide_1.Dialog, { isOpen: state.rejectedInvitation ? true : false, actions: actions, category: style_guide_1.Category.confirmation, header: 'Reject Project Invitation', message: react_1.default.createElement("div", null,
                react_1.default.createElement("div", null, "Are you sure you want to reject invitation from"),
                react_1.default.createElement("br", null),
                ' ',
                react_1.default.createElement(Container, null, state.invitingUserProfile.bibliographicName.given +
                    ' ' +
                    state.invitingUserProfile.bibliographicName.family),
                react_1.default.createElement(Container, null,
                    "(",
                    state.invitingUserProfile.email,
                    ")?"),
                ' ') }))));
};
exports.default = ProjectsButton;
//# sourceMappingURL=ProjectsButton.js.map