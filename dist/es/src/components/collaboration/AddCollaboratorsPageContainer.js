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
const lodash_es_1 = require("lodash-es");
const react_1 = __importDefault(require("react"));
const react_router_1 = require("react-router");
const api_1 = require("../../lib/api");
const collaborators_1 = require("../../lib/collaborators");
const roles_1 = require("../../lib/roles");
const tracking_1 = require("../../lib/tracking");
const Page_1 = require("../Page");
const Panel_1 = __importDefault(require("../Panel"));
const ResizerButtons_1 = require("../ResizerButtons");
const AddCollaboratorsSidebar_1 = __importDefault(require("./AddCollaboratorsSidebar"));
const CollaboratorsPage_1 = require("./CollaboratorsPage");
const InviteCollaboratorsSidebar_1 = __importDefault(require("./InviteCollaboratorsSidebar"));
class CollaboratorPageContainer extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            people: [],
            collaborators: [],
            isInvite: false,
            searchText: '',
            addedCollaboratorsCount: 0,
            addedUsers: [],
            invitationSent: false,
        };
        this.buildPeople = () => {
            const { projectID } = this.props.match.params;
            const { project, projects, collaborators } = this.props;
            const otherProjects = projects.filter((project) => project._id !== projectID);
            const projectCollaborators = collaborators_1.buildCollaborators(project, collaborators);
            const otherProjectCollaborators = [];
            for (const otherProject of otherProjects) {
                const otherCollaborators = collaborators_1.buildCollaborators(otherProject, collaborators);
                otherProjectCollaborators.push(...otherCollaborators);
            }
            const onlyOtherProjectCollaborators = lodash_es_1.difference(otherProjectCollaborators, projectCollaborators);
            return [...new Set(onlyOtherProjectCollaborators)];
        };
        this.addCollaborator = (userID, role) => __awaiter(this, void 0, void 0, function* () {
            const { projectID } = this.props.match.params;
            yield api_1.addProjectUser(projectID, role, userID);
            this.setState({
                addedUsers: this.state.addedUsers.concat(userID),
            });
        });
        this.countAddedCollaborators = () => {
            this.setState({
                addedCollaboratorsCount: this.state.addedCollaboratorsCount + 1,
            });
        };
        this.handleDoneCancel = () => {
            const { projectID } = this.props.match.params;
            this.props.history.push(`/projects/${projectID}/collaborators`);
        };
        this.handleInvite = () => {
            this.setState({
                isInvite: true,
            });
        };
        this.setSearchText = (searchText) => this.setState({ searchText });
        this.handleCancel = () => {
            this.setState({
                searchText: '',
                isInvite: false,
            });
            this.setState({ invitationSent: false });
        };
        this.handleInvitationSubmit = (values) => __awaiter(this, void 0, void 0, function* () {
            const { projectID } = this.props.match.params;
            const { email, name, role } = values;
            yield api_1.projectInvite(projectID, [{ email, name }], role);
            this.setState({ invitationSent: true });
            tracking_1.trackEvent({
                category: 'Invitations',
                action: 'Send',
                label: `projectID=${projectID}`,
            });
            this.props.history.push(`/projects/${projectID}/collaborators`, {
                infoMessage: 'Invitation was sent.',
            });
        });
    }
    componentDidMount() {
        const people = this.buildPeople();
        this.setState({ people });
    }
    render() {
        const { isInvite } = this.state;
        const { invitations, project, user, collaborators } = this.props;
        if (!roles_1.isOwner(project, user.userID)) {
            return react_1.default.createElement(react_router_1.Redirect, { to: `/projects/${project._id}/collaborators` });
        }
        if (isInvite) {
            return this.renderInviteCollaboratorPage();
        }
        const acceptedInvitations = invitations.filter((invitation) => !invitation.acceptedAt);
        const projectCollaborators = collaborators_1.buildCollaborators(project, collaborators);
        const collaboratorEmails = projectCollaborators
            .filter((collaborator) => collaborator.email)
            .map((collaborator) => collaborator.email);
        const filteredInvitations = acceptedInvitations.filter((invitation) => !collaboratorEmails.includes(invitation.invitedUserEmail));
        return this.renderAddCollaboratorsPage(this.state.people, filteredInvitations);
    }
    renderInviteCollaboratorPage() {
        const { searchText, invitationSent } = this.state;
        const isEmail = searchText.includes('@');
        const invitationValues = {
            name: isEmail ? '' : searchText,
            email: isEmail ? searchText : '',
            role: 'Writer',
        };
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Panel_1.default, { name: 'collaborators-sidebar', direction: 'row', side: 'end', minSize: 300, resizerButton: ResizerButtons_1.ResizingOutlinerButton },
                react_1.default.createElement(InviteCollaboratorsSidebar_1.default, { invitationValues: invitationValues, handleCancel: this.handleCancel, handleSubmit: this.handleInvitationSubmit, invitationSent: invitationSent, tokenActions: this.props.tokenActions })),
            react_1.default.createElement(Page_1.Main, null,
                react_1.default.createElement(CollaboratorsPage_1.InviteCollaboratorsPage, null))));
    }
    renderAddCollaboratorsPage(people, acceptedInvitations) {
        const { addedCollaboratorsCount, searchText, addedUsers } = this.state;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Panel_1.default, { name: 'add-collaborators-sidebar', direction: 'row', side: 'end', minSize: 300, resizerButton: ResizerButtons_1.ResizingOutlinerButton },
                react_1.default.createElement(AddCollaboratorsSidebar_1.default, { people: people, invitations: acceptedInvitations, numberOfAddedCollaborators: addedCollaboratorsCount, addedUsers: addedUsers, addCollaborator: this.addCollaborator, countAddedCollaborators: this.countAddedCollaborators, handleDoneCancel: this.handleDoneCancel, handleInvite: this.handleInvite, setSearchText: this.setSearchText, tokenActions: this.props.tokenActions })),
            react_1.default.createElement(Page_1.Main, null, !searchText.length ? (react_1.default.createElement(CollaboratorsPage_1.AddCollaboratorsPage, { addedCollaboratorsCount: addedCollaboratorsCount })) : (react_1.default.createElement(CollaboratorsPage_1.SearchCollaboratorsPage, { searchText: searchText })))));
    }
}
exports.default = CollaboratorPageContainer;
//# sourceMappingURL=AddCollaboratorsPageContainer.js.map