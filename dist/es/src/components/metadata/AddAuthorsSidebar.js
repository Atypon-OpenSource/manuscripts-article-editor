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
const Sidebar_1 = require("../Sidebar");
const AddAuthorButton_1 = __importDefault(require("./AddAuthorButton"));
const CreateAuthorPageContainer_1 = __importDefault(require("./CreateAuthorPageContainer"));
const SearchAuthorsSidebar_1 = __importDefault(require("./SearchAuthorsSidebar"));
const PersonInitial = styled_components_1.default.span `
  margin-right: ${(props) => props.theme.grid.unit}px;
  font-weight: ${(props) => props.theme.font.weight.light};
`;
const PersonName = styled_components_1.default.div `
  box-sizing: border-box;
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.font.size.xlarge};
  font-weight: ${(props) => props.theme.font.weight.medium};
  max-width: 138px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;
const PersonData = styled_components_1.default.div `
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
`;
const UserDataContainer = styled_components_1.default.div `
  align-items: center;
  display: flex;
  flex: 1;
  margin-right: 16px;
  overflow: hidden;
`;
const SearchContainer = styled_components_1.default.div `
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
`;
const AddAuthorsSidebar = ({ nonAuthors, numberOfAddedAuthors, isSearching, searchText, addedAuthors, handleDoneCancel, createAuthor, handleSearchChange, handleSearchFocus, searchResults, handleInvite, authors, isAuthorExist, isCreateAuthorOpen, handleCreateAuthor, }) => {
    return (react_1.default.createElement(Sidebar_1.ModalSidebar, { "data-cy": 'add-author-sidebar' },
        react_1.default.createElement(Sidebar_1.SidebarHeader, { action: handleDoneCancel, isCancel: !numberOfAddedAuthors, title: 'Add Author' }),
        react_1.default.createElement(SearchContainer, null,
            react_1.default.createElement(Sidebar_1.SidebarSearch, { autoFocus: true, handleSearchChange: handleSearchChange, maxLength: 100, placeholder: 'Search name/email', value: searchText })),
        searchText === '' ? (react_1.default.createElement(Sidebar_1.SidebarContent, null, nonAuthors.map((person) => (react_1.default.createElement(Sidebar_1.SidebarPersonContainer, { key: person._id },
            react_1.default.createElement(UserDataContainer, null,
                react_1.default.createElement(style_guide_1.Avatar, { src: person.avatar, size: 45 }),
                react_1.default.createElement(PersonData, null,
                    react_1.default.createElement(PersonName, null,
                        react_1.default.createElement(PersonInitial, null, person.bibliographicName.given),
                        person.bibliographicName.family))),
            react_1.default.createElement(AddAuthorButton_1.default, { person: person, isSelected: addedAuthors.includes(person.userID), createAuthor: createAuthor, authors: authors })))))) : isCreateAuthorOpen ? (react_1.default.createElement(CreateAuthorPageContainer_1.default, { authors: authors, createAuthor: createAuthor, isOpen: isCreateAuthorOpen, handleCancel: handleCreateAuthor, searchText: searchText })) : (react_1.default.createElement(SearchAuthorsSidebar_1.default, { handleInvite: handleInvite, searchText: searchText, addedAuthors: addedAuthors, createAuthor: createAuthor, searchResults: searchResults, authors: authors, isAuthorExist: isAuthorExist, handleCreateAuthor: handleCreateAuthor }))));
};
exports.default = AddAuthorsSidebar;
//# sourceMappingURL=AddAuthorsSidebar.js.map