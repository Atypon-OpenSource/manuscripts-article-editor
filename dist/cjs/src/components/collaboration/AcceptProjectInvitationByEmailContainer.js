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
const qs_1 = require("qs");
const react_1 = __importDefault(require("react"));
const react_router_1 = require("react-router");
const api_1 = require("../../lib/api");
const tracking_1 = require("../../lib/tracking");
const Loading_1 = require("../Loading");
const Messages_1 = require("../Messages");
class AcceptInvitationByEmailContainer extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    componentDidMount() {
        const { token } = qs_1.parse(window.location.hash.substr(1));
        api_1.acceptProjectInvitation(token)
            .then(({ data }) => {
            this.setState({ data });
            tracking_1.trackEvent({
                category: 'Invitations',
                action: 'Accept',
                label: `projectID=${data.containerID}`,
            });
        })
            .catch((error) => {
            const errorMessage = error.response
                ? Messages_1.acceptInvitationErrorMessage(error.response.status)
                : undefined;
            this.props.history.push({
                pathname: '/projects',
                state: {
                    errorMessage,
                },
            });
        });
    }
    render() {
        const { data } = this.state;
        if (!data) {
            return react_1.default.createElement(Loading_1.LoadingPage, null, "Accepting invitation\u2026");
        }
        return (react_1.default.createElement(react_router_1.Redirect, { to: {
                pathname: `/projects/${data.containerID}`,
                state: {
                    infoMessage: data.message,
                },
            } }));
    }
}
exports.default = AcceptInvitationByEmailContainer;
//# sourceMappingURL=AcceptProjectInvitationByEmailContainer.js.map