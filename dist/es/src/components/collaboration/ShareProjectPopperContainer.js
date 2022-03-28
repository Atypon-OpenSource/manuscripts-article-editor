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
const clipboard_copy_1 = __importDefault(require("clipboard-copy"));
const http_status_codes_1 = require("http-status-codes");
const react_1 = __importDefault(require("react"));
const config_1 = __importDefault(require("../../config"));
const api_1 = require("../../lib/api");
const roles_1 = require("../../lib/roles");
const tracking_1 = require("../../lib/tracking");
const Popper_1 = require("../Popper");
const InvitationPopper_1 = require("./InvitationPopper");
const ShareURIPopper_1 = require("./ShareURIPopper");
class ShareProjectPopperContainer extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            shareURI: {
                viewer: '',
                writer: '',
            },
            isShareURIPopperOpen: true,
            isURILoaded: false,
            isCopied: false,
            selectedShareURIRole: 'Writer',
            shownURI: '',
            isInvite: false,
            loadingURIError: null,
        };
        this.requestURI = () => {
            this.shareProjectURI()
                .then(() => {
                this.setState({
                    isURILoaded: true,
                    shownURI: this.state.shareURI.writer,
                    loadingURIError: null,
                });
            })
                .catch((error) => {
                if (error.response &&
                    error.response.status === http_status_codes_1.StatusCodes.UNAUTHORIZED) {
                    this.props.tokenActions.delete();
                }
                else {
                    this.setState({ loadingURIError: error });
                }
            });
        };
        this.handleSwitching = (isInvite) => {
            this.setState({ isInvite });
        };
        this.handleShareURIRoleChange = (event) => {
            const { shareURI } = this.state;
            switch (event.currentTarget.value) {
                case 'Writer':
                    this.setState({
                        selectedShareURIRole: event.currentTarget.value,
                        shownURI: shareURI.writer,
                    });
                    break;
                case 'Viewer':
                    this.setState({
                        selectedShareURIRole: event.currentTarget.value,
                        shownURI: shareURI.viewer,
                    });
                    break;
            }
        };
        this.handleInvitationSubmit = (values) => __awaiter(this, void 0, void 0, function* () {
            const { project } = this.props;
            const { email, name, role } = values;
            yield api_1.projectInvite(project._id, [{ email, name }], role);
            tracking_1.trackEvent({
                category: 'Invitations',
                action: 'Send',
                label: `projectID=${project._id}`,
            });
        });
        this.copyURI = () => __awaiter(this, void 0, void 0, function* () {
            const { isCopied } = this.state;
            const { _id } = this.props.project;
            if (!isCopied) {
                const { selectedShareURIRole, shareURI } = this.state;
                switch (selectedShareURIRole) {
                    case 'Writer':
                        yield clipboard_copy_1.default(shareURI.writer);
                        tracking_1.trackEvent({
                            category: 'Invitations',
                            action: 'Share',
                            label: `role=Writer&projectID=${_id}`,
                        });
                        break;
                    case 'Viewer':
                        yield clipboard_copy_1.default(shareURI.viewer);
                        tracking_1.trackEvent({
                            category: 'Invitations',
                            action: 'Share',
                            label: `role=Viewer&projectID=${_id}`,
                        });
                        break;
                }
            }
            this.setState({ isCopied: !isCopied });
        });
        this.shareProjectURI = () => __awaiter(this, void 0, void 0, function* () {
            const { project } = this.props;
            this.setState({
                isShareURIPopperOpen: true,
                shareURI: {
                    viewer: yield this.fetchInvitationURI(project._id, 'Viewer'),
                    writer: yield this.fetchInvitationURI(project._id, 'Writer'),
                },
            });
        });
        this.fetchInvitationURI = (projectID, role) => __awaiter(this, void 0, void 0, function* () {
            const { data: { token }, } = yield api_1.requestProjectInvitationToken(projectID, role);
            return `${config_1.default.url}/projects/${encodeURIComponent(projectID)}/invitation/${encodeURIComponent(token)}/`;
        });
    }
    componentDidMount() {
        const { project, user } = this.props;
        if (roles_1.isOwner(project, user.userID)) {
            this.requestURI();
        }
    }
    render() {
        const { popperProps, user, project, tokenActions } = this.props;
        const { isCopied, isInvite, isURILoaded, shownURI, selectedShareURIRole, loadingURIError, } = this.state;
        if (isInvite) {
            return (react_1.default.createElement(Popper_1.CustomPopper, { popperProps: popperProps },
                react_1.default.createElement(InvitationPopper_1.InvitationPopper, { handleInvitationSubmit: this.handleInvitationSubmit, handleSwitching: this.handleSwitching, project: project, user: user, tokenActions: tokenActions })));
        }
        return (react_1.default.createElement(Popper_1.CustomPopper, { popperProps: popperProps },
            react_1.default.createElement(ShareURIPopper_1.ShareURIPopper, { dataLoaded: isURILoaded, URI: shownURI, selectedRole: selectedShareURIRole, isCopied: isCopied, user: user, project: project, loadingURIError: loadingURIError, requestURI: this.requestURI, handleChange: this.handleShareURIRoleChange, handleCopy: this.copyURI, handleSwitching: this.handleSwitching })));
    }
}
exports.default = ShareProjectPopperContainer;
//# sourceMappingURL=ShareProjectPopperContainer.js.map