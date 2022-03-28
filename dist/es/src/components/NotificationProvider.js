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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationProvider = exports.NotificationContext = void 0;
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
// import { useHistory, useLocation, useParams } from 'react-router-dom'
const config_1 = __importDefault(require("../config"));
const SyncNotificationManager_1 = __importDefault(require("../sync/SyncNotificationManager"));
const Notifications_1 = require("./Notifications");
exports.NotificationContext = react_1.default.createContext({
    showNotification: () => null,
    removeNotification: () => null,
});
const NotificationProvider = ({ children }) => {
    const [state, setState] = react_1.useState({
        notifications: [],
    });
    const showNotification = (id, notification) => {
        setState((state) => {
            const item = { id, notification };
            return Object.assign(Object.assign({}, state), { notifications: [
                    item,
                    ...state.notifications.filter((item) => item.id !== id),
                ] });
        });
    };
    const removeNotification = (id) => {
        setState((state) => (Object.assign(Object.assign({}, state), { notifications: state.notifications.filter((notification) => notification.id !== id) })));
    };
    const value = {
        removeNotification,
        showNotification,
    };
    // const history = useHistory()
    // const location = useLocation()
    const renderNotifications = () => {
        const notifications = config_1.default.rxdb.enabled
            ? state.notifications.concat({
                id: 'sync',
                notification: SyncNotificationManager_1.default,
            })
            : state.notifications;
        if (!notifications.length) {
            return null;
        }
        return react_dom_1.default.createPortal(react_1.default.createElement(Notifications_1.Notifications, { items: notifications, removeNotification: removeNotification }), document.getElementById('notifications'));
    };
    return (react_1.default.createElement(exports.NotificationContext.Provider, { value: value },
        children,
        renderNotifications()));
};
exports.NotificationProvider = NotificationProvider;
//# sourceMappingURL=NotificationProvider.js.map