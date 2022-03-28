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
const ModalProvider_1 = require("../ModalProvider");
const TemplateSelector_1 = __importDefault(require("../templates/TemplateSelector"));
const ProjectsDropdownList_1 = require("./ProjectsDropdownList");
class ProjectsMenu extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.openTemplateSelector = () => {
            const { addModal, user } = this.props;
            addModal('template-selector', ({ handleClose }) => (react_1.default.createElement(TemplateSelector_1.default, { user: user, handleComplete: handleClose })));
        };
    }
    render() {
        const { handleClose, invitationsData, projects, acceptedInvitations, rejectedInvitations, acceptError, acceptInvitation, confirmReject, } = this.props;
        const projectsIDs = projects.map((project) => project._id);
        const filteredInvitationsData = invitationsData.filter((invitationData) => projectsIDs.indexOf(invitationData.container._id) < 0);
        return (react_1.default.createElement(ProjectsDropdownList_1.ProjectsDropdownList, { handleClose: handleClose, projects: projects, addProject: this.openTemplateSelector, invitationsData: filteredInvitationsData, acceptedInvitations: acceptedInvitations, rejectedInvitations: rejectedInvitations, acceptInvitation: acceptInvitation, confirmReject: confirmReject, acceptError: acceptError }));
    }
}
exports.default = ModalProvider_1.withModal(ProjectsMenu);
//# sourceMappingURL=ProjectsMenu.js.map