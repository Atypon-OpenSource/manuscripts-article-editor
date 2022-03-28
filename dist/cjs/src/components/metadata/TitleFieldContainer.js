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
exports.TitleFieldContainer = void 0;
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const use_synced_data_1 = require("../../hooks/use-synced-data");
const TitleFieldContainer = ({ editable, title, handleChange, handleStateChange }) => {
    const [value, setValue, setEditing] = use_synced_data_1.useSyncedData(title, handleChange);
    return (react_1.default.createElement(StyledTitleField, { id: 'manuscript-title-field', autoFocus: !title, editable: editable, value: value, handleChange: setValue, handleFocused: setEditing, handleStateChange: handleStateChange, 
        // eslint-disable-next-line jsx-a11y/tabindex-no-positive
        tabIndex: 2 }));
};
exports.TitleFieldContainer = TitleFieldContainer;
const StyledTitleField = styled_components_1.default(title_editor_1.TitleField) `
  flex: 1;

  & .ProseMirror {
    cursor: text;
    font-family: 'PT Serif', serif;
    font-size: 28px;
    font-weight: ${(props) => props.theme.font.weight.bold};
    line-height: 1.43;

    &:focus {
      outline: none;
    }

    &.empty-node::before {
      position: absolute;
      color: ${(props) => props.theme.colors.text.muted};
      cursor: text;
      content: 'Untitled Manuscript';
      pointer-events: none;
    }

    &.empty-node:hover::before {
      color: ${(props) => props.theme.colors.text.secondary};
    }
  }
`;
//# sourceMappingURL=TitleFieldContainer.js.map