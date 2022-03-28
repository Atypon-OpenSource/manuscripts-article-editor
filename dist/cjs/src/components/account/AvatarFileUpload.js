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
exports.AvatarFileUpload = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const react_avatar_editor_1 = __importDefault(require("react-avatar-editor"));
const styled_components_1 = __importDefault(require("styled-components"));
const Sidebar_1 = require("../Sidebar");
const ImportAvatarContainer_1 = __importDefault(require("./ImportAvatarContainer"));
const DropZone = styled_components_1.default.div `
  width: 150px;
  height: 150px;
  background-color: ${(props) => props.theme.colors.background.secondary};
  border: dashed 3px ${(props) => props.theme.colors.border.primary};
  border-radius: 50%;
`;
const UploadContainer = styled_components_1.default.div `
  color: ${(props) => props.isOver ? '#6fb7ff' : '#acb8c7'};
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const UploadBox = styled_components_1.default.div `
  margin-top: 30px;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
`;
const UploadLabel = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.xlarge};
  line-height: ${(props) => props.theme.font.lineHeight.large};
  letter-spacing: -0.4px;
  text-align: center;
  color: ${(props) => props.theme.colors.text.primary};
`;
const UploadBoxInnerText = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.medium}
  line-height: ${(props) => props.theme.font.lineHeight.large};
  letter-spacing: -0.4px;
  text-align: center;
  color: ${(props) => props.theme.colors.text.secondary};
`;
const UploadBoxBrowse = styled_components_1.default.span `
  margin: 0 2px;
  font-size: ${(props) => props.theme.font.size.medium};
  line-height: ${(props) => props.theme.font.lineHeight.large};
  letter-spacing: -0.4px;
  text-align: center;
  color: ${(props) => props.theme.colors.brand.default};
  cursor: pointer;
`;
const ButtonsContainer = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const SaveAvatarButton = styled_components_1.default(style_guide_1.PrimaryButton) `
  margin-bottom: 10px;
`;
const CancelButton = styled_components_1.default(style_guide_1.SecondaryButton) `
  margin-bottom: 10px;
`;
const AvatarContainer = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  background-color: ${(props) => props.theme.colors.background.primary};
  overflow: hidden;
`;
const RangeInput = styled_components_1.default.input.attrs({
    type: 'range',
}) ``;
const RoundedBorders = styled_components_1.default.div `
  width: 150px;
  height: 150px;
  background-color: ${(props) => props.theme.colors.background.primary};
  border: solid 1px ${(props) => props.theme.colors.border.primary};
  border-radius: 50%;
`;
const AvatarFileUpload = ({ newAvatar, avatarZoom, avatarEditorRef, userWithAvatar, importAvatar, handleCancel, handleSaveAvatar, handleDeleteAvatar, handleAvatarZoom, }) => (react_1.default.createElement(Sidebar_1.ModalSidebar, null,
    !newAvatar ? (react_1.default.createElement(ImportAvatarContainer_1.default, { importAvatar: importAvatar, render: ({ isImporting, isOver }) => (react_1.default.createElement(UploadContainer, { isOver: isOver },
            userWithAvatar.avatar ? (react_1.default.createElement(RoundedBorders, null,
                react_1.default.createElement(style_guide_1.Avatar, { size: 150, src: userWithAvatar.avatar }))) : (react_1.default.createElement(DropZone, null)),
            react_1.default.createElement(UploadBox, null, isImporting ? (react_1.default.createElement(UploadLabel, null, "Importing\u2026")) : (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(UploadLabel, null, "Drag file above"),
                react_1.default.createElement(UploadBoxInnerText, null,
                    "or ",
                    react_1.default.createElement(UploadBoxBrowse, null, "browse"),
                    " for a file",
                    userWithAvatar.avatar && react_1.default.createElement("div", null, "to replace the image"))))))) })) : (react_1.default.createElement(AvatarContainer, null,
        react_1.default.createElement(react_avatar_editor_1.default, { ref: avatarEditorRef, image: newAvatar.src, width: 150, height: 150, color: [148, 148, 148, 0.6], borderRadius: 180, scale: avatarZoom }),
        react_1.default.createElement(RangeInput, { min: 1, max: 4, step: 0.2, value: avatarZoom, onChange: handleAvatarZoom }))),
    react_1.default.createElement(ButtonsContainer, null,
        react_1.default.createElement(SaveAvatarButton, { onClick: handleSaveAvatar, disabled: !newAvatar }, "Save Avatar"),
        userWithAvatar.avatar && (react_1.default.createElement(SaveAvatarButton, { onClick: handleDeleteAvatar, disabled: !!newAvatar }, "Remove Avatar")),
        react_1.default.createElement(CancelButton, { onClick: handleCancel }, "Cancel"))));
exports.AvatarFileUpload = AvatarFileUpload;
//# sourceMappingURL=AvatarFileUpload.js.map