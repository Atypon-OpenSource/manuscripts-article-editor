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
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const authors_1 = require("../../lib/authors");
const Sidebar_1 = require("../Sidebar");
const AddAuthorButton_1 = __importDefault(require("./AddAuthorButton"));
const PersonInitial = styled_components_1.default.span `
  margin-right: ${(props) => props.theme.grid.unit}px;
  font-weight: ${(props) => props.theme.font.weight.light};
`;
const PersonName = styled_components_1.default.div `
  font-size: 120%;
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: ${(props) => props.theme.font.weight.medium};
`;
const PeopleData = styled_components_1.default.div `
  padding-left: ${(props) => props.theme.grid.unit * 2}px;
`;
const UserDataContainer = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
const TextContainer = styled_components_1.default.div `
  word-break: break-word;
`;
const SearchAuthorsSidebar = ({ createAuthor, handleInvite, searchText, searchResults, addedAuthors, authors, isAuthorExist, handleCreateAuthor, }) => (react_1.default.createElement(react_1.default.Fragment, null, !searchResults.length ? (react_1.default.createElement(Sidebar_1.SidebarContent, null, !searchText.includes('@') ? (react_1.default.createElement(Sidebar_1.SidebarEmptyResult, { primaryButton: {
        action: () => handleInvite(searchText),
        text: 'Add + Invite as Collaborator',
        tip: {
            text: `Add ${searchText} to the author list, and send an invitation to grant access to the project`,
            placement: 'left',
        },
    }, secondaryButton: {
        action: () => !isAuthorExist()
            ? createAuthor(authors_1.buildAuthorPriority(authors), null, searchText)
            : handleCreateAuthor(),
        text: 'Add to Author List',
        tip: {
            text: `Add ${searchText} to the author list.`,
            placement: 'left',
        },
    }, text: react_1.default.createElement(TextContainer, null,
        "Do you want to invite ",
        react_1.default.createElement("strong", null, searchText),
        " as a collaborator?") })) : (react_1.default.createElement(Sidebar_1.SidebarEmptyResult, { primaryButton: {
        action: () => handleInvite(searchText),
        text: 'Invite as Collaborator',
        tip: {
            text: `Send an invitation to ${searchText} to grant access to the project.`,
            placement: 'left',
        },
    }, text: "Do you want to invite a new collaborator?" })))) : (react_1.default.createElement(Sidebar_1.SidebarContent, null, searchResults.map((person) => (react_1.default.createElement(Sidebar_1.SidebarPersonContainer, { key: person._id },
    react_1.default.createElement(UserDataContainer, null,
        react_1.default.createElement(style_guide_1.Avatar, { src: person.avatar, size: 45 }),
        react_1.default.createElement(PeopleData, null,
            react_1.default.createElement(PersonName, null,
                react_1.default.createElement(PersonInitial, null, person.bibliographicName.given),
                person.bibliographicName.family))),
    react_1.default.createElement(AddAuthorButton_1.default, { person: person, isSelected: addedAuthors.includes(person.userID), createAuthor: createAuthor, authors: authors }))))))));
exports.default = SearchAuthorsSidebar;
//# sourceMappingURL=SearchAuthorsSidebar.js.map