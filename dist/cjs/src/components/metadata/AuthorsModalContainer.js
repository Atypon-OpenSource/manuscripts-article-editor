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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../../config"));
const AuthorsModals_1 = require("./AuthorsModals");
const Invited = styled_components_1.default.div `
  display: flex;
  font-size: ${(props) => props.theme.font.size.small};
  color: ${(props) => props.theme.colors.brand.default};
`;
class AuthorsModalContainer extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isRemoveAuthorOpen: false,
            invitationSent: false,
        };
        this.createContributorRole = (name) => __awaiter(this, void 0, void 0, function* () {
            const contributorRole = manuscript_transform_1.buildContributorRole(name);
            return this.props.saveModel(contributorRole);
        });
        this.handleRemoveAuthor = () => this.setState({ isRemoveAuthorOpen: !this.state.isRemoveAuthorOpen });
        this.handleDismiss = () => this.setState({ invitationSent: false });
        this.removeAuthor = (author) => __awaiter(this, void 0, void 0, function* () {
            yield this.props.removeAuthor(author);
            this.handleRemoveAuthor();
        });
        this.getAuthorName = (author) => {
            return !author.bibliographicName.given
                ? 'Author '
                : author.bibliographicName.given + ' ' + author.bibliographicName.family;
        };
        this.isRejected = (invitationID) => {
            for (const invitation of this.props.invitations) {
                if (invitation._id === invitationID) {
                    return false;
                }
            }
            return true;
        };
        this.getSidebarItemDecorator = (authorID) => {
            const { invitations } = this.props;
            if (!invitations) {
                return null;
            }
            const author = this.props.authors.find((author) => author._id === authorID);
            if (!author) {
                return null;
            }
            return invitations.find((invitation) => author.invitationID === invitation._id && !invitation.acceptedAt) ? (react_1.default.createElement(Invited, null, "Invited")) : null;
        };
        this.handleSaveAuthor = (values) => __awaiter(this, void 0, void 0, function* () {
            yield this.props.saveModel(Object.assign({ objectType: manuscripts_json_schema_1.ObjectTypes.Contributor }, values));
        });
        this.addAuthorAffiliation = (affiliation) => __awaiter(this, void 0, void 0, function* () {
            const selectedAuthor = this.getSelectedAuthor();
            if (!selectedAuthor) {
                return;
            }
            let affiliationObj;
            if (typeof affiliation === 'string') {
                affiliationObj = yield this.props.saveModel(manuscript_transform_1.buildAffiliation(affiliation));
            }
            else {
                affiliationObj = affiliation;
            }
            const author = Object.assign(Object.assign({}, selectedAuthor), { affiliations: (selectedAuthor.affiliations || []).concat(affiliationObj._id) });
            yield this.props.saveModel(author);
        });
        this.removeAuthorAffiliation = (affiliation) => __awaiter(this, void 0, void 0, function* () {
            const selectedAuthor = this.getSelectedAuthor();
            if (!selectedAuthor) {
                return;
            }
            const nextAuthor = Object.assign(Object.assign({}, selectedAuthor), { affiliations: (selectedAuthor.affiliations || []).filter((aff) => aff !== affiliation._id) });
            yield this.props.saveModel(nextAuthor);
        });
        this.updateAffiliation = (affiliation) => __awaiter(this, void 0, void 0, function* () {
            yield this.props.saveModel(affiliation);
        });
        this.getSelectedAuthor = () => {
            return (this.props.authors.find((author) => author._id === this.props.selectedAuthor) || null);
        };
        this.handleDrop = (oldIndex, newIndex) => {
            this.props.handleDrop(this.props.authors, oldIndex, newIndex);
        };
        this.createEmptyAuthor = () => __awaiter(this, void 0, void 0, function* () {
            const authorInfo = manuscript_transform_1.buildContributor(manuscript_transform_1.buildBibliographicName({ given: '', family: '' }), 'author', this.props.authors.length + 1);
            const author = yield this.props.saveModel(authorInfo);
            this.props.selectAuthor(author);
        });
    }
    componentDidMount() {
        this.setState({
            invitationSent: this.props.invitationSent,
        });
    }
    render() {
        const { isRemoveAuthorOpen } = this.state;
        const { authors, authorAffiliations, affiliations, selectAuthor, project, openAddAuthors, tokenActions, updateAuthor, contributorRoles, allowInvitingAuthors, } = this.props;
        return (react_1.default.createElement(AuthorsModals_1.AuthorsModal, { project: project, authors: authors, authorAffiliations: authorAffiliations, affiliations: affiliations, selectedAuthor: this.getSelectedAuthor(), isRemoveAuthorOpen: isRemoveAuthorOpen, updateAuthor: updateAuthor, addAuthorAffiliation: this.addAuthorAffiliation, removeAuthorAffiliation: this.removeAuthorAffiliation, updateAffiliation: this.updateAffiliation, getSidebarItemDecorator: this.getSidebarItemDecorator, handleDrop: this.handleDrop, handleSaveAuthor: this.handleSaveAuthor, openAddAuthors: config_1.default.local || config_1.default.leanWorkflow.enabled
                ? this.createEmptyAuthor
                : openAddAuthors, selectAuthor: selectAuthor, isRejected: this.isRejected, removeAuthor: this.removeAuthor, getAuthorName: this.getAuthorName, handleRemoveAuthor: this.handleRemoveAuthor, tokenActions: tokenActions, invitationSent: this.state.invitationSent, handleDismiss: this.handleDismiss, contributorRoles: contributorRoles, createContributorRole: this.createContributorRole, allowInvitingAuthors: !!allowInvitingAuthors }));
    }
}
exports.default = AuthorsModalContainer;
//# sourceMappingURL=AuthorsModalContainer.js.map