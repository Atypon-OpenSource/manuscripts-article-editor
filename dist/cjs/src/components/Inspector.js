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
exports.InspectorTabPanelHeading = exports.InspectorTab = exports.InspectorTabPanel = exports.PaddedInspectorTabPanels = exports.InspectorTabPanels = exports.InspectorPanelTabList = exports.InspectorTabList = exports.InspectorTabs = exports.InspectorContainer = void 0;
const tabs_1 = require("@reach/tabs");
const styled_components_1 = __importDefault(require("styled-components"));
exports.InspectorContainer = styled_components_1.default.div `
  border-left: 1px solid ${(props) => props.theme.colors.border.tertiary};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  height: 100%;
  overflow: hidden;
`;
exports.InspectorTabs = styled_components_1.default(tabs_1.Tabs) `
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;
exports.InspectorTabList = styled_components_1.default(tabs_1.TabList) `
  && {
    background: none;
    justify-content: center;
    font-size: ${(props) => props.theme.font.size.normal};
    color: ${(props) => props.theme.colors.text.primary};
    flex-shrink: 0;
  }
`;
exports.InspectorPanelTabList = styled_components_1.default(exports.InspectorTabList) `
  margin-bottom: ${(props) => props.theme.grid.unit * 4}px;
`;
exports.InspectorTabPanels = styled_components_1.default(tabs_1.TabPanels) `
  flex: 1;
  overflow-y: auto;
`;
exports.PaddedInspectorTabPanels = styled_components_1.default(exports.InspectorTabPanels) `
  padding-bottom: 64px; // allow space for chat button
`;
exports.InspectorTabPanel = styled_components_1.default(tabs_1.TabPanel) `
  font-size: ${(props) => props.theme.font.size.normal};
  color: ${(props) => props.theme.colors.text.secondary};
`;
exports.InspectorTab = styled_components_1.default(tabs_1.Tab) `
  && {
    background: none;
    padding: ${(props) => props.theme.grid.unit * 2}px;
    border-bottom-width: 1px;

    &:focus {
      outline: none;
    }

    &[data-selected] {
      border-bottom-color: ${(props) => props.theme.colors.brand.default};
      color: ${(props) => props.theme.colors.brand.default};
    }
  }
`;
exports.InspectorTabPanelHeading = styled_components_1.default.div `
  margin-bottom: ${(props) => props.theme.grid.unit * 4}px;
`;
//# sourceMappingURL=Inspector.js.map