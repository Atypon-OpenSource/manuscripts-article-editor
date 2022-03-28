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
exports.SorryPage = exports.RetrieveAccountPage = void 0;
const AppIcon_1 = __importDefault(require("@manuscripts/assets/react/AppIcon"));
const LandingDecorationsLeft_1 = __importDefault(require("@manuscripts/assets/react/LandingDecorationsLeft"));
const LandingDecorationsRight_1 = __importDefault(require("@manuscripts/assets/react/LandingDecorationsRight"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const IntroPage_1 = require("./IntroPage");
const Page_1 = require("./Page");
const Title = styled_components_1.default.div `
  text-align: center;
  color: #5e6f7e;
  font-weight: 300;
  padding-top: 24px;
  padding-bottom: 24px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 600px) {
    font-size: 16pt;
    width: 85%;
  }

  @media (min-width: 600px) {
    font-size: 32px;
    width: 502px;
  }
`;
const AppIconContainer = styled_components_1.default.div `
  margin-left: auto;
  margin-right: auto;
  margin-top: ${(props) => props.theme.grid.unit * 16}px;
`;
const Container = styled_components_1.default.div `
  position: fixed;
  width: 100%;
  height: 100%;
`;
const PrimaryButton = styled_components_1.default.button `
  color: ${(props) => props.theme.colors.background.primary};
  background-color: #0d79d0;
  font-size: ${(props) => props.theme.grid.unit * 4}px;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  line-height: 1;
  font-family: Lato;

  &:hover {
    background-color: #0b6bb8;
  }
`;
const Text = styled_components_1.default.div `
  padding: 12px 125px;
  white-space: nowrap;
  @media (max-width: 350px) {
    font-size: 14px;
  }
`;
const Description = styled_components_1.default.div `
  padding-bottom: ${(props) => props.theme.grid.unit * 20}px;
  text-align: center;
  line-height: 1.5em;
  color: #6c6c6c;

  @media (max-width: 600px) {
    width: 85%;
  }

  @media (min-width: 600px) {
    width: 480px;
  }
`;
const Note = styled_components_1.default.div `
  color: #949494;
  font-size: 14px;
  margin-top: ${(props) => props.theme.grid.unit * 4}px;
`;
const SecondaryButton = styled_components_1.default(style_guide_1.TertiaryButton) `
  margin-top: ${(props) => props.theme.grid.unit * 2}px;
  padding: 8px 12px;
  &:hover {
    background-color: none;
  }
`;
const RetrieveText = styled_components_1.default(Text) `
  padding: 12px 80px;
`;
const RetrieveAccountPage = ({ handleRetrieve }) => (react_1.default.createElement(Container, null,
    react_1.default.createElement(IntroPage_1.LandingDecorationsLeftContainer, null,
        react_1.default.createElement(LandingDecorationsLeft_1.default, null)),
    react_1.default.createElement(IntroPage_1.LandingDecorationsRightContainer, null,
        react_1.default.createElement(LandingDecorationsRight_1.default, null)),
    react_1.default.createElement(Page_1.Centered, null,
        react_1.default.createElement(AppIconContainer, null,
            react_1.default.createElement(AppIcon_1.default, null)),
        react_1.default.createElement(Title, null, "Retrieve My Account"),
        react_1.default.createElement(Description, null, "By clicking \u201CRetrieve My Account\u201D, you will cancel your request to delete your account and you will have full access to your projects and to the projects you were invited to."),
        react_1.default.createElement(PrimaryButton, { onClick: handleRetrieve },
            react_1.default.createElement(RetrieveText, null, "Retrieve my Account")),
        react_1.default.createElement(Note, null, "You have 30 days to retrieve your account"))));
exports.RetrieveAccountPage = RetrieveAccountPage;
const SorryPage = (props) => (react_1.default.createElement(Page_1.Centered, null,
    react_1.default.createElement(AppIconContainer, null,
        react_1.default.createElement(AppIcon_1.default, null)),
    react_1.default.createElement(Title, null, "Sorry to see you go!"),
    react_1.default.createElement(Description, null, "Your account has been deleted but it will remain accessible for 30 days to download your existing data. In case you changed your mind, you can retrieve your account."),
    react_1.default.createElement(PrimaryButton, { onClick: () => window.location.assign('/about/') },
        react_1.default.createElement(Text, null, "Sign Up")),
    react_1.default.createElement(SecondaryButton, { onClick: () => props.history.push('/retrieve-account') }, "Retrieve my Account")));
exports.SorryPage = SorryPage;
//# sourceMappingURL=RetrieveAccountPage.js.map