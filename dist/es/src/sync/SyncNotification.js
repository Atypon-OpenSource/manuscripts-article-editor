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
exports.NotificationInfo = void 0;
const AttentionOrange_1 = __importDefault(require("@manuscripts/assets/react/AttentionOrange"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Notifications_1 = require("../components/Notifications");
exports.NotificationInfo = styled_components_1.default.div `
  color: inherit;
  font-size: 80%;
`;
const SyncNotification = ({ title, info, buttonText, buttonAction, primaryButtonText, primaryButtonAction, }) => {
    const innards = react_1.default.Children.map(info, (child) => (react_1.default.createElement(react_1.default.Fragment, null,
        child,
        "\u2003")));
    return (react_1.default.createElement(Notifications_1.NotificationPrompt, null,
        react_1.default.createElement(Notifications_1.NotificationHead, null,
            react_1.default.createElement(AttentionOrange_1.default, null),
            react_1.default.createElement(Notifications_1.NotificationMessage, null,
                react_1.default.createElement(Notifications_1.NotificationTitle, null, title),
                innards ? react_1.default.createElement(exports.NotificationInfo, null, innards) : null)),
        react_1.default.createElement(Notifications_1.NotificationActions, null,
            react_1.default.createElement(style_guide_1.SecondaryButton, { onClick: buttonAction }, buttonText),
            primaryButtonText && primaryButtonAction && (react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: primaryButtonAction }, primaryButtonText)))));
};
exports.default = SyncNotification;
//# sourceMappingURL=SyncNotification.js.map