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
exports.InviteAuthorsModal = exports.AddAuthorsModal = exports.AuthorsModal = exports.ScrollableModalMain = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const store_1 = require("../../store");
const CollaboratorsPage_1 = require("../collaboration/CollaboratorsPage");
const InviteCollaboratorsSidebar_1 = __importDefault(require("../collaboration/InviteCollaboratorsSidebar"));
const Sidebar_1 = require("../Sidebar");
const AddAuthorsSidebar_1 = __importDefault(require("./AddAuthorsSidebar"));
const AuthorFormContainer_1 = require("./AuthorFormContainer");
const AuthorsSidebar_1 = __importDefault(require("./AuthorsSidebar"));
exports.ScrollableModalMain = styled_components_1.default(Sidebar_1.StyledModalMain) `
  overflow-y: auto;
`;
const AuthorsModal = ({ authors, authorAffiliations, affiliations, removeAuthor, selectAuthor, selectedAuthor, openAddAuthors, handleSaveAuthor, addAuthorAffiliation, removeAuthorAffiliation, updateAffiliation, handleDrop, getSidebarItemDecorator, isRemoveAuthorOpen, handleRemoveAuthor, isRejected, project, updateAuthor, getAuthorName, tokenActions, invitationSent, handleDismiss, contributorRoles, createContributorRole, allowInvitingAuthors, }) => (react_1.default.createElement(Sidebar_1.ModalBody, null,
    react_1.default.createElement(AuthorsSidebar_1.default, { authors: authors, authorAffiliations: authorAffiliations, selectAuthor: selectAuthor, selectedAuthor: selectedAuthor, openAddAuthors: openAddAuthors, handleDrop: handleDrop, getSidebarItemDecorator: getSidebarItemDecorator, invitationSent: invitationSent, handleDismiss: handleDismiss }),
    react_1.default.createElement(exports.ScrollableModalMain, null, selectedAuthor ? (react_1.default.createElement(AuthorFormContainer_1.AuthorFormContainer, { author: selectedAuthor, affiliations: affiliations, authorAffiliations: authorAffiliations.get(selectedAuthor._id), handleSave: handleSaveAuthor, addAuthorAffiliation: addAuthorAffiliation, removeAuthorAffiliation: removeAuthorAffiliation, updateAffiliation: updateAffiliation, isRemoveAuthorOpen: isRemoveAuthorOpen, handleRemoveAuthor: handleRemoveAuthor, removeAuthor: removeAuthor, isRejected: isRejected, project: project, updateAuthor: updateAuthor, getAuthorName: getAuthorName, tokenActions: tokenActions, contributorRoles: contributorRoles, createContributorRole: createContributorRole, allowInvitingAuthors: allowInvitingAuthors })) : (react_1.default.createElement(CollaboratorsPage_1.AuthorDetailsPage, null)))));
exports.AuthorsModal = AuthorsModal;
const AddAuthorsModal = ({ nonAuthors, authors, addedAuthors, numberOfAddedAuthors, searchingAuthors, searchResults, searchText, createAuthor, handleAddingDoneCancel, handleSearchChange, handleSearchFocus, handleInvite, isAuthorExist, isCreateAuthorOpen, handleCreateAuthor, }) => (react_1.default.createElement(Sidebar_1.ModalBody, null,
    react_1.default.createElement(AddAuthorsSidebar_1.default, { authors: authors, nonAuthors: nonAuthors, numberOfAddedAuthors: numberOfAddedAuthors, isSearching: searchingAuthors, searchText: searchText, addedAuthors: addedAuthors, handleDoneCancel: handleAddingDoneCancel, createAuthor: createAuthor, handleSearchChange: handleSearchChange, handleSearchFocus: handleSearchFocus, searchResults: searchResults, handleInvite: handleInvite, isAuthorExist: isAuthorExist, isCreateAuthorOpen: isCreateAuthorOpen, handleCreateAuthor: handleCreateAuthor }),
    react_1.default.createElement(Sidebar_1.StyledModalMain, null,
        react_1.default.createElement(CollaboratorsPage_1.AddAuthorsPage, { addedAuthorsCount: numberOfAddedAuthors }))));
exports.AddAuthorsModal = AddAuthorsModal;
const InviteAuthorsModal = ({ invitationValues, handleInviteCancel, handleInvitationSubmit, invitationSent, }) => {
    const [tokenActions] = store_1.useStore((store) => store.tokenActions);
    return (react_1.default.createElement(Sidebar_1.ModalBody, null,
        react_1.default.createElement(InviteCollaboratorsSidebar_1.default, { invitationValues: invitationValues, handleCancel: handleInviteCancel, handleSubmit: handleInvitationSubmit, invitationSent: invitationSent, isModal: true, tokenActions: tokenActions }),
        react_1.default.createElement(Sidebar_1.StyledModalMain, null,
            react_1.default.createElement(CollaboratorsPage_1.InviteCollaboratorsModal, null))));
};
exports.InviteAuthorsModal = InviteAuthorsModal;
//# sourceMappingURL=AuthorsModals.js.map