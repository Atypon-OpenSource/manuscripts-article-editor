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
const SettingsInverted_1 = __importDefault(require("@manuscripts/assets/react/SettingsInverted"));
const style_guide_1 = require("@manuscripts/style-guide");
const http_status_codes_1 = require("http-status-codes");
const react_1 = __importDefault(require("react"));
const react_popper_1 = require("react-popper");
const styled_components_1 = __importDefault(require("styled-components"));
const InviteCollaboratorPopperContainer_1 = __importDefault(require("./InviteCollaboratorPopperContainer"));
const AddIconButton = styled_components_1.default(style_guide_1.IconButton) `
  display: flex;
  height: 24px;
  width: 40px;

  &:focus {
    outline: none;
  }
`;
const SettingsInvertedIcon = styled_components_1.default(SettingsInverted_1.default) `
  g {
    stroke: ${(props) => props.theme.colors.brand.default};
  }
`;
class InvitedCollaboratorSettingsButton extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isOpen: false,
            isUpdateRoleOpen: false,
            error: null,
            resendSucceed: null,
        };
        this.openPopper = () => {
            this.props.openPopper(!this.state.isOpen);
            this.updateListener(!this.state.isOpen);
            this.setState({
                isOpen: !this.state.isOpen,
            });
        };
        this.handleOpenModal = () => {
            this.setState({
                isUpdateRoleOpen: !this.state.isUpdateRoleOpen,
            });
        };
        this.handleClickOutside = (event) => {
            if (this.node &&
                !this.node.contains(event.target) &&
                !this.state.isUpdateRoleOpen) {
                this.openPopper();
            }
        };
        this.updateListener = (isOpen) => {
            if (isOpen) {
                document.addEventListener('mousedown', this.handleClickOutside);
            }
            else {
                document.removeEventListener('mousedown', this.handleClickOutside);
            }
        };
        this.handleUpdateRole = (role) => __awaiter(this, void 0, void 0, function* () {
            const { invitedUserEmail: email, invitedUserName: name, message, } = this.props.invitation;
            const { projectInvite } = this.props;
            try {
                yield projectInvite(email, role, name, message);
                this.openPopper();
            }
            catch (error) {
                if (error.response &&
                    error.response.status === http_status_codes_1.StatusCodes.UNAUTHORIZED) {
                    this.props.tokenActions.delete();
                }
                else {
                    this.setState({
                        error: { data: error, message: 'Failed to update invitation role' },
                    });
                }
            }
        });
        this.resendInvitation = () => __awaiter(this, void 0, void 0, function* () {
            const { invitedUserEmail: email, invitedUserName: name, message, role, } = this.props.invitation;
            const { projectInvite } = this.props;
            try {
                yield projectInvite(email, role, name, message);
                this.setState({
                    resendSucceed: true,
                });
            }
            catch (error) {
                if (error.response &&
                    error.response.status === http_status_codes_1.StatusCodes.UNAUTHORIZED) {
                    this.props.tokenActions.delete();
                }
                else {
                    this.setState({
                        resendSucceed: false,
                    });
                }
            }
        });
        this.handleUninvite = () => __awaiter(this, void 0, void 0, function* () {
            const { invitation, projectUninvite } = this.props;
            try {
                yield projectUninvite(invitation._id);
                this.openPopper();
            }
            catch (error) {
                if (error.response &&
                    error.response.status === http_status_codes_1.StatusCodes.UNAUTHORIZED) {
                    this.props.tokenActions.delete();
                }
                else {
                    this.setState({
                        error: { data: error, message: 'Uninvite user failed' },
                    });
                }
            }
        });
        this.handleCancel = () => {
            this.setState({
                error: null,
            });
        };
    }
    componentDidMount() {
        this.updateListener(this.state.isOpen);
    }
    render() {
        const { isOpen, isUpdateRoleOpen, resendSucceed } = this.state;
        return (react_1.default.createElement(react_popper_1.Manager, null,
            react_1.default.createElement(react_popper_1.Reference, null, ({ ref }) => (react_1.default.createElement(AddIconButton, { ref: ref, onClick: this.openPopper },
                react_1.default.createElement(SettingsInvertedIcon, null)))),
            isOpen && (react_1.default.createElement(react_popper_1.Popper, { placement: 'bottom', innerRef: (node) => (this.node = node) }, (popperProps) => (react_1.default.createElement(InviteCollaboratorPopperContainer_1.default, { invitation: this.props.invitation, popperProps: popperProps, isUpdateRoleOpen: isUpdateRoleOpen, handleOpenModal: this.handleOpenModal, handleUpdateRole: this.handleUpdateRole, handleUninvite: this.handleUninvite, resendInvitation: this.resendInvitation, resendSucceed: resendSucceed })))),
            this.state.error && (react_1.default.createElement(style_guide_1.Dialog, { isOpen: true, category: style_guide_1.Category.error, header: this.state.error.message, message: this.state.error.data.response.status ===
                    http_status_codes_1.StatusCodes.SERVICE_UNAVAILABLE
                    ? 'Trouble reaching manuscripts.io servers. Please try again later.'
                    : 'An error occurred.', actions: {
                    primary: {
                        action: this.handleCancel,
                        title: 'OK',
                    },
                } }))));
    }
}
exports.default = InvitedCollaboratorSettingsButton;
//# sourceMappingURL=InvitedCollaboratorSettingsButton.js.map