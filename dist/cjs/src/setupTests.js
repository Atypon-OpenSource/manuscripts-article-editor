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
const register_1 = __importDefault(require("babel-plugin-require-context-hook/register"));
const enzyme_1 = require("enzyme");
const enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
const uuid_1 = require("uuid");
register_1.default();
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
process.env.API_BASE_URL = 'https://127.0.0.1/';
const supportedCommands = [];
Object.defineProperty(document, 'queryCommandSupported', {
    value: (cmd) => supportedCommands.includes(cmd),
});
Object.defineProperty(document, 'execCommand', {
    value: (cmd) => supportedCommands.includes(cmd),
});
if (!window.URL.createObjectURL) {
    Object.defineProperty(window.URL, 'createObjectURL', {
        value: jest.fn(() => 'blob:https://localhost/' + uuid_1.v4()),
    });
}
if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
        value: jest.fn((media) => ({
            matches: false,
            media,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        })),
    });
}
// @ts-ignore
global.fetch = jest.fn(() => Promise.resolve());
//# sourceMappingURL=setupTests.js.map