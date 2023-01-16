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
exports.EmptyCommentsListPlaceholder = exports.SeeResolvedCheckbox = exports.CommentFilter = exports.Checkbox = exports.LabelText = exports.ActionHeader = exports.PlaceholderMessage = exports.PlaceholderContainer = exports.Reply = exports.Thread = exports.Container = void 0;
const AuthorPlaceholder_1 = __importDefault(require("@manuscripts/assets/react/AuthorPlaceholder"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
exports.Container = styled_components_1.default.div `
  flex: 1;
  overflow-y: auto;
`;
exports.Thread = styled_components_1.default.div `
  margin: 16px 0;
`;
exports.Reply = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 4}px 0
    ${(props) => props.theme.grid.unit * 2}px;
  margin-left: ${(props) => props.theme.grid.unit * 4}px;
  border: 1px solid ${(props) => props.theme.colors.brand.xlight};
  border-top: none;
`;
exports.PlaceholderContainer = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;
exports.PlaceholderMessage = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.medium};
  font-weight: ${(props) => props.theme.font.weight.light};
  color: ${(props) => props.theme.colors.text.secondary};
  text-align: center;
  margin: ${(props) => props.theme.grid.unit * 5}px;
`;
exports.ActionHeader = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
exports.LabelText = styled_components_1.default.div `
  font-family: ${(props) => props.theme.font.family.sans};
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 14px;
  line-height: 24px;
`;
exports.Checkbox = styled_components_1.default(style_guide_1.CheckboxLabel) `
  div {
    color: ${(props) => props.theme.colors.text.primary};
  }
`;
var CommentFilter;
(function (CommentFilter) {
    CommentFilter[CommentFilter["ALL"] = 0] = "ALL";
    CommentFilter[CommentFilter["UNRESOLVED"] = 1] = "UNRESOLVED";
})(CommentFilter = exports.CommentFilter || (exports.CommentFilter = {}));
const SeeResolvedCheckbox = ({ isEmpty, commentFilter, setCommentFilter, }) => {
    const handleOnSelectChange = react_1.useCallback((e) => setCommentFilter(e.target.checked ? CommentFilter.ALL : CommentFilter.UNRESOLVED), [setCommentFilter]);
    return (react_1.default.createElement(exports.ActionHeader, null, isEmpty ? null : (react_1.default.createElement(exports.Checkbox, null,
        react_1.default.createElement(style_guide_1.CheckboxField, { checked: commentFilter === CommentFilter.ALL, onChange: handleOnSelectChange }),
        react_1.default.createElement(exports.LabelText, null, "See resolved")))));
};
exports.SeeResolvedCheckbox = SeeResolvedCheckbox;
const EmptyCommentsListPlaceholder = () => {
    return (react_1.default.createElement(exports.PlaceholderContainer, null,
        react_1.default.createElement(AuthorPlaceholder_1.default, { width: 295, height: 202 }),
        react_1.default.createElement(exports.PlaceholderMessage, null, "Discuss this manuscript with your collaborators by creating a comment.")));
};
exports.EmptyCommentsListPlaceholder = EmptyCommentsListPlaceholder;
//# sourceMappingURL=CommentListPatterns.js.map