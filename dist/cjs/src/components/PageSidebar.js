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
require("@manuscripts/style-guide/styles/tip.css");
const react_1 = __importDefault(require("react"));
const Panel_1 = __importDefault(require("./Panel"));
const ResizerButtons_1 = require("./ResizerButtons");
const Sidebar_1 = require("./Sidebar");
const PageSidebar = ({ children, direction, hideWhen, minSize, name, side, sidebarFooter, sidebarTitle, }) => (react_1.default.createElement(Panel_1.default, { name: name, direction: direction, hideWhen: hideWhen, side: side, minSize: minSize || 300, resizerButton: ResizerButtons_1.ResizingOutlinerButton },
    react_1.default.createElement(Sidebar_1.Sidebar, { "data-cy": 'sidebar' },
        sidebarTitle,
        react_1.default.createElement(Sidebar_1.SidebarContent, null, children),
        sidebarFooter && react_1.default.createElement(Sidebar_1.SidebarFooter, null, sidebarFooter))));
exports.default = PageSidebar;
//# sourceMappingURL=PageSidebar.js.map