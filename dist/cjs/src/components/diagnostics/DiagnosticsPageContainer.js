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
const style_guide_1 = require("@manuscripts/style-guide");
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../../config"));
const store_1 = require("../../store");
const CollectionManager_1 = __importDefault(require("../../sync/CollectionManager"));
const SyncStore_1 = require("../../sync/SyncStore");
const GlobalMenu_1 = require("../nav/GlobalMenu");
const Page_1 = require("../Page");
const StorageInfo_1 = require("./StorageInfo");
const Container = styled_components_1.default.div `
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
`;
const Diagnostics = styled_components_1.default.div `
  padding: 0 ${(props) => props.theme.grid.unit * 4}px;
`;
const RowHeader = styled_components_1.default.th `
  text-align: right;
`;
const ProjectsList = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 5}px;
`;
const ProjectLink = styled_components_1.default(react_router_dom_1.Link) `
  text-decoration: none;
  color: inherit;
  display: block;
  padding: ${(props) => props.theme.grid.unit}px;

  &:hover {
    text-decoration: underline;
  }
`;
const ProjectTitle = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.xlarge};
  font-weight: ${(props) => props.theme.font.weight.medium};
  font-style: normal;
  flex: 1;
`;
const PlaceholderTitle = styled_components_1.default(title_editor_1.Title) `
  color: ${(props) => props.theme.colors.text.secondary};
`;
const DiagnosticsPageContainer = () => {
    const [apiVersion, setApiVersion] = react_1.useState();
    const [gatewayVersion, setGatewayVersion] = react_1.useState();
    const [projects] = store_1.useStore((store) => store.projects);
    react_1.useEffect(() => {
        fetch(`${config_1.default.api.url}/app/version`)
            .then((response) => response.json())
            .then((data) => {
            setApiVersion(data.version);
        })
            .catch((error) => {
            console.error(error);
        });
    }, []);
    react_1.useEffect(() => {
        fetch(config_1.default.gateway.url)
            .then((response) => response.json())
            .then((data) => {
            setGatewayVersion(data.version);
        })
            .catch((error) => {
            console.error(error);
        });
    }, []);
    const handleRestart = react_1.useCallback(() => {
        CollectionManager_1.default.restartAll();
    }, []);
    const syncState = SyncStore_1.useSyncState();
    return (react_1.default.createElement(Page_1.Page, null,
        react_1.default.createElement(Page_1.Main, null,
            react_1.default.createElement(Container, null,
                react_1.default.createElement(GlobalMenu_1.GlobalMenu, { active: 'diagnostics' }),
                react_1.default.createElement(Diagnostics, null,
                    react_1.default.createElement("h2", null, "Versions"),
                    react_1.default.createElement("table", null,
                        react_1.default.createElement("tbody", null,
                            react_1.default.createElement("tr", null,
                                react_1.default.createElement(RowHeader, null, "Client"),
                                react_1.default.createElement("td", null, config_1.default.version)),
                            react_1.default.createElement("tr", null,
                                react_1.default.createElement(RowHeader, null, "API"),
                                react_1.default.createElement("td", null, apiVersion || 'Loading…')),
                            react_1.default.createElement("tr", null,
                                react_1.default.createElement(RowHeader, null, "Gateway"),
                                react_1.default.createElement("td", null, gatewayVersion || 'Loading…')))),
                    react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: handleRestart }, "Restart sync"),
                    react_1.default.createElement("h2", null, "Storage"),
                    react_1.default.createElement(StorageInfo_1.StorageInfo, null),
                    react_1.default.createElement("h2", null, "Project Diagnostics"),
                    react_1.default.createElement(ProjectsList, null, projects.map((project) => (react_1.default.createElement(ProjectTitle, { key: project._id },
                        react_1.default.createElement(ProjectLink, { to: `/projects/${project._id}/diagnostics` }, project.title ? (react_1.default.createElement(title_editor_1.Title, { value: project.title })) : (react_1.default.createElement(PlaceholderTitle, { value: 'Untitled Project' }))))))),
                    react_1.default.createElement("h2", null, "All Collections"),
                    react_1.default.createElement("table", null,
                        react_1.default.createElement("thead", null,
                            react_1.default.createElement("tr", null,
                                react_1.default.createElement("th", null, "Collection"),
                                react_1.default.createElement("th", null, "Push"),
                                react_1.default.createElement("th", null, "Pull"),
                                react_1.default.createElement("th", null, "Closed"))),
                        react_1.default.createElement("tbody", null, Object.entries(syncState).map(([collection, data]) => (react_1.default.createElement("tr", { key: collection },
                            react_1.default.createElement("td", null, collection),
                            react_1.default.createElement("td", null, data.state.push),
                            react_1.default.createElement("td", null, data.state.pull),
                            react_1.default.createElement("td", null, data.state.closed)))))))))));
};
exports.default = DiagnosticsPageContainer;
//# sourceMappingURL=DiagnosticsPageContainer.js.map