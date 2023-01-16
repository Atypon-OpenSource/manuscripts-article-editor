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
const react_1 = __importDefault(require("react"));
const api_1 = require("../../lib/api");
const collaborators_1 = require("../../lib/collaborators");
const tracking_1 = require("../../lib/tracking");
const Page_1 = require("../Page");
const CollaboratorsPage_1 = require("./CollaboratorsPage");
const CollaboratorsSidebar_1 = __importDefault(require("./CollaboratorsSidebar"));
class CollaboratorsPageContainer extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            error: null,
            selectedCollaborator: null,
        };
        this.handleAddCollaborator = () => {
            const { projectID } = this.props.match.params;
            this.props.history.push(`/projects/${projectID}/collaborators/add`);
        };
        this.updateUserRole = (selectedRole, userID) => __awaiter(this, void 0, void 0, function* () {
            const { projectID } = this.props.match.params;
            yield api_1.updateUserRole(projectID, selectedRole, userID);
        });
        this.projectInvite = (email, role, name, message) => __awaiter(this, void 0, void 0, function* () {
            const { projectID } = this.props.match.params;
            yield api_1.projectInvite(projectID, [
                {
                    email,
                    name,
                },
            ], role, message);
            tracking_1.trackEvent({
                category: 'Invitations',
                action: 'Send',
                label: `projectID=${projectID}`,
            });
        });
        this.projectUninvite = (invitationID) => __awaiter(this, void 0, void 0, function* () {
            yield api_1.projectUninvite(invitationID);
        });
        this.handleClickCollaborator = (selectedCollaborator) => {
            this.setState({ selectedCollaborator });
        };
        this.manageProfile = () => this.props.history.push('/profile');
    }
    render() {
        const { selectedCollaborator } = this.state;
        const { state } = this.props.location;
        const infoMessage = state ? state.infoMessage : undefined;
        const { invitations, project, user, collaborators, tokenActions, } = this.props;
        const acceptedInvitations = invitations.filter((invitation) => !invitation.acceptedAt);
        const projectCollaborators = collaborators_1.buildCollaborators(project, collaborators);
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(CollaboratorsSidebar_1.default, { projectCollaborators: projectCollaborators, invitations: acceptedInvitations, project: project, user: user, updateUserRole: this.updateUserRole, projectInvite: this.projectInvite, projectUninvite: this.projectUninvite, handleAddCollaborator: this.handleAddCollaborator, handleClickCollaborator: this.handleClickCollaborator, tokenActions: tokenActions, infoMessage: infoMessage }),
            react_1.default.createElement(Page_1.Main, null,
                react_1.default.createElement(CollaboratorsPage_1.CollaboratorDetailsPage, { project: project, user: user, collaboratorsCount: projectCollaborators.length + invitations.length, handleAddCollaborator: this.handleAddCollaborator, selectedCollaborator: selectedCollaborator, manageProfile: this.manageProfile }))));
    }
}
exports.default = CollaboratorsPageContainer;
//# sourceMappingURL=CollaboratorsPageContainer.js.map