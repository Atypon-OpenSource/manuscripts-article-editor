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
exports.CollaboratorForm = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const DetailsContainer = styled_components_1.default.div `
  padding: 14px 0px 0px 40px;
  width: 65%;
`;
const InfoContainer = styled_components_1.default.div `
  position: absolute;
  bottom: ${(props) => props.theme.grid.unit * 4}px;
  width: inherit;
`;
const NameField = styled_components_1.default.div `
  display: inline-flex;
  font-size: ${(props) => props.theme.font.size.xlarge};
  font-weight: ${(props) => props.theme.font.weight.normal};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: 26px;
`;
const EmailContainer = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.large};
  font-weight: ${(props) => props.theme.font.weight.medium};
  margin: ${(props) => props.theme.grid.unit * 4}px;
  position: relative;
  top: ${(props) => props.theme.grid.unit * 2}px;
`;
const CollaboratorInformationContainer = styled_components_1.default.div `
  display: flex;
  padding-bottom: ${(props) => props.theme.grid.unit * 10}px;
`;
const Legend = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.xlarge};
  font-weight: ${(props) => props.theme.font.weight.medium};
  padding-bottom: ${(props) => props.theme.grid.unit * 5}px;
`;
const EmptyFieldText = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.large};
  color: ${(props) => props.theme.colors.text.primary};
  opacity: 0.3;
  padding-left: 1px;
`;
const AffiliationLabel = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.large};
  color: ${(props) => props.theme.colors.text.primary};
  padding: 3px 5px;
  background: ${(props) => props.theme.colors.background.tertiary};
  border-radius: ${(props) => props.theme.grid.radius.small};
  display: inline-flex;
  margin-right: ${(props) => props.theme.grid.unit * 2}px;
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
`;
const AffiliationGroupContainer = styled_components_1.default.div `
  max-width: 600px;
`;
const CollaboratorForm = ({ collaborator, manageProfile, user, affiliations, }) => (react_1.default.createElement(DetailsContainer, null,
    react_1.default.createElement(NameField, null, `${collaborator.bibliographicName.given} ${collaborator.bibliographicName.family}`),
    react_1.default.createElement(CollaboratorInformationContainer, null,
        react_1.default.createElement(style_guide_1.Avatar, { size: 74, src: collaborator.avatar, color: '#6e6e6e' }),
        react_1.default.createElement("div", null,
            react_1.default.createElement(EmailContainer, null, collaborator.email))),
    react_1.default.createElement(Legend, null, "Affiliations"),
    !affiliations ? (react_1.default.createElement(EmptyFieldText, null, "No Affiliations")) : (react_1.default.createElement(AffiliationGroupContainer, null, affiliations.map((affiliation) => (react_1.default.createElement(AffiliationLabel, { key: affiliation._id }, affiliation.institution))))),
    collaborator.userID === user.userID && (react_1.default.createElement(InfoContainer, null,
        react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.info, dismissButton: { text: 'Manage profile', action: manageProfile } }, "These are your details.")))));
exports.CollaboratorForm = CollaboratorForm;
//# sourceMappingURL=CollaboratorForm.js.map