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
exports.HistoricalView = void 0;
const ArrowDownBlack_1 = __importDefault(require("@manuscripts/assets/react/ArrowDownBlack"));
const react_1 = __importStar(require("react"));
const react_router_1 = require("react-router");
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const use_history_1 = require("../../hooks/use-history");
const Inspector_1 = require("../Inspector");
const History_1 = require("../inspector/History");
const Page_1 = require("../Page");
const Panel_1 = __importDefault(require("../Panel"));
const EditorContainer_1 = require("../projects/EditorContainer");
const ResizerButtons_1 = require("../ResizerButtons");
const HistoricalManuscriptView_1 = require("./HistoricalManuscriptView");
const HistoryMetadata_1 = require("./HistoryMetadata");
const HistorySidebar_1 = require("./HistorySidebar");
const HistoryEditorBody = styled_components_1.default(EditorContainer_1.EditorBody) `
  padding: 20px 24px;
`;
const BackLinkWrapper = styled_components_1.default.div `
  margin-bottom: 20px;
`;
const BackLink = styled_components_1.default(react_router_dom_1.Link) `
  display: inline-block;
  padding: 8px 16px;
  color: white;
  background: ${(props) => props.theme.colors.button.primary.background.default};
  text-decoration: inherit;
  border-radius: ${(props) => props.theme.grid.radius.default};

  svg {
    padding-right: 4px;
    transform: rotate(90deg);
  }

  svg path {
    stroke: white;
  }
`;
const HistoryPanelContainer = styled_components_1.default.div `
  max-height: 100%;
  overflow-y: auto;
`;
const HistoricalView = ({ project, manuscript, snapshotID, handleClose, selectSnapshot, viewHandler, user, }) => {
    const { loadSnapshotStatus, loadSnapshot, currentSnapshot, snapshotsList, } = use_history_1.useHistory(project._id);
    const browserHistory = react_router_1.useHistory();
    react_1.useEffect(() => {
        // promise rejection in openSnapshot is handled by setting openSnapshotStatus
        loadSnapshot(snapshotID, manuscript._id);
    }, [project, snapshotID, manuscript, loadSnapshot]);
    if (loadSnapshotStatus !== use_history_1.SnapshotStatus.Done || !currentSnapshot) {
        return null;
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(HistorySidebar_1.HistorySidebar, { project: project, manuscript: manuscript, doc: currentSnapshot.doc }),
        react_1.default.createElement(Page_1.Main, null,
            react_1.default.createElement(EditorContainer_1.EditorContainer, null,
                react_1.default.createElement(EditorContainer_1.EditorContainerInner, null,
                    react_1.default.createElement(HistoryEditorBody, null,
                        react_1.default.createElement(BackLinkWrapper, null,
                            react_1.default.createElement(BackLink, { to: "#", onClick: (e) => {
                                    e.preventDefault();
                                    handleClose();
                                } },
                                react_1.default.createElement(ArrowDownBlack_1.default, null),
                                react_1.default.createElement("span", null, "Back to Current Version"))),
                        react_1.default.createElement(HistoryMetadata_1.HistoryMetadata, { manuscript: manuscript, modelMap: currentSnapshot.modelMap }),
                        react_1.default.createElement(HistoricalManuscriptView_1.HistoricalManuscriptView, { project: project, browserHistory: browserHistory, manuscript: manuscript, currentSnapshot: currentSnapshot, user: user }))))),
        react_1.default.createElement(Panel_1.default, { name: "history", minSize: 300, direction: "row", side: "start", hideWhen: "max-width: 900px", resizerButton: ResizerButtons_1.ResizingInspectorButton },
            react_1.default.createElement(Inspector_1.InspectorContainer, null,
                react_1.default.createElement(HistoryPanelContainer, null,
                    react_1.default.createElement(History_1.HistoryPanel, { project: project, manuscriptID: manuscript._id, snapshotsList: snapshotsList, currentUserId: "", onSwitchSnapshot: (snapshot) => {
                            handleClose();
                            selectSnapshot(snapshot);
                            viewHandler(snapshot);
                        } }))))));
};
exports.HistoricalView = HistoricalView;
//# sourceMappingURL=HistoricalView.js.map