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
const roles_1 = require("../../lib/roles");
const CollaboratorRolePopper_1 = require("./CollaboratorRolePopper");
const RemoveCollaboratorPopper_1 = require("./RemoveCollaboratorPopper");
const UpdateRolePageContainer_1 = __importDefault(require("./UpdateRolePageContainer"));
class CollaboratorSettingsPopper extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            selectedRole: roles_1.getUserRole(this.props.project, this.props.collaborator.userID) || '',
            selectedMode: 'role',
        };
        this.handleRoleChange = (event) => {
            this.setState({
                selectedRole: event.currentTarget.value,
            });
            this.props.handleOpenModal();
        };
        this.handleCancel = () => {
            this.props.handleOpenModal();
            this.setState({
                selectedRole: roles_1.getUserRole(this.props.project, this.props.collaborator.userID) || '',
            });
        };
        this.setMode = (selectedMode) => {
            this.setState({ selectedMode });
        };
        this.handleRemove = () => __awaiter(this, void 0, void 0, function* () {
            yield this.props.handleRemove();
            this.setState({
                selectedMode: 'role',
                selectedRole: '',
            });
        });
    }
    render() {
        const { selectedRole, selectedMode } = this.state;
        const { collaborator, updateRoleIsOpen, project } = this.props;
        const isOnlyOwner = project.owners.length === 1 && roles_1.isOwner(project, collaborator.userID);
        return selectedMode === 'role' && !updateRoleIsOpen ? (react_1.default.createElement(CollaboratorRolePopper_1.CollaboratorRolePopper, { selectedRole: selectedRole, handleRoleChange: this.handleRoleChange, switchMode: () => this.setMode('remove'), removeText: 'Remove from project', isOnlyOwner: isOnlyOwner })) : updateRoleIsOpen ? (react_1.default.createElement(UpdateRolePageContainer_1.default, { updating: updateRoleIsOpen, selectedRole: selectedRole, handleUpdateRole: this.props.handleUpdateRole, handleCancel: this.handleCancel })) : (react_1.default.createElement(RemoveCollaboratorPopper_1.RemoveCollaboratorPopper, { collaborator: collaborator, handleRemove: this.handleRemove, switchMode: () => this.setMode('role') }));
    }
}
exports.default = CollaboratorSettingsPopper;
//# sourceMappingURL=CollaboratorSettingsPopper.js.map