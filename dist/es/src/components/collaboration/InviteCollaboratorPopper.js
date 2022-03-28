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
const CollaboratorRolePopper_1 = require("./CollaboratorRolePopper");
const UninviteCollaboratorPopper_1 = require("./UninviteCollaboratorPopper");
const UpdateRolePageContainer_1 = __importDefault(require("./UpdateRolePageContainer"));
class InviteCollaboratorPopper extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            selectedRole: this.props.invitation.role,
            selectedMode: 'invite',
        };
        this.handleResendSubmit = () => __awaiter(this, void 0, void 0, function* () {
            yield this.props.resendInvitation();
        });
        this.handleRoleChange = (event) => {
            this.setState({
                selectedRole: event.currentTarget.value,
            });
            this.props.handleOpenModal();
        };
        this.handleCancel = () => {
            this.props.handleOpenModal();
            this.setState({
                selectedRole: this.props.invitation.role,
            });
        };
        this.setMode = (selectedMode) => {
            this.setState({ selectedMode, selectedRole: this.state.selectedRole });
        };
        this.handleUninvite = () => __awaiter(this, void 0, void 0, function* () {
            yield this.props.handleUninvite();
            this.setState({
                selectedMode: 'invite',
                selectedRole: '',
            });
        });
    }
    render() {
        const { selectedRole, selectedMode } = this.state;
        const { invitation, isUpdateRoleOpen, resendSucceed } = this.props;
        return selectedMode === 'invite' && !isUpdateRoleOpen ? (react_1.default.createElement(CollaboratorRolePopper_1.CollaboratorRolePopper, { handleRoleChange: this.handleRoleChange, selectedRole: selectedRole, switchMode: () => this.setMode('uninvite'), removeText: 'Cancel invitation', invitedUserEmail: invitation.invitedUserEmail, resendSucceed: resendSucceed, resendInvitation: this.handleResendSubmit, selectedMode: this.state.selectedMode, isOnlyOwner: false })) : isUpdateRoleOpen ? (react_1.default.createElement(UpdateRolePageContainer_1.default, { updating: isUpdateRoleOpen, selectedRole: selectedRole, handleUpdateRole: this.props.handleUpdateRole, handleCancel: this.handleCancel })) : (react_1.default.createElement(UninviteCollaboratorPopper_1.UninviteCollaboratorPopper, { invitedUserName: invitation.invitedUserName, handleUninvite: this.handleUninvite, switchMode: () => this.setMode('invite') }));
    }
}
exports.default = InviteCollaboratorPopper;
//# sourceMappingURL=InviteCollaboratorPopper.js.map