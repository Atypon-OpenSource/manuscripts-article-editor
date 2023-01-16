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
exports.SearchCollaboratorsPage = exports.InviteCollaboratorsModal = exports.InviteCollaboratorsPage = exports.AuthorDetailsPage = exports.AddAuthorsPage = exports.AddCollaboratorsPage = exports.CollaboratorDetailsPage = void 0;
const AddedIcon_1 = __importDefault(require("@manuscripts/assets/react/AddedIcon"));
const AuthorPlaceholder_1 = __importDefault(require("@manuscripts/assets/react/AuthorPlaceholder"));
const ContributorDetailsPlaceholder_1 = __importDefault(require("@manuscripts/assets/react/ContributorDetailsPlaceholder"));
const ContributorSearchPlaceholder_1 = __importDefault(require("@manuscripts/assets/react/ContributorSearchPlaceholder"));
const ContributorsPlaceholder_1 = __importDefault(require("@manuscripts/assets/react/ContributorsPlaceholder"));
const InvitationPlaceholder_1 = __importDefault(require("@manuscripts/assets/react/InvitationPlaceholder"));
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const roles_1 = require("../../lib/roles");
const AddButton_1 = require("../AddButton");
const Messages_1 = require("../Messages");
const CollaboratorForm_1 = require("./CollaboratorForm");
const OuterContainer = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow-y: auto;
`;
const InnerContainer = styled_components_1.default.div `
  text-align: center;
  max-width: 480px;
  font-size: ${(props) => props.theme.font.size.xlarge};
  line-height: ${(props) => props.theme.font.lineHeight.large};
`;
const Placeholder = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.grid.unit * 5}px;
`;
const Action = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.theme.font.size.xlarge};
  font-weight: ${(props) => props.theme.font.weight.medium};
  letter-spacing: -0.5px;
`;
const Message = styled_components_1.default.div `
  max-width: 400px;
  font-size: ${(props) => props.theme.font.size.xlarge};
  margin-top: ${(props) => props.theme.grid.unit * 6}px;
  font-weight: ${(props) => props.theme.font.weight.light};
  color: ${(props) => props.theme.colors.text.secondary};

  @media (max-width: 850px) {
    margin-right: ${(props) => props.theme.grid.unit * 5}px;
    margin-left: ${(props) => props.theme.grid.unit * 5}px;
    max-width: 350px;
  }
`;
const InfoMessage = styled_components_1.default(Message) `
  margin-top: 0;
`;
const AddedMessage = styled_components_1.default(Message) `
  margin-top: 2px;
`;
const CollaboratorDetailsPage = ({ project, user, collaboratorsCount, handleAddCollaborator, selectedCollaborator, manageProfile, }) => (react_1.default.createElement(react_1.default.Fragment, null, selectedCollaborator ? (react_1.default.createElement(CollaboratorForm_1.CollaboratorForm, { collaborator: selectedCollaborator, user: user, manageProfile: manageProfile, affiliations: null })) : (react_1.default.createElement(OuterContainer, { "data-cy": 'collaborators-page' },
    react_1.default.createElement(InnerContainer, null, collaboratorsCount > 1 || !roles_1.isOwner(project, user.userID) ? (react_1.default.createElement(InnerContainer, null,
        react_1.default.createElement(Placeholder, null,
            react_1.default.createElement(ContributorDetailsPlaceholder_1.default, null)),
        react_1.default.createElement(Action, null, "Collaborator Details"),
        react_1.default.createElement(Message, null,
            react_1.default.createElement(Messages_1.SelectCollaboratorMessage, null)))) : (react_1.default.createElement(InnerContainer, null,
        react_1.default.createElement(Placeholder, null,
            react_1.default.createElement(ContributorsPlaceholder_1.default, null)),
        react_1.default.createElement(Action, null,
            react_1.default.createElement(AddButton_1.AddButton, { action: handleAddCollaborator, title: "Add Collaborator", size: 'large' })),
        react_1.default.createElement(Message, null,
            react_1.default.createElement(Messages_1.AddCollaboratorsMessage, null)))))))));
exports.CollaboratorDetailsPage = CollaboratorDetailsPage;
const AddCollaboratorsPage = ({ addedCollaboratorsCount, }) => (react_1.default.createElement(OuterContainer, null,
    react_1.default.createElement(InnerContainer, null,
        react_1.default.createElement(Placeholder, null,
            react_1.default.createElement(ContributorsPlaceholder_1.default, null)),
        addedCollaboratorsCount ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Action, null, "Add Collaborator"),
            react_1.default.createElement(Message, null,
                react_1.default.createElement(Messages_1.AddedCollaboratorsMessage, { addedCount: addedCollaboratorsCount })))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(InfoMessage, null,
                react_1.default.createElement(Messages_1.AddCollaboratorsMessage, null)))))));
exports.AddCollaboratorsPage = AddCollaboratorsPage;
const IconContainer = styled_components_1.default.div `
  display: flex;
  align-self: center;
  padding-right: 5px;
