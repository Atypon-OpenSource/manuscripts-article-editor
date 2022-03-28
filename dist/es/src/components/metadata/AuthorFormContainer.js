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
exports.AuthorFormContainer = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const InviteAuthorButton_1 = __importDefault(require("./InviteAuthorButton"));
const FormMessage = styled_components_1.default.div `
  position: absolute;
  bottom: ${(props) => props.theme.grid.unit * 5}px;
  right: ${(props) => props.theme.grid.unit * 5}px;
  width: 450px;
`;
const AuthorFormContainer = ({ author, affiliations, authorAffiliations, handleSave, addAuthorAffiliation, removeAuthorAffiliation, updateAffiliation, removeAuthor, isRemoveAuthorOpen, handleRemoveAuthor, isRejected, project, updateAuthor, getAuthorName, tokenActions, contributorRoles, createContributorRole, allowInvitingAuthors, }) => (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(style_guide_1.AuthorForm, { author: author, handleSave: handleSave, isRemoveAuthorOpen: isRemoveAuthorOpen, removeAuthor: removeAuthor, handleRemoveAuthor: handleRemoveAuthor, contributorRoles: contributorRoles, createContributorRole: createContributorRole }),
    react_1.default.createElement(style_guide_1.AffiliationsEditor, { affiliations: affiliations, authorAffiliations: authorAffiliations, addAuthorAffiliation: addAuthorAffiliation, removeAuthorAffiliation: removeAuthorAffiliation, updateAffiliation: updateAffiliation }),
    !author.userID && !author.invitationID && allowInvitingAuthors && (react_1.default.createElement(FormMessage, null,
        react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.info, hideCloseButton: true },
            getAuthorName(author) + ' ',
            "does not have access to the project.",
            react_1.default.createElement(InviteAuthorButton_1.default, { author: author, project: project, updateAuthor: updateAuthor, tokenActions: tokenActions })))),
    author.invitationID &&
        isRejected(author.invitationID) &&
        allowInvitingAuthors && (react_1.default.createElement(FormMessage, null,
        react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.info, hideCloseButton: true },
            getAuthorName(author) + ' ',
            "does not have access to the project.",
            react_1.default.createElement(InviteAuthorButton_1.default, { author: author, project: project, updateAuthor: updateAuthor, tokenActions: tokenActions }))))));
exports.AuthorFormContainer = AuthorFormContainer;
//# sourceMappingURL=AuthorFormContainer.js.map