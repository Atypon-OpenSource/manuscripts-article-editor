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
const react_router_1 = require("react-router");
const api_1 = require("../../lib/api");
const invitation_token_1 = __importDefault(require("../../lib/invitation-token"));
const tracking_1 = require("../../lib/tracking");
const Loading_1 = require("../Loading");
const Messages_1 = require("../Messages");
// TODO: require a button press to accept the invitation?
// TODO: allow the invitation to be declined?
// TODO: allow retry if there's an error?
class AcceptProjectInvitation extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            const invitationToken = invitation_token_1.default.get();
            if (invitationToken &&
                invitationToken.startsWith('MPContainerInvitation')) {
                invitation_token_1.default.remove();
                yield api_1.acceptProjectInvitation(invitationToken).then(({ data }) => {
                    this.setState({ data });
                    tracking_1.trackEvent({
                        category: 'Invitations',
                        action: 'Accept',
                        label: `projectID=${data.containerID}`,
                    });
                }, (error) => {
                    const errorMessage = error.response
                        ? Messages_1.acceptInvitationErrorMessage(error.response.status)
                        : undefined;
                    this.setState({ errorMessage });
                });
            }
            else if (invitationToken) {
                invitation_token_1.default.remove();
                yield api_1.acceptProjectInvitationToken(invitationToken).then(({ data }) => {
                    this.setState({ data });
                }, (error) => {
                    const errorMessage = error.response
                        ? Messages_1.acceptInvitationTokenErrorMessage(error.response.status)
                        : undefined;
                    this.setState({ errorMessage });
                });
            }
        });
    }
    render() {
        const { data, errorMessage } = this.state;
        if (!data && !errorMessage) {
            return react_1.default.createElement(Loading_1.LoadingPage, null, "Accepting invitation\u2026");
        }
        if (data) {
            return (react_1.default.createElement(react_router_1.Redirect, { to: {
                    pathname: `/projects/${data.containerID}`,
                    state: {
                        infoMessage: data.message,
                    },
                } }));
        }
        if (errorMessage) {
            return (react_1.default.createElement(react_router_1.Redirect, { to: {
                    pathname: '/projects',
                    state: {
                        errorMessage,
                    },
                } }));
        }
    }
}
exports.default = AcceptProjectInvitation;
//# sourceMappingURL=AcceptProjectInvitation.js.map