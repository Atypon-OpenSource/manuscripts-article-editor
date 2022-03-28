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
// eslint-disable-next-line jest/no-mocks-import
require("../../src/lib/__mocks__/adapter");
const react_1 = require("@storybook/react");
const react_2 = __importDefault(require("react"));
const react_dnd_1 = require("react-dnd");
const react_dnd_test_backend_1 = require("react-dnd-test-backend");
const react_router_dom_1 = require("react-router-dom");
const IntlProvider_1 = __importDefault(require("../../src/components/IntlProvider"));
const ModalProvider_1 = require("../../src/components/ModalProvider");
const theme_1 = require("../../src/theme/theme");
const ThemeProvider_1 = require("../../src/theme/ThemeProvider");
const Story_1 = require("../components/Story");
react_1.addDecorator((story) => (react_2.default.createElement(react_dnd_1.DndProvider, { backend: react_dnd_test_backend_1.TestBackend },
    react_2.default.createElement(IntlProvider_1.default, null,
        react_2.default.createElement(ThemeProvider_1.ThemeProvider, null,
            react_2.default.createElement(react_router_dom_1.MemoryRouter, { initialEntries: ['/'] },
                react_2.default.createElement(ModalProvider_1.ModalProvider, null,
                    react_2.default.createElement(Story_1.Story, null,
                        react_2.default.createElement(theme_1.GlobalStyle, { suppressMultiMountWarning: true }),
                        react_2.default.createElement("div", null, story())))))))));
//# sourceMappingURL=preview.js.map