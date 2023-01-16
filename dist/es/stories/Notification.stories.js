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
const addon_actions_1 = require("@storybook/addon-actions");
const react_1 = require("@storybook/react");
const history_1 = require("history");
const react_2 = __importDefault(require("react"));
const Notifications_1 = require("../src/components/Notifications");
const ServiceWorker_1 = require("../src/components/ServiceWorker");
const SyncNotification_1 = __importDefault(require("../src/sync/SyncNotification"));
const routeProps = {
    history: history_1.createBrowserHistory(),
    match: {
        isExact: true,
        params: {},
        path: '',
        url: '',
    },
    location: {
        key: 'test',
        hash: '',
        pathname: '/projects',
        search: '',
        state: {},
    },
};
react_1.storiesOf('Notification', module).add('ServiceWorker', () => (react_2.default.createElement(Notifications_1.Notifications, Object.assign({ items: [
        {
            id: 'update-ready-1',
            notification: ServiceWorker_1.createUpdateReadyNotification({
                handleAccept: addon_actions_1.action('accept'),
                id: 'story',
            }),
        },
        {
            id: 'update-ready-2',
            notification: ServiceWorker_1.createUpdateReadyNotification({
                handleAccept: addon_actions_1.action('accept'),
                id: 'story',
            }),
        },
        {
            id: 'update-ready-3',
            notification: ServiceWorker_1.createUpdateReadyNotification({
                handleAccept: addon_actions_1.action('accept'),
                id: 'story',
            }),
        },
    ], removeNotification: addon_actions_1.action('dismiss') }, routeProps))));
react_1.storiesOf('SyncNotification', module)
    .add('basic', () => (react_2.default.createElement(SyncNotification_1.default, { title: "You best watch yourself", buttonText: "Sounds good", buttonAction: addon_actions_1.action('handle plain button click') })))
    .add('with primary button', () => (react_2.default.createElement(SyncNotification_1.default, { title: "Something is wrong, but we have a solution", info: "Click the primary button to give us permission", buttonText: "Cancel", buttonAction: addon_actions_1.action('handle plain button click'), primaryButtonText: "Go ahead", primaryButtonAction: addon_actions_1.action('handle primary button click') })))
    .add('with diagnostics', () => (react_2.default.createElement(SyncNotification_1.default, { title: "Uh-oh, this is really bad", info: [
        react_2.default.createElement("span", { style: { color: 'red' }, key: 0 }, "One possible action"),
        react_2.default.createElement("span", { style: { color: 'blue' }, key: 1 }, "Another possible action"),
    ], buttonText: "Cancel", buttonAction: addon_actions_1.action('handle plain button click') })));
//# sourceMappingURL=Notification.stories.js.map