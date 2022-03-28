"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionDialog = void 0;
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
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const lean_workflow_gql_1 = require("../../../lib/lean-workflow-gql");
const Loading_1 = require("../../Loading");
const UserProvider_1 = require("./provider/UserProvider");
const ExceptionDialog = ({ errorCode }) => {
    const setTaskOnHold = lean_workflow_gql_1.useSetTaskOnHold();
    const [toggleDialog, setToggleDialog] = react_1.useState(true);
    const [loading, setLoading] = react_1.useState(false);
    const [alert, setAlert] = react_1.useState(undefined);
    const { lwUser, submissionId } = react_1.useContext(UserProvider_1.UserContext);
    const { title, description } = style_guide_1.errorsDecoder(errorCode);
    const onCloseClick = react_1.useCallback(() => {
        setToggleDialog(false);
    }, []);
    const onAssignClick = react_1.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        return yield setTaskOnHold({ submissionId, errorCode })
            .then(({ data }) => {
            if (data === null || data === void 0 ? void 0 : data.setTaskOnHold) {
                setAlert(style_guide_1.AlertMessageType.success);
            }
            else {
                setAlert(style_guide_1.AlertMessageType.error);
            }
            setLoading(false);
        })
            .catch(() => {
            setAlert(style_guide_1.AlertMessageType.error);
            setLoading(false);
        });
    }), [setTaskOnHold, submissionId, errorCode]);
    const dialogMessages = react_1.useMemo(() => lwUser.role.id === 'pe'
        ? {
            header: title,
            message: description,
            secondaryMessage: 'Take care of the reported issue to unblock the process.',
            actions: {
                primary: {
                    action: onAssignClick,
                    title: 'Assign to me',
                },
                secondary: {
                    action: onCloseClick,
                    title: 'Cancel',
                },
            },
        }
        : {
            header: title,
            message: description,
            secondaryMessage: 'If the problem persists, please assign the task to the Production Editor to take care of the issue.',
            actions: {
                primary: {
                    action: onAssignClick,
                    title: 'Assign',
                },
                secondary: {
                    action: onCloseClick,
                    title: 'Close',
                },
            },
        }, [lwUser.role.id, onAssignClick, onCloseClick, title, description]);
    return (react_1.default.createElement(react_1.default.Fragment, null, (loading && (react_1.default.createElement(Loading_1.LoadingOverlay, null,
        react_1.default.createElement(Loading_1.Loading, null, "Assigning task to the Production Editor\u2026")))) ||
        (alert && (react_1.default.createElement(AlertWrapper, null,
            react_1.default.createElement(style_guide_1.AlertMessage, { type: alert }, (alert === style_guide_1.AlertMessageType.success &&
                'The task was successfully assigned to the Production Editor') ||
                'Un able to assign task to the Production Editor')))) || (react_1.default.createElement(style_guide_1.Dialog, { isOpen: toggleDialog, category: style_guide_1.Category.error, header: dialogMessages.header, message: dialogMessages.message, actions: dialogMessages.actions },
        react_1.default.createElement(SecondaryMessage, null,
            dialogMessages.secondaryMessage,
            lwUser.role.id === 'pe' && (react_1.default.createElement(TextButton, null, "Contact support")))))));
};
exports.ExceptionDialog = ExceptionDialog;
const SecondaryMessage = styled_components_1.default.div `
  word-wrap: break-word;
  margin: ${(props) => props.theme.grid.unit * 2}px 0;
  font: ${(props) => props.theme.font.weight.normal}
    ${(props) => props.theme.font.size.medium} / 1
    ${(props) => props.theme.font.family.sans};
  color: ${(props) => props.theme.colors.text.secondary};
  line-height: 1.5;
`;
// TODO:: move this to style-guide as we use it for dashboard
const TextButton = styled_components_1.default(style_guide_1.TertiaryButton) `
  &:not([disabled]):hover,
  &:not([disabled]):focus {
    border-color: transparent;
    background: transparent;
    color: ${(props) => props.theme.colors.brand.dark};
  }
  padding: 0;
  width: 100%;
  justify-content: start;
  font-size: ${(props) => props.theme.font.size.medium};
  text-decoration: underline;
`;
const AlertWrapper = styled_components_1.default.div `
  position: fixed;
  z-index: 10;
  margin: 0 ${(props) => props.theme.grid.unit * 20}px
    ${(props) => props.theme.grid.unit * 11}px
    ${(props) => props.theme.grid.unit * 20}px;
  bottom: 0;
  right: 0;
  left: 0;
`;
//# sourceMappingURL=ExceptionDialog.js.map