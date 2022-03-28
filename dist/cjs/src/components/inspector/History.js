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
exports.HistoryPanelContainer = exports.HistoryPanel = void 0;
const AnnotationEdit_1 = __importDefault(require("@manuscripts/assets/react/AnnotationEdit"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const use_history_1 = require("../../hooks/use-history");
const use_snapshot_manager_1 = require("../../hooks/use-snapshot-manager");
const user_1 = require("../../lib/user");
const AddButton_1 = require("../AddButton");
const FormattedDateTime_1 = require("../FormattedDateTime");
const NotificationProvider_1 = require("../NotificationProvider");
const SnapshotComponentContainer = styled_components_1.default.div `
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: start;
  padding: 16px 24px;

  &::after {
    content: ' ';
    position: absolute;
    left: 33px;
    top: 42px;
    bottom: 0;
    border-left: 1px solid ${(props) => props.theme.colors.border.secondary};
  }
`;
const SnapshotComponentContainerInner = styled_components_1.default.div `
  flex-grow: 1;
  margin-left: 8px;
`;
const TitleLine = styled_components_1.default.p `
  margin-top: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;
const Title = styled_components_1.default.span `
  font-weight: 700;
  flex-grow: 1;
`;
const EditIconStyled = styled_components_1.default(AnnotationEdit_1.default) `
  path {
    fill: ${(props) => props.theme.colors.brand.medium};
  }
`;
const ErrorStatus = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.error};
  font-size: 0.8rem;
`;
const Form = styled_components_1.default.form `
  border-color: ${(props) => props.theme.colors.border.primary} !important;
  border-top: 1px solid;
  border-bottom: 1px solid;
  background: ${(props) => props.theme.colors.background.info};
`;
const List = styled_components_1.default.ul `
  margin: 0;
  padding: 0;
  list-style-type: none;
`;
const ListItem = styled_components_1.default.li `
  position: relative;
`;
const AddButtonWrapper = styled_components_1.default.div `
  padding: 16px 24px;
`;
const ViewLink = styled_components_1.default(react_router_dom_1.Link) `
  color: ${(props) => props.theme.colors.text.tertiary};
  text-decoration: none;

  &&::after {
    content: ' ';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;
const SnapshotComponent = ({ userId, date, url, children, }) => {
    return (react_1.default.createElement(SnapshotComponentContainer, null,
        react_1.default.createElement(style_guide_1.Avatar, { size: 20, src: user_1.avatarURL(userId) }),
        react_1.default.createElement(SnapshotComponentContainerInner, null,
            react_1.default.createElement(TitleLine, null,
                react_1.default.createElement(Title, null, date ? (react_1.default.createElement(FormattedDateTime_1.FormattedDateTime, { date: date })) : (react_1.default.createElement("span", null, "New Snapshot"))),
                url && react_1.default.createElement(ViewLink, { to: url }, "View")),
            children)));
};
const HistoryPanel = ({ project, manuscriptID, snapshotsList, requestTakeSnapshot, isCreateFormOpen = false, submitName, handleTextFieldChange, textFieldValue = '', status, currentUserId, }) => {
    return (react_1.default.createElement("div", null,
        requestTakeSnapshot && (react_1.default.createElement(AddButtonWrapper, null,
            react_1.default.createElement(AddButton_1.AddButton, { action: requestTakeSnapshot, size: "medium", title: "New Version" }))),
        isCreateFormOpen && (react_1.default.createElement(Form, { onSubmit: submitName },
            react_1.default.createElement(SnapshotComponent, { date: 0, userId: currentUserId },
                react_1.default.createElement(style_guide_1.TextFieldWrapper, { leftIcon: react_1.default.createElement(EditIconStyled, null) },
                    react_1.default.createElement(style_guide_1.TextField, { value: textFieldValue, onChange: handleTextFieldChange, id: "snapshot-name", placeholder: "Add Title" })),
                !!status && status === use_snapshot_manager_1.SaveSnapshotStatus.Error && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(ErrorStatus, null,
                        react_1.default.createElement("span", null, "There was an error saving your snapshot.")),
                    react_1.default.createElement(style_guide_1.PrimaryButton, { mini: true, onClick: requestTakeSnapshot }, "Retry")))))),
        react_1.default.createElement(List, null, snapshotsList.map((item) => (react_1.default.createElement(ListItem, { key: item._id },
            react_1.default.createElement(SnapshotComponent, { date: item.createdAt, userId: item.creator, url: `/projects/${project._id}/history/${item.s3Id}/manuscript/${manuscriptID}` },
                react_1.default.createElement("p", null, item.name))))))));
};
exports.HistoryPanel = HistoryPanel;
const HistoryPanelContainer = ({ project, manuscriptID, getCurrentUser, }) => {
    const { showNotification } = react_1.useContext(NotificationProvider_1.NotificationContext);
    const history = use_history_1.useHistory(project._id);
    const snapshotManager = use_snapshot_manager_1.useSnapshotManager(project, showNotification);
    const currentUserId = getCurrentUser()._id;
    if (!history.snapshotsList) {
        return null;
    }
    const isCreateFormOpen = snapshotManager.status !== use_snapshot_manager_1.SaveSnapshotStatus.Ready;
    return (react_1.default.createElement(exports.HistoryPanel, { project: project, manuscriptID: manuscriptID, snapshotsList: history.snapshotsList, isCreateFormOpen: isCreateFormOpen, requestTakeSnapshot: snapshotManager.requestTakeSnapshot, submitName: snapshotManager.submitName, handleTextFieldChange: snapshotManager.handleTextChange, textFieldValue: snapshotManager.textValue, status: snapshotManager.status, currentUserId: currentUserId }));
};
exports.HistoryPanelContainer = HistoryPanelContainer;
//# sourceMappingURL=History.js.map