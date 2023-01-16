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
exports.Page = exports.Centered = exports.Main = void 0;
require("@manuscripts/style-guide/styles/tip.css");
const AppIcon_1 = __importDefault(require("@manuscripts/assets/react/AppIcon"));
const ContributorsIcon_1 = __importDefault(require("@manuscripts/assets/react/ContributorsIcon"));
const EditProjectIcon_1 = __importDefault(require("@manuscripts/assets/react/EditProjectIcon"));
const ReferenceLibraryIcon_1 = __importDefault(require("@manuscripts/assets/react/ReferenceLibraryIcon"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../config"));
const store_1 = require("../store");
const Chatbox_1 = require("./Chatbox");
const LibraryPageContainer_1 = __importDefault(require("./library/LibraryPageContainer"));
const MenuBar_1 = __importDefault(require("./nav/MenuBar"));
const OfflineIndicator_1 = __importDefault(require("./OfflineIndicator"));
const Support_1 = require("./Support");
exports.Main = styled_components_1.default.main `
  height: 100%;
  flex: 1;
  position: relative;
  box-sizing: border-box;
`;
exports.Centered = styled_components_1.default(exports.Main) `
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;
const PageContainer = styled_components_1.default.div `
  display: flex;
  overflow: hidden;
  flex-grow: 1;
  box-sizing: border-box;
  width: 100%;
  color: ${(props) => props.theme.colors.text.primary};
  font-family: ${(props) => props.theme.font.family.sans};
`;
const ViewsBar = styled_components_1.default.div `
  align-items: center;
  background-color: ${(props) => props.theme.colors.border.tertiary};
  display: flex;
  height: 100%;
  flex-direction: column;
  width: 56px;
`;
const IconBar = styled_components_1.default.div `
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;

  div {
    margin: ${(props) => props.theme.grid.unit * 5}px 0 0;
    text-align: center;
    width: 56px;
  }
`;
const ViewLink = styled_components_1.default.button `
  background: transparent;
  cursor: pointer;
  width: 100%;
  text-align: left;
  border: none;
  align-items: center;
  color: ${(props) => props.theme.colors.button.secondary.color.default};
  display: flex;
  justify-content: center;
  width: 100%;
  height: ${(props) => props.theme.grid.unit * 8}px;

  &:hover {
    color: ${(props) => props.theme.colors.brand.medium};
  }
  &.active {
    color: ${(props) => props.theme.colors.brand.medium};
    background: ${(props) => props.theme.colors.brand.xlight};
  }
`;
const ViewsSeparator = styled_components_1.default.div `
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  width: ${(props) => props.theme.grid.unit * 7}px;
`;
const StyledEditProjectIcon = styled_components_1.default(EditProjectIcon_1.default) `
  g {
    stroke: currentColor;
  }
`;
const ProjectLibraryIcon = styled_components_1.default(ReferenceLibraryIcon_1.default) `
  path {
    stroke: currentColor;
  }
`;
const ProjectContributorsIcon = styled_components_1.default(ContributorsIcon_1.default) `
  path {
    stroke: currentColor;
  }

  circle {
    stroke: currentColor;
  }
`;
const COLLABORATOR = 'COLLABORATOR';
const LIBRARY = 'LIBRARY';
const Page = ({ children, project: directProject, }) => {
    const [{ storeProject, tokenData }] = store_1.useStore((store) => ({
        storeProject: store.project,
        tokenData: store.tokenData,
    }));
    const [enabled, setEnabled] = react_1.useState('');
    if (!tokenData) {
        return null;
    }
    const tokenActions = tokenData.getTokenActions();
    const selectContent = (enabled, children) => {
        switch (enabled) {
            // case COLLABORATOR:
            //   return <CollaboratorsPageContainer />
            //   break
            case LIBRARY:
                return react_1.default.createElement(LibraryPageContainer_1.default, null);
            default:
                return children;
        }
    };
    const project = directProject || storeProject;
    return (react_1.default.createElement(PageContainer, null,
        project && (react_1.default.createElement(ViewsBar, null,
            config_1.default.leanWorkflow.enabled || config_1.default.native || (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(MenuBar_1.default, { tokenActions: tokenActions },
                    react_1.default.createElement(style_guide_1.Tip, { title: 'Home', placement: 'right' },
                        react_1.default.createElement(OfflineIndicator_1.default, null,
                            react_1.default.createElement(AppIcon_1.default, { width: 34, height: 34 })))),
                react_1.default.createElement(ViewsSeparator, null))),
            react_1.default.createElement(IconBar, null,
                react_1.default.createElement(style_guide_1.Tip, { title: 'Edit ⌥⌘3', placement: 'right' },
                    react_1.default.createElement(ViewLink, { className: !enabled ? 'active' : '', onClick: () => setEnabled('') },
                        react_1.default.createElement(StyledEditProjectIcon, null))),
                react_1.default.createElement(style_guide_1.Tip, { title: 'Library ⌥⌘4', placement: 'right' },
                    react_1.default.createElement(ViewLink, { className: enabled === LIBRARY ? 'active' : '', onClick: () => setEnabled(LIBRARY) },
                        react_1.default.createElement(ProjectLibraryIcon, null))),
                config_1.default.leanWorkflow.enabled || config_1.default.local || (react_1.default.createElement(style_guide_1.Tip, { title: 'Collaborators ⌥⌘5', placement: 'right' },
                    react_1.default.createElement(ViewLink, { className: enabled === COLLABORATOR ? 'active' : '', onClick: () => setEnabled(COLLABORATOR) },
                        react_1.default.createElement(ProjectContributorsIcon, null))))),
            react_1.default.createElement(Support_1.Support, null))),
        config_1.default.crisp.id && react_1.default.createElement(Chatbox_1.Chatbox, null),
        selectContent(enabled, children)));
};
exports.Page = Page;
//# sourceMappingURL=Page.js.map