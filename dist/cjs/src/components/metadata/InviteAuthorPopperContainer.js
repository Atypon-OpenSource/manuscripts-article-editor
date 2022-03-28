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
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const collaboration_1 = require("../../lib/api/collaboration");
const tracking_1 = require("../../lib/tracking");
const InvitationForm_1 = require("../collaboration/InvitationForm");
const Popper_1 = require("../Popper");
const AlertMessageContainer = styled_components_1.default.div `
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
`;
class InviteAuthorPopperContainer extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            invitationError: null,
        };
        this.handleInvitationSubmit = (values) => __awaiter(this, void 0, void 0, function* () {
            const { project } = this.props;
            const { email, name, role } = values;
            yield collaboration_1.projectInvite(project._id, [{ email, name }], role);
            this.props.updateAuthor(this.props.author, email);
            tracking_1.trackEvent({
                category: 'Invitations',
                action: 'Send',
                label: `projectID=${project._id}`,
            });
        });
    }
    render() {
        const { popperProps, author, tokenActions } = this.props;
        const { invitationError } = this.state;
        return (react_1.default.createElement(Popper_1.CustomUpPopper, { popperProps: popperProps },
            react_1.default.createElement(Popper_1.PopperBody, null,
                !!invitationError && (react_1.default.createElement(AlertMessageContainer, null,
                    react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.error, hideCloseButton: true }, "Sending invitation failed."))),
                react_1.default.createElement(InvitationForm_1.InvitationForm, { invitationValues: {
                        email: author.email || '',
                        name: author.bibliographicName.given +
                            ' ' +
                            author.bibliographicName.family,
                        role: 'Writer',
                    }, handleSubmit: this.handleInvitationSubmit, allowSubmit: true, tokenActions: tokenActions }))));
    }
}
exports.default = InviteAuthorPopperContainer;
//# sourceMappingURL=InviteAuthorPopperContainer.js.map