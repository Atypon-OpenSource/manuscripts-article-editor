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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const react_1 = __importStar(require("react"));
const api_1 = require("../../lib/api");
const authors_1 = require("../../lib/authors");
const collaborators_1 = require("../../lib/collaborators");
const invitation_1 = require("../../lib/invitation");
const tracking_1 = require("../../lib/tracking");
const store_1 = require("../../store");
const Metadata_1 = require("./Metadata");
const MetadataContainer = ({ allowInvitingAuthors, showAuthorEditButton, disableEditButton, handleTitleStateChange, }) => {
    const [state, setState] = react_1.useState({
        editing: false,
        expanded: true,
        selectedAuthor: null,
        addingAuthors: false,
        nonAuthors: [],
        numberOfAddedAuthors: 0,
        addedAuthors: [],
        isInvite: false,
        invitationSent: false,
        invitationValues: {
            name: '',
            email: '',
            role: '',
        },
    });
    const [{ saveModel, collaboratorsProfiles, user, project, manuscript, saveManuscript, deleteModel, containerInvitations, invitations, getInvitation, },] = store_1.useStore((store) => ({
        saveModel: store.saveModel,
        collaboratorsProfiles: store.collaboratorsProfiles,
        user: store.user,
        project: store.project,
        manuscript: store.manuscript,
        saveManuscript: store.saveManuscript,
        deleteModel: store.deleteModel,
        containerInvitations: store.containerInvitations || [],
        invitations: store.projectInvitations || [],
        getInvitation: store.getInvitation || (() => null),
    }));
    const allInvitations = [
        ...invitation_1.buildContainerInvitations(invitations),
        ...containerInvitations,
    ].filter((invitation) => invitation.containerID.startsWith('MPProject'));
    const updateAuthor = (invitingUser) => (author, invitedEmail) => __awaiter(void 0, void 0, void 0, function* () {
        const invitation = yield getInvitation(invitingUser.userID, invitedEmail);
        const updatedAuthor = yield saveModel(Object.assign(Object.assign({}, author), { invitationID: (invitation === null || invitation === void 0 ? void 0 : invitation._id) || '' }));
        selectAuthor(updatedAuthor);
    });
    const toggleExpanded = () => {
        setState((state) => (Object.assign(Object.assign({}, state), { expanded: !state.expanded })));
    };
    const startEditing = () => {
        setState((state) => (Object.assign(Object.assign({}, state), { editing: true })));
    };
    const stopEditing = () => {
        setState((state) => (Object.assign(Object.assign({}, state), { editing: false, selectedAuthor: null, addingAuthors: false, isInvite: false, invitationSent: false })));
    };
    const saveTitle = (title) => __awaiter(void 0, void 0, void 0, function* () {
        yield saveManuscript({
            _id: manuscript._id,
            title,
        });
    });
    const createAuthor = (priority, person, name, invitationID) => __awaiter(void 0, void 0, void 0, function* () {
        if (name) {
            const [given, ...family] = name.split(' ');
            const bibName = manuscript_transform_1.buildBibliographicName({
                given,
                family: family.join(' '),
            });
            const author = invitationID
                ? manuscript_transform_1.buildContributor(bibName, 'author', priority, undefined, invitationID)
                : manuscript_transform_1.buildContributor(bibName, 'author', priority);
            yield saveModel(author);
            setState((state) => (Object.assign(Object.assign({}, state), { numberOfAddedAuthors: state.numberOfAddedAuthors + 1 })));
        }
        if (person) {
            const author = manuscript_transform_1.buildContributor(person.bibliographicName, 'author', priority, person.userID);
            const createdAuthor = yield saveModel(author);
            setState((state) => (Object.assign(Object.assign({}, state), { addedAuthors: state.addedAuthors.concat(author.userID), numberOfAddedAuthors: state.numberOfAddedAuthors + 1 })));
            selectAuthor(createdAuthor);
        }
    });
    const selectAuthor = (author) => {
        // TODO: make this switch without deselecting
        setState((state) => (Object.assign(Object.assign({}, state), { selectedAuthor: author._id })));
    };
    const deselectAuthor = () => {
        setState((state) => (Object.assign(Object.assign({}, state), { selectedAuthor: null })));
    };
    const removeAuthor = (author) => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteModel(author._id);
        deselectAuthor();
        if (state.addedAuthors.includes(author.userID)) {
            const index = state.addedAuthors.indexOf(author.userID);
            state.addedAuthors.splice(index, 1);
        }
    });
    const startAddingAuthors = (collaborators, invitations) => (authors) => {
        setState((state) => (Object.assign(Object.assign({}, state), { addingAuthors: true, invitationSent: false })));
        buildNonAuthors(authors, collaborators, invitations);
    };
    const handleAddingDoneCancel = () => setState((state) => (Object.assign(Object.assign({}, state), { numberOfAddedAuthors: 0, addingAuthors: false })));
    const handleInvite = (searchText) => {
        const invitationValues = {
            name: '',
            email: '',
            role: 'Writer',
        };
        if (searchText.includes('@')) {
            invitationValues.email = searchText;
        }
        else {
            invitationValues.name = searchText;
        }
        setState((state) => (Object.assign(Object.assign({}, state), { invitationValues, isInvite: true })));
    };
    const handleInviteCancel = () => setState((state) => (Object.assign(Object.assign({}, state), { isInvite: false, invitationSent: false })));
    const handleInvitationSubmit = (invitingUser, invitations) => (authors, values) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, name, role } = values;
        const projectID = manuscript.containerID;
        const invitingID = invitingUser.userID;
        const alreadyInvited = invitations.some((invitation) => invitation.containerID === projectID &&
            invitation.invitedUserEmail === email);
        yield api_1.projectInvite(projectID, [{ email, name }], role);
        if (!alreadyInvited) {
            yield createInvitedAuthor(authors, email, invitingID, name);
        }
        setState((state) => (Object.assign(Object.assign({}, state), { isInvite: false, invitationSent: true, addingAuthors: false, numberOfAddedAuthors: 0 })));
        tracking_1.trackEvent({
            category: 'Invitations',
            action: 'Send',
            label: `projectID=${projectID}`,
        });
    });
    const createInvitedAuthor = (authors, invitedEmail, invitingID, name) => __awaiter(void 0, void 0, void 0, function* () {
        const invitation = yield getInvitation(invitingID, invitedEmail);
        yield createAuthor(authors_1.buildAuthorPriority(authors), null, name, invitation === null || invitation === void 0 ? void 0 : invitation._id);
    });
    const buildInvitedAuthorsEmail = (authorInvitationIDs, invitations) => {
        const invitedAuthorsEmail = [];
        for (const invitation of invitations) {
            if (authorInvitationIDs.includes(invitation._id)) {
                invitedAuthorsEmail.push(invitation.invitedUserEmail);
            }
        }
        return invitedAuthorsEmail;
    };
    const buildNonAuthors = (authors, collaborators, invitations) => {
        const userIDs = authors.map((author) => author.userID);
        const invitationsID = authors.map((author) => author.invitationID);
        const invitedAuthorsEmail = buildInvitedAuthorsEmail(invitationsID, invitations);
        const nonAuthors = collaborators.filter((person) => !userIDs.includes(person.userID) &&
            !invitedAuthorsEmail.includes(person.email));
        setState((state) => (Object.assign(Object.assign({}, state), { nonAuthors })));
    };
    const handleDrop = (authors, oldIndex, newIndex) => {
        const reorderedAuthors = authors_1.reorderAuthors(authors, oldIndex, newIndex);
        Promise.all(reorderedAuthors.map((author, i) => {
            author.priority = i;
            return saveModel(author);
        }))
            .then(() => {
            setState((state) => (Object.assign(Object.assign({}, state), { authorListError: '' })));
        })
            .catch(() => {
            setState((state) => (Object.assign(Object.assign({}, state), { authorListError: 'There was an error saving authors' })));
        });
    };
    if (!collaboratorsProfiles || !user) {
        return null;
    }
    return (react_1.default.createElement(Metadata_1.Metadata, { saveTitle: saveTitle, invitations: allInvitations, editing: state.editing, startEditing: startEditing, selectAuthor: selectAuthor, removeAuthor: removeAuthor, createAuthor: createAuthor, selectedAuthor: state.selectedAuthor, stopEditing: stopEditing, toggleExpanded: toggleExpanded, expanded: state.expanded, addingAuthors: state.addingAuthors, openAddAuthors: startAddingAuthors(collaborators_1.buildCollaborators(project, collaboratorsProfiles), allInvitations), numberOfAddedAuthors: state.numberOfAddedAuthors, nonAuthors: state.nonAuthors, addedAuthors: state.addedAuthors, isInvite: state.isInvite, invitationValues: state.invitationValues, handleAddingDoneCancel: handleAddingDoneCancel, handleInvite: handleInvite, handleInviteCancel: handleInviteCancel, handleInvitationSubmit: handleInvitationSubmit(user, allInvitations), handleDrop: handleDrop, updateAuthor: updateAuthor(user), invitationSent: state.invitationSent, handleTitleStateChange: handleTitleStateChange, allowInvitingAuthors: allowInvitingAuthors, showAuthorEditButton: showAuthorEditButton, disableEditButton: disableEditButton }));
};
exports.default = MetadataContainer;
//# sourceMappingURL=MetadataContainer.js.map