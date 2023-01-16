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
const AddedIcon_1 = __importDefault(require("@manuscripts/assets/react/AddedIcon"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Sidebar_1 = require("../Sidebar");
const AddCollaboratorButton_1 = __importDefault(require("./AddCollaboratorButton"));
const SearchCollaboratorsSidebar_1 = __importDefault(require("./SearchCollaboratorsSidebar"));
const PersonInitial = styled_components_1.default.span `
  margin-right: ${(props) => props.theme.grid.unit}px;
  font-weight: ${(props) => props.theme.font.weight.xlight};
`;
const PersonName = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.xlarge};
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: ${(props) => props.theme.font.weight.medium};
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const PersonData = styled_components_1.default.div `
  padding-left: 10px;
`;
const UserDataContainer = styled_components_1.default.div `
  display: flex;
  align-items: center;
  min-width: 100px;
  overflow: hidden;
`;
const Invited = styled_components_1.default.div `
  display: flex;
  font-size: ${(props) => props.theme.font.size.small};
  color: ${(props) => props.theme.colors.brand.default};
`;
const InvitedContainer = styled_components_1.default.div `
  display: flex;
  align-items: center;
  padding-left: ${(props) => props.theme.grid.unit * 2}px;
`;
const AddedIconContainer = styled_components_1.default.div `
  display: flex;
  padding-left: ${(props) => props.theme.grid.unit * 2}px;

  &:focus {
    outline: none;
  }
`;
const SearchContainer = styled_components_1.default.div `
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
`;
class AddCollaboratorsSidebar extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            searchText: '',
            searchResults: [],
        };
        this.handleSearchChange = (event) => {
            const searchText = event.currentTarget.value;
            this.setState({ searchText });
            this.props.setSearchText(searchText);
            this.search(event.currentTarget.value);
        };
        this.search = (searchText) => {
            const { people, addedUsers } = this.props;
            if (!people || !searchText) {
                return this.setState({
                    searchResults: [],
                });
            }
            searchText = searchText.toLowerCase();
            const searchResults = people.filter((person) => {
                if (addedUsers.includes(person.userID)) {
                    return false;
                }
                if (searchText.includes('@')) {
                    return person.email && person.email.toLowerCase().includes(searchText);
                }
                const personName = [
                    person.bibliographicName.given,
                    person.bibliographicName.family,
                ]
                    .filter((part) => part)
                    .join(' ')
                    .toLowerCase();
                return personName && personName.includes(searchText);
            });
            this.setState({
                searchResults,
            });
        };
    }
    render() {
        const { people, invitations, numberOfAddedCollaborators, countAddedCollaborators, addedUsers, handleDoneCancel, handleInvite, addCollaborator, tokenActions, } = this.props;
        const { searchResults, searchText } = this.state;
        return (react_1.default.createElement(Sidebar_1.Sidebar, { "data-cy": 'sidebar' },
            react_1.default.createElement(Sidebar_1.SidebarHeader, { action: handleDoneCancel, isCancel: !numberOfAddedCollaborators, title: 'Add Collaborators' }),
            react_1.default.createElement(SearchContainer, null,
                react_1.default.createElement(Sidebar_1.SidebarSearch, { autoFocus: true, handleSearchChange: this.handleSearchChange, maxLength: 100, placeholder: 'Search name/email', value: searchText })),
            searchText === '' ? (react_1.default.createElement(Sidebar_1.SidebarContent, null,
                invitations.map((invitation) => (react_1.default.createElement(Sidebar_1.SidebarPersonContainer, { key: invitation._id },
                    react_1.default.createElement(UserDataContainer, null,
                        react_1.default.createElement(style_guide_1.Avatar, { size: 45, color: '#6e6e6e' }),
                        react_1.default.createElement(PersonData, null,
                            react_1.default.createElement(PersonName, null, invitation.invitedUserName ||
                                invitation.invitedUserEmail))),
                    react_1.default.createElement(InvitedContainer, null,
                        react_1.default.createElement(Invited, null, "Invited"),
                        react_1.default.createElement(AddedIconContainer, null,
                            react_1.default.createElement(AddedIcon_1.default, null)))))),
                people.map((person) => (react_1.default.createElement(Sidebar_1.SidebarPersonContainer, { key: person._id },
                    react_1.default.createElement(UserDataContainer, null,
                        react_1.default.createElement(style_guide_1.Avatar, { size: 45, src: person.avatar, color: '#6e6e6e' }),
                        react_1.default.createElement(PersonData, null,
                            react_1.default.createElement(PersonName, null,
                                react_1.default.createElement(PersonInitial, null, person.bibliographicName.given),
                                person.bibliographicName.family))),
                    react_1.default.createElement(AddCollaboratorButton_1.default, { collaborator: person, isSelected: addedUsers.includes(person.userID), addCollaborator: addCollaborator, countAddedCollaborators: countAddedCollaborators, tokenActions: tokenActions })))))) : (react_1.default.createElement(SearchCollaboratorsSidebar_1.default, { handleInvite: handleInvite, searchText: searchText, countAddedCollaborators: countAddedCollaborators, addCollaborator: addCollaborator, searchResults: searchResults, tokenActions: tokenActions }))));
    }
}
exports.default = AddCollaboratorsSidebar;
//# sourceMappingURL=AddCollaboratorsSidebar.js.map