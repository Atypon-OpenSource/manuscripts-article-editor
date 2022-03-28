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
exports.Time = exports.AvatarContainer = exports.CorrectionItem = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const react_tooltip_1 = __importDefault(require("react-tooltip"));
const styled_components_1 = __importDefault(require("styled-components"));
const roles_1 = require("../../lib/roles");
const FormattedDateTime_1 = require("../FormattedDateTime");
const CorrectionItem = ({ correction, getCollaboratorById, project }) => {
    const user = getCollaboratorById(correction.status.editorProfileID);
    const timestamp = correction.contributions[0].timestamp;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(SnippetText, { isRejected: correction.status.label === 'rejected' }, correction.insertion),
        correction.deletion && (react_1.default.createElement(SnippetText, { isRejected: correction.status.label === 'rejected' },
            react_1.default.createElement("del", null, correction.deletion))),
        user ? (react_1.default.createElement(exports.AvatarContainer, { key: correction._id },
            react_1.default.createElement("div", { "data-tip": true, "data-for": correction._id },
                react_1.default.createElement(style_guide_1.Avatar, { src: user === null || user === void 0 ? void 0 : user.avatar, size: 22 })),
            react_1.default.createElement(react_tooltip_1.default, { id: correction._id, place: "bottom", effect: "solid", offset: { top: 4 }, className: "tooltip" },
                react_1.default.createElement(TooltipHeader, null, correction.status.label === 'proposed'
                    ? 'Created by'
                    : correction.status.label === 'accepted'
                        ? 'Approved by'
                        : 'Rejected by'),
                react_1.default.createElement(Name, null, user.bibliographicName.given +
                    ' ' +
                    user.bibliographicName.family),
                roles_1.getUserRole(project, user.userID),
                react_1.default.createElement(Date, null,
                    FormattedDateTime_1.FormattedDateTime({
                        date: timestamp,
                        options: { year: 'numeric', month: 'numeric', day: 'numeric' },
                    }),
                    ",",
                    ' ',
                    FormattedDateTime_1.FormattedDateTime({
                        date: timestamp,
                        options: { hour: 'numeric', minute: 'numeric' },
                    }))))) : null,
        react_1.default.createElement(exports.Time, null,
            ' ',
            FormattedDateTime_1.FormattedDateTime({
                date: timestamp,
                options: { hour: 'numeric', minute: 'numeric' },
            }))));
};
exports.CorrectionItem = CorrectionItem;
const Text = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.normal};
`;
const SnippetText = styled_components_1.default(Text) `
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: ${(props) => props.theme.grid.unit}px;
  color: ${(props) => props.theme.colors.text.primary};
  opacity: ${(props) => (props.isRejected ? 0.5 : 1)};
`;
const TooltipHeader = styled_components_1.default(Text) `
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
`;
const Name = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.normal};
  line-height: ${(props) => props.theme.font.lineHeight.normal};
  font-weight: 700;
`;
const Date = styled_components_1.default(Text) `
  font-weight: 700;
  margin-top: ${(props) => props.theme.grid.unit * 2}px;
`;
exports.AvatarContainer = styled_components_1.default.div `
  margin-right: ${(props) => props.theme.grid.unit}px;
  position: relative;
  visibility: hidden;
  .tooltip {
    border-radius: 6px;
    padding: ${(props) => props.theme.grid.unit * 4}px;
  }

  & img {
    border: 1px solid transparent;
  }

  &:hover {
    & img {
      border: 1px solid #bce7f6;
    }
  }
`;
exports.Time = styled_components_1.default.span `
  visibility: hidden;
`;
//# sourceMappingURL=CorrectionItem.js.map