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
const AttentionOrange_1 = __importDefault(require("@manuscripts/assets/react/AttentionOrange"));
const OutlineIconManuscript_1 = __importDefault(require("@manuscripts/assets/react/OutlineIconManuscript"));
const style_guide_1 = require("@manuscripts/style-guide");
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const SectionTree_1 = __importDefault(require("./SectionTree"));
const Container = styled_components_1.default.div `
  max-width: 640px;
  background: ${(props) => props.theme.colors.background.primary};
  padding: 2rem;
  border: 1px solid ${(props) => props.theme.colors.text.muted};
  border-radius: ${(props) => props.theme.grid.radius.default};
`;
const ModalTitle = styled_components_1.default.h3 `
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  span {
    margin-left: 0.5em;
  }
`;
const ManuscriptTitle = styled_components_1.default.span `
  font-size: 1.2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  span {
    margin-left: 0.2em;
  }
`;
const CompareContainer = styled_components_1.default.div `
  display: flex;
  flex-direction: row;
`;
const CompareItem = styled_components_1.default.div `
  flex: 1 0 50%;
`;
const ItemTitle = styled_components_1.default.h4 `
  margin: 0 0 1em;
`;
const SelectionButton = styled_components_1.default(style_guide_1.SecondaryButton) `
  padding: 0.6em 1.2em;
  color: ${(props) => props.theme.colors.text.primary};
  background: ${(props) => props.theme.colors.border.secondary};
  border-radius: 2px;
  border: 2px solid ${(props) => props.theme.colors.border.secondary};

  g {
    fill: ${(props) => props.theme.colors.text.primary};
  }

  span {
    margin-left: 0.5em;
  }

  &:hover,
  &:active,
  &:focus {
    g {
      fill: ${(props) => props.theme.colors.brand.default};
    }
  }

  &[aria-pressed='true'] {
    border-color: ${(props) => props.theme.colors.brand.default};
    color: ${(props) => props.theme.colors.text.onDark};
    background: rgba(127, 181, 213, 0.6);
    g {
      fill: ${(props) => props.theme.colors.text.onDark};
    }
  }
`;
const Footer = styled_components_1.default.footer `
  margin-top: 1rem;
  text-align: right;
`;
const SectionConflictModal = ({ localTree, remoteTree, manuscriptTitle, resolveToLocal, resolveToRemote, }) => {
    const [selected, setSelected] = react_1.useState(null);
    const handleResolve = react_1.useCallback(() => {
        if (selected === 'remote') {
            resolveToRemote();
        }
        else if (selected === 'local') {
            resolveToLocal();
        }
    }, [resolveToLocal, resolveToRemote, selected]);
    return (react_1.default.createElement(style_guide_1.StyledModal, { isOpen: true },
        react_1.default.createElement(Container, null,
            react_1.default.createElement(ModalTitle, null,
                react_1.default.createElement(AttentionOrange_1.default, null),
                react_1.default.createElement("span", null, "Section Order Conflict")),
            react_1.default.createElement("p", null, "External changes have resulted in a conflict in the overall outline of your manuscript. Please resolve this to continue."),
            react_1.default.createElement(CompareContainer, null,
                react_1.default.createElement(CompareItem, null,
                    react_1.default.createElement(ItemTitle, null, "Your Version"),
                    react_1.default.createElement(ManuscriptTitle, null,
                        react_1.default.createElement(OutlineIconManuscript_1.default, null),
                        react_1.default.createElement(title_editor_1.Title, { value: manuscriptTitle })),
                    react_1.default.createElement(SectionTree_1.default, { data: localTree }),
                    react_1.default.createElement(SelectionButton, { onClick: () => setSelected('local'), "aria-pressed": selected === 'local' },
                        react_1.default.createElement(OutlineIconManuscript_1.default, null),
                        react_1.default.createElement("span", null, "Use Your Version"))),
                react_1.default.createElement(CompareItem, null,
                    react_1.default.createElement(ItemTitle, null, "Server Version"),
                    react_1.default.createElement(ManuscriptTitle, null,
                        react_1.default.createElement(OutlineIconManuscript_1.default, null),
                        react_1.default.createElement(title_editor_1.Title, { value: manuscriptTitle })),
                    react_1.default.createElement(SectionTree_1.default, { data: remoteTree }),
                    react_1.default.createElement(SelectionButton, { onClick: () => setSelected('remote'), "aria-pressed": selected === 'remote' },
                        react_1.default.createElement(OutlineIconManuscript_1.default, null),
                        react_1.default.createElement("span", null, "Use Server Version")))),
            react_1.default.createElement(Footer, null,
                react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: handleResolve, disabled: !selected }, "Confirm")))));
};
exports.default = SectionConflictModal;
//# sourceMappingURL=SectionConflictModal.js.map