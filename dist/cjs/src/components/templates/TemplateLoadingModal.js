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
exports.TemplateLoadingModal = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const ProgressIndicator_1 = require("../ProgressIndicator");
const ModalBody = styled_components_1.default(style_guide_1.ModalMain) `
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  text-align: center;
`;
const ModalStatus = styled_components_1.default.div `
  align-items: center;
  color: ${(props) => props.theme.colors.text.secondary};
  display: flex;
  font-size: 120%;
  justify-content: center;
`;
const TemplateLoadingModal = ({ handleCancel, status, }) => (react_1.default.createElement(style_guide_1.StyledModal, { isOpen: true, onRequestClose: handleCancel, shouldCloseOnOverlayClick: false },
    react_1.default.createElement(style_guide_1.ModalContainer, null,
        react_1.default.createElement(style_guide_1.ModalHeader, null,
            react_1.default.createElement(style_guide_1.CloseButton, { onClick: handleCancel })),
        react_1.default.createElement(ModalBody, null,
            react_1.default.createElement(ProgressIndicator_1.ProgressIndicator, { symbols: ProgressIndicator_1.IndicatorKind.Project }),
            react_1.default.createElement(ModalStatus, null, status)))));
exports.TemplateLoadingModal = TemplateLoadingModal;
//# sourceMappingURL=TemplateLoadingModal.js.map