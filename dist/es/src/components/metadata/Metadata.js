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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = exports.ExpanderButton = void 0;
const ArrowDownBlue_1 = __importDefault(require("@manuscripts/assets/react/ArrowDownBlue"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const use_shared_data_1 = require("../../hooks/use-shared-data");
const store_1 = require("../../store");
const AddAuthorsModalContainer_1 = require("./AddAuthorsModalContainer");
const AuthorsModalContainer_1 = __importDefault(require("./AuthorsModalContainer"));
const AuthorsModals_1 = require("./AuthorsModals");
const HeaderFigure_1 = require("./HeaderFigure");
const TitleFieldContainer_1 = require("./TitleFieldContainer");
const TitleContainer = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: start;
`;
exports.ExpanderButton = styled_components_1.default(style_guide_1.IconButton).attrs(() => ({
    size: 20,
    defaultColor: true,
})) `
  border: none;
  border-radius: 50%;

  &:focus,
  &:hover {
    &:not([disabled]) {
      background: ${(props) => props.theme.colors.background.fifth};
    }
  }

  svg circle {
    stroke: ${(props) => props.theme.colors.border.secondary};
  }
`;
const HeaderContainer = styled_components_1.default.header `
  padding: 0 64px;
`;
const Header = styled_components_1.default.div `
  font-family: 'PT Sans';
  font-size: ${(props) => props.theme.font.size.medium};
  line-height: ${(props) => props.theme.font.lineHeight.large};
  color: ${(props) => props.theme.colors.text.primary};

  ${exports.ExpanderButton} {
    display: none;
  }

  &:hover ${exports.ExpanderButton} {
    display: initial;
  }
`;
const expanderStyle = (expanded) => ({
    transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
});
const Metadata = (props) => {
    var _a;
    const [{ manuscript, authorsAndAffiliations, contributorRoles, tokenActions, project, saveModel, },] = store_1.useStore((store) => {
        return {
            manuscript: store.manuscript,
            authorsAndAffiliations: store.authorsAndAffiliations,
            contributorRoles: store.contributorRoles,
            saveModel: store.saveModel,
            getAttachment: store.getAttachment,
            putAttachment: store.putAttachment,
            project: store.project,
            tokenActions: store.tokenActions,
        };
    });
    const { getTemplate } = use_shared_data_1.useSharedData();
    const handleInvitationSubmit = react_1.useCallback((values) => {
        if (!authorsAndAffiliations) {
            return Promise.reject();
        }
        return props.handleInvitationSubmit(authorsAndAffiliations.authors, values);
    }, [authorsAndAffiliations, props]);
    const openAddAuthors = react_1.useCallback(() => {
        if (!authorsAndAffiliations) {
            return;
        }
        props.openAddAuthors(authorsAndAffiliations.authors);
    }, [authorsAndAffiliations, props]);
    const authorInstructionsURL = manuscript.authorInstructionsURL
        ? manuscript.authorInstructionsURL
        : manuscript.prototype
            ? (_a = getTemplate(manuscript.prototype)) === null || _a === void 0 ? void 0 : _a.authorInstructionsURL
            : undefined;
    if (!authorsAndAffiliations || !contributorRoles) {
        return null;
    }
    return (react_1.default.createElement(HeaderContainer, null,
        react_1.default.createElement(Header, null,
            react_1.default.createElement(HeaderFigure_1.HeaderFigure, null),
            react_1.default.createElement(TitleContainer, null,
                react_1.default.createElement(TitleFieldContainer_1.TitleFieldContainer, { title: manuscript.title || '', handleChange: props.saveTitle, handleStateChange: props.handleTitleStateChange, editable: props.permissions.write }),
                react_1.default.createElement(exports.ExpanderButton, { "aria-label": 'Toggle expand authors', onClick: props.toggleExpanded, style: expanderStyle(props.expanded), "data-cy": 'expander-button' },
                    react_1.default.createElement(ArrowDownBlue_1.default, null))),
            authorInstructionsURL && (react_1.default.createElement(style_guide_1.SecondaryButton, { mini: true, onClick: () => window.open(authorInstructionsURL, '_blank') },
                react_1.default.createElement("span", { role: 'img', "aria-label": 'Link' },
                    ' ',
                    "\uD83D\uDD17"),
                ' ',
                "Author Instructions")),
            props.expanded && (react_1.default.createElement(style_guide_1.AuthorsContainer, { authorData: authorsAndAffiliations, startEditing: props.startEditing, showEditButton: props.showAuthorEditButton, disableEditButton: props.disableEditButton, selectAuthor: props.selectAuthor })),
            react_1.default.createElement(style_guide_1.StyledModal, { isOpen: props.editing, onRequestClose: props.stopEditing, shouldCloseOnOverlayClick: true },
                react_1.default.createElement(style_guide_1.ModalContainer, null,
                    react_1.default.createElement(style_guide_1.ModalHeader, null,
                        react_1.default.createElement(style_guide_1.CloseButton, { onClick: props.stopEditing, "data-cy": 'modal-close-button' })),
                    props.isInvite ? (react_1.default.createElement(AuthorsModals_1.InviteAuthorsModal, Object.assign({}, props, { handleInvitationSubmit: handleInvitationSubmit }))) : props.addingAuthors ? (react_1.default.createElement(AddAuthorsModalContainer_1.AddAuthorsModalContainer, Object.assign({}, props, { authors: authorsAndAffiliations.authors }))) : (react_1.default.createElement(AuthorsModalContainer_1.default, Object.assign({}, props, { saveModel: saveModel, authors: authorsAndAffiliations.authors, authorAffiliations: authorsAndAffiliations.authorAffiliations, affiliations: authorsAndAffiliations.affiliations, openAddAuthors: openAddAuthors, project: project, manuscript: manuscript, tokenActions: tokenActions, contributorRoles: contributorRoles, allowInvitingAuthors: props.allowInvitingAuthors }))))))));
};
exports.Metadata = Metadata;
//# sourceMappingURL=Metadata.js.map