`;
const MessageContainer = styled_components_1.default.div `
  display: flex;
  justify-content: center;
`;
const AddAuthorsPage = ({ addedAuthorsCount, }) => (react_1.default.createElement(OuterContainer, null,
    react_1.default.createElement(InnerContainer, null,
        react_1.default.createElement(Placeholder, null,
            react_1.default.createElement(AuthorPlaceholder_1.default, null)),
        addedAuthorsCount ? (react_1.default.createElement(MessageContainer, { "data-cy": 'add-author-message' },
            react_1.default.createElement(IconContainer, null,
                react_1.default.createElement(AddedIcon_1.default, null)),
            react_1.default.createElement(AddedMessage, null,
                react_1.default.createElement(Messages_1.AddedAuthorsMessage, { addedCount: addedAuthorsCount })))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Action, null, "Add Author"),
            react_1.default.createElement(Message, null,
                react_1.default.createElement(Messages_1.AddAuthorsMessage, null)))))));
exports.AddAuthorsPage = AddAuthorsPage;
const AuthorDetailsPage = () => (react_1.default.createElement(OuterContainer, { "data-cy": 'author-details' },
    react_1.default.createElement(InnerContainer, null,
        react_1.default.createElement(Placeholder, null,
            react_1.default.createElement(ContributorDetailsPlaceholder_1.default, null)),
        react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Action, null, "Author Details"),
            react_1.default.createElement(Message, null,
                react_1.default.createElement(Messages_1.SelectAuthorMessage, null))))));
exports.AuthorDetailsPage = AuthorDetailsPage;
const InviteCollaboratorsPage = () => (react_1.default.createElement(OuterContainer, null,
    react_1.default.createElement(InnerContainer, null,
        react_1.default.createElement(Placeholder, null,
            react_1.default.createElement(InvitationPlaceholder_1.default, null)),
        react_1.default.createElement(Action, null, "Invite New Collaborator"),
        react_1.default.createElement(Message, null,
            react_1.default.createElement(Messages_1.InviteCollaboratorsMessage, null)))));
exports.InviteCollaboratorsPage = InviteCollaboratorsPage;
const InviteCollaboratorsModal = () => (react_1.default.createElement(OuterContainer, null,
    react_1.default.createElement(InnerContainer, null,
        react_1.default.createElement(Placeholder, null,
            react_1.default.createElement(InvitationPlaceholder_1.default, null)),
        react_1.default.createElement(Action, null, "Invite New Collaborator"),
        react_1.default.createElement(Message, null,
            react_1.default.createElement(Messages_1.InviteCollaboratorsMessage, null)))));
exports.InviteCollaboratorsModal = InviteCollaboratorsModal;
const SearchCollaboratorsPage = ({ searchText, }) => (react_1.default.createElement(OuterContainer, null,
    react_1.default.createElement(InnerContainer, null,
        react_1.default.createElement(Placeholder, null,
            react_1.default.createElement(ContributorSearchPlaceholder_1.default, null)),
        react_1.default.createElement(InfoMessage, null, "No matches found"),
        react_1.default.createElement(Message, null,
            react_1.default.createElement(Messages_1.CheckCollaboratorsSearchMessage, { searchText: searchText })))));
exports.SearchCollaboratorsPage = SearchCollaboratorsPage;
//# sourceMappingURL=CollaboratorsPage.js.map