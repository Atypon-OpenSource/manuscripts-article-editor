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
exports.ProjectDiagnosticsPageContainer = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const CollectionManager_1 = __importDefault(require("../../sync/CollectionManager"));
const Container = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 4}px;
`;
const ButtonWrapper = styled_components_1.default.div `
  margin: 1rem 0;
`;
const DownloadButton = styled_components_1.default.a `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.grid.unit * 2}px;
  border-radius: ${(props) => props.theme.grid.radius.small};
  border: 1px solid #888;
  text-decoration: none;
  color: inherit;

  &:hover {
    background-color: #eee;
  }
`;
exports.ProjectDiagnosticsPageContainer = react_1.default.memo(({ projectID, data }) => {
    const [downloadURL, setDownloadURL] = react_1.useState();
    react_1.useEffect(() => {
        const projectDump = { version: '2.0', data };
        const json = JSON.stringify(projectDump, null, 2);
        const blob = new Blob([json]);
        const downloadURL = window.URL.createObjectURL(blob);
        setDownloadURL(downloadURL);
    }, [projectID, data]);
    const [syncErrors, setSyncErrors] = react_1.useState([]);
    const [syncErrorsLoadError, setSyncErrorsLoadError] = react_1.useState(false);
    react_1.useEffect(() => {
        const collection = CollectionManager_1.default.getCollection(`project-${projectID}`);
        if (!collection || !collection.conflictManager) {
            return;
        }
        collection.conflictManager
            .getSyncErrors()
            .then((errors) => {
            setSyncErrors(errors);
        })
            .catch(() => {
            setSyncErrorsLoadError(true);
        });
    }, [projectID]);
    const handleRestart = react_1.useCallback(() => {
        CollectionManager_1.default.restartAll();
    }, []);
    if (!downloadURL) {
        return react_1.default.createElement("div", null, "Loading project data\u2026");
    }
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(ButtonWrapper, null,
            react_1.default.createElement(DownloadButton, { href: downloadURL, download: `${projectID}.json` }, "Download project data as JSON")),
        react_1.default.createElement(ButtonWrapper, null,
            react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: handleRestart }, "Restart Sync")),
        syncErrors.length ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("h2", null, "Current Sync Errors:"),
            react_1.default.createElement("ul", null,
                syncErrors.map((error) => (react_1.default.createElement("li", { key: error._id },
                    react_1.default.createElement("strong", null,
                        error.type,
                        ": "),
                    error._id,
                    " ",
                    error.message,
                    "(",
                    new Date(error.createdAt * 1000).toLocaleString(),
                    ")"))),
                syncErrorsLoadError && react_1.default.createElement("li", null, "Error loading sync errors")))) : null));
});
//# sourceMappingURL=ProjectDiagnosticsPageContainer.js.map