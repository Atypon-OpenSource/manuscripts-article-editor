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
exports.AddAuthorsModalContainer = void 0;
const react_1 = __importDefault(require("react"));
const AuthorsModals_1 = require("./AuthorsModals");
class AddAuthorsModalContainer extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isCreateAuthorOpen: false,
            searchingAuthors: false,
            searchText: '',
            searchResults: [],
        };
        this.handleCreateAuthor = () => {
            if (this.state.isCreateAuthorOpen) {
                this.setState({
                    searchText: '',
                });
            }
            this.setState({
                isCreateAuthorOpen: !this.state.isCreateAuthorOpen,
            });
        };
        this.handleSearchFocus = () => this.setState({
            searchingAuthors: !this.state.searchingAuthors,
        });
        this.handleSearchChange = (event) => {
            this.setState({ searchText: event.currentTarget.value });
            this.search(event.currentTarget.value);
        };
        this.search = (searchText) => {
            const { nonAuthors } = this.props;
            if (!nonAuthors || !searchText) {
                return this.setState({ searchResults: [] });
            }
            searchText = searchText.toLowerCase();
            const searchResults = nonAuthors.filter((person) => {
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
            this.setState({ searchResults });
        };
        this.isAuthorExist = () => {
            const name = this.state.searchText;
            const [given, ...family] = name.split(' ');
            const authors = this.props.authors;
            for (const author of authors) {
                if (author.bibliographicName.given.toLowerCase() === given.toLowerCase() &&
                    author.bibliographicName.family.toLowerCase() ===
                        family.join(' ').toLowerCase()) {
                    return true;
                }
            }
            return false;
        };
    }
    render() {
        const { isCreateAuthorOpen, searchResults, searchText, searchingAuthors, } = this.state;
        const { numberOfAddedAuthors, createAuthor, addedAuthors, authors, handleAddingDoneCancel, nonAuthors, handleInvite, } = this.props;
        return (react_1.default.createElement(AuthorsModals_1.AddAuthorsModal, { authors: authors, nonAuthors: nonAuthors, addedAuthors: addedAuthors, numberOfAddedAuthors: numberOfAddedAuthors, isCreateAuthorOpen: isCreateAuthorOpen, searchResults: searchResults, searchText: searchText, searchingAuthors: searchingAuthors, createAuthor: createAuthor, isAuthorExist: this.isAuthorExist, handleAddingDoneCancel: handleAddingDoneCancel, handleInvite: handleInvite, handleSearchFocus: this.handleSearchFocus, handleSearchChange: this.handleSearchChange, handleCreateAuthor: this.handleCreateAuthor }));
    }
}
exports.AddAuthorsModalContainer = AddAuthorsModalContainer;
//# sourceMappingURL=AddAuthorsModalContainer.js.map