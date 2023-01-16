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
const react_1 = require("@storybook/react");
const react_2 = __importDefault(require("react"));
const Page_1 = require("../src/components/Page");
const store_1 = require("../src/store");
const projects_1 = require("./data/projects");
const storeState = {
    project: projects_1.project,
    tokenData: {
        getTokenActions: () => {
            return {
                delete: () => {
                    return;
                },
                update: (token) => {
                    return;
                },
            };
        },
    },
};
react_1.storiesOf('Page', module)
    .add('A page', () => {
    const store = new store_1.GenericStore(undefined, undefined, Object.assign({}, storeState));
    return (react_2.default.createElement(store_1.GenericStoreProvider, { store: store },
        react_2.default.createElement(Page_1.Page, null,
            react_2.default.createElement(Page_1.Main, { style: { padding: '10px 20px' } }, "This is the main content"))));
})
    .add('A page with a project', () => {
    const store = new store_1.GenericStore(undefined, undefined, Object.assign({}, storeState));
    return (react_2.default.createElement(store_1.GenericStoreProvider, { store: store },
        react_2.default.createElement(Page_1.Page, null,
            react_2.default.createElement(Page_1.Main, { style: { padding: '10px 20px' } }, "This is the main content"))));
});
//# sourceMappingURL=Page.stories.js.map