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
exports.SuccessModal = void 0;
const SuccessCircle_1 = __importDefault(require("@manuscripts/assets/react/SuccessCircle"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const ProgressIndicator_1 = require("../ProgressIndicator");
const ModalBody = styled_components_1.default.div `
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: ${(props) => props.theme.grid.radius.default};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  background: ${(props) => props.theme.colors.background.primary};
`;
const ModalMain = styled_components_1.default.div `
  flex: 1;
  padding: ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 8}px;
  max-height: 70vh;
  overflow-y: auto;
  text-align: center;
  display: relative;
`;
const ModalStatus = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: 120%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ModalStatusText = styled_components_1.default.div `
  margin-left: 12px;
`;
const ModalFooter = styled_components_1.default(style_guide_1.ButtonGroup) `
  padding: ${(props) => props.theme.grid.unit * 4}px;
`;
const SuccessModal = ({ handleDone, status, }) => (react_1.default.createElement(style_guide_1.StyledModal, { isOpen: true, onRequestClose: handleDone, shouldCloseOnOverlayClick: true },
    react_1.default.createElement(ModalBody, null,
        react_1.default.createElement(ModalMain, null,
            react_1.default.createElement(ProgressIndicator_1.ProgressIndicator, { symbols: ProgressIndicator_1.IndicatorKind.Project }),
            react_1.default.createElement(ModalStatus, null,
                react_1.default.createElement(SuccessCircle_1.default, { width: 24, height: 24 }),
                react_1.default.createElement(ModalStatusText, null, status))),
        react_1.default.createElement(ModalFooter, null,
            react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: handleDone }, "Done")))));
exports.SuccessModal = SuccessModal;
//# sourceMappingURL=SuccessModal.js.map