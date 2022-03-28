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
exports.acceptInvitationTokenErrorMessage = exports.acceptInvitationErrorMessage = exports.ProjectRenameMessage = exports.FeedbackMessage = exports.InviteCollaboratorsMessage = exports.CheckCollaboratorsSearchMessage = exports.AddedAuthorsMessage = exports.SelectAuthorMessage = exports.AddAuthorsMessage = exports.AddedCollaboratorsMessage = exports.AddCollaboratorsMessage = exports.SelectCollaboratorMessage = exports.DeleteAccountMessage = exports.ChangePasswordMessage = exports.ImportManuscriptMessage = exports.EmptyManuscriptsMessage = exports.ManuscriptsTitleMessage = exports.PreferencesMessage = exports.ManageProfileMessage = exports.SignOutMessage = exports.SignInMessage = void 0;
require("intl-pluralrules");
const http_status_codes_1 = require("http-status-codes");
const react_1 = __importDefault(require("react"));
const react_intl_1 = require("react-intl");
const SignInMessage = () => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'sign_in', description: 'Title of sign in page', defaultMessage: 'Sign in' }));
exports.SignInMessage = SignInMessage;
const SignOutMessage = () => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'sign_out', description: 'Title of sign out page', defaultMessage: 'Sign out' }));
exports.SignOutMessage = SignOutMessage;
const ManageProfileMessage = () => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'manage_profile', description: 'Title of profile management page', defaultMessage: 'Details' }));
exports.ManageProfileMessage = ManageProfileMessage;
const PreferencesMessage = () => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'preferences', description: 'Title of preferences page', defaultMessage: 'Preferences' }));
exports.PreferencesMessage = PreferencesMessage;
const ManuscriptsTitleMessage = () => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'manuscripts', description: 'Title of the manuscripts overview page', defaultMessage: 'Manuscripts' }));
exports.ManuscriptsTitleMessage = ManuscriptsTitleMessage;
const EmptyManuscriptsMessage = () => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'empty_manuscripts', description: 'Message shown when the manuscripts list is empty', defaultMessage: 'No manuscripts yet.' }));
exports.EmptyManuscriptsMessage = EmptyManuscriptsMessage;
const ImportManuscriptMessage = () => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'import_manuscript', description: 'Additional message shown when the manuscripts list is empty', defaultMessage: 'Use the + button to create a new Manuscript or import one from your computer.' }));
exports.ImportManuscriptMessage = ImportManuscriptMessage;
const ChangePasswordMessage = () => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'change_password', description: 'Title of change password page', defaultMessage: 'Change Password' }));
exports.ChangePasswordMessage = ChangePasswordMessage;
const DeleteAccountMessage = () => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'delete_account', description: 'Title of delete account page', defaultMessage: 'Delete Account' }));
exports.DeleteAccountMessage = DeleteAccountMessage;
const SelectCollaboratorMessage = () => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'select_collaborator', defaultMessage: 'Select a collaborator from the list to display their details here.' }));
exports.SelectCollaboratorMessage = SelectCollaboratorMessage;
const AddCollaboratorsMessage = () => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'add_collaborators', defaultMessage: 'You can add collaborators from the list or send out invitation mails to those not yet in the list.' }));
exports.AddCollaboratorsMessage = AddCollaboratorsMessage;
const AddedCollaboratorsMessage = ({ addedCount }) => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'added_collaborators', defaultMessage: `You added {addedCount, number} {addedCount, plural,
                      one {collaborator}
                      other {collaborators}
                    }`, values: { addedCount } }));
exports.AddedCollaboratorsMessage = AddedCollaboratorsMessage;
const AddAuthorsMessage = () => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'add_authors', defaultMessage: 'Add authors to your author list from your collaborators, or invite new ones' }));
exports.AddAuthorsMessage = AddAuthorsMessage;
const SelectAuthorMessage = () => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'select_author', defaultMessage: 'Select an author from the list to display their details here.' }));
exports.SelectAuthorMessage = SelectAuthorMessage;
const AddedAuthorsMessage = ({ addedCount }) => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'added_authors', defaultMessage: `You added {addedCount, number} {addedCount, plural, one {author} other {authors}}`, values: { addedCount } }));
exports.AddedAuthorsMessage = AddedAuthorsMessage;
const CheckCollaboratorsSearchMessage = ({ searchText }) => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'check_collaborators_search', defaultMessage: `Check that the name or email are correct or invite "{searchText}" to
          join as new Collaborator.`, values: { searchText } }));
exports.CheckCollaboratorsSearchMessage = CheckCollaboratorsSearchMessage;
const InviteCollaboratorsMessage = () => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'invite_collaborators', defaultMessage: 'You can invite collaborators by sending email to the users you want to add.' }));
exports.InviteCollaboratorsMessage = InviteCollaboratorsMessage;
const FeedbackMessage = () => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'feedback', description: 'Title of feedback page', defaultMessage: 'Post Feedback' }));
exports.FeedbackMessage = FeedbackMessage;
const ProjectRenameMessage = () => (react_1.default.createElement(react_intl_1.FormattedMessage, { id: 'rename_project', description: 'Title of rename project form', defaultMessage: 'Rename Project' }));
exports.ProjectRenameMessage = ProjectRenameMessage;
const acceptInvitationErrorMessage = (status) => {
    if (status === http_status_codes_1.StatusCodes.GONE) {
        return 'Invitation is no longer valid.';
    }
    else if (status === http_status_codes_1.StatusCodes.BAD_REQUEST) {
        return 'Project no longer exists.';
    }
    else {
        return 'There was an error accepting the invitation.';
    }
};
exports.acceptInvitationErrorMessage = acceptInvitationErrorMessage;
const acceptInvitationTokenErrorMessage = (status) => {
    if (status === http_status_codes_1.StatusCodes.GONE) {
        return 'Invitation is no longer valid.';
    }
    else if (status === http_status_codes_1.StatusCodes.NOT_FOUND) {
        return 'Project no longer exists.';
    }
    else {
        return 'There was an error accepting the invitation.';
    }
};
exports.acceptInvitationTokenErrorMessage = acceptInvitationTokenErrorMessage;
//# sourceMappingURL=Messages.js.map