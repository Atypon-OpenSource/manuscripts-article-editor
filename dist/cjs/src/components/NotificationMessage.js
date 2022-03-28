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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.createNotification = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const NotificationProvider_1 = require("./NotificationProvider");
const Notifications_1 = require("./Notifications");
const createNotification = ({ id, message, }) => (props) => (react_1.default.createElement(Notifications_1.NotificationPrompt, null,
    react_1.default.createElement(Notifications_1.NotificationHead, null,
        react_1.default.createElement(Notifications_1.NotificationIcon, null),
        react_1.default.createElement(Notifications_1.NotificationMessage, null,
            react_1.default.createElement(Notifications_1.NotificationTitle, null, message))),
    react_1.default.createElement(Notifications_1.NotificationActions, null,
        react_1.default.createElement(style_guide_1.SecondaryButton, { onClick: props.removeNotification }, "Dismiss"))));
exports.createNotification = createNotification;
const Notification = ({ children, message, id }) => {
    const { removeNotification, showNotification } = react_1.useContext(NotificationProvider_1.NotificationContext);
    react_1.useEffect(() => {
        showNotification(id, exports.createNotification({ id, message }));
        return () => {
            removeNotification(id);
        };
    }, [id, message, removeNotification, showNotification]);
    return react_1.default.createElement(react_1.default.Fragment, null, children);
};
exports.Notification = Notification;
//# sourceMappingURL=NotificationMessage.js.map