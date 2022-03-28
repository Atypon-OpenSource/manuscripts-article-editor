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
exports.IntroPage = exports.LandingDecorationsRightContainer = exports.LandingDecorationsLeftContainer = void 0;
const FavIcon_1 = __importDefault(require("@manuscripts/assets/react/FavIcon"));
const LandingDecorationsLeft_1 = __importDefault(require("@manuscripts/assets/react/LandingDecorationsLeft"));
const LandingDecorationsRight_1 = __importDefault(require("@manuscripts/assets/react/LandingDecorationsRight"));
const LogotypeGrey_1 = __importDefault(require("@manuscripts/assets/react/LogotypeGrey"));
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const AuthButtonContainer_1 = __importDefault(require("./account/AuthButtonContainer"));
const Authentication_1 = require("./account/Authentication");
const Page_1 = require("./Page");
const Description = styled_components_1.default.div `
  text-align: center;
  color: #5e6f7e;
  font-weight: 300;
  padding-top: 1.5em;
  padding-bottom: 1em;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 600px) {
    font-size: 16pt;
    width: 85%;
  }

  @media (min-width: 600px) {
    font-size: 36pt;
    width: 550px;
  }
`;
exports.LandingDecorationsLeftContainer = styled_components_1.default.div `
  position: absolute;
  pointer-events: none;

  @media (max-width: 600px) {
    display: none;
  }
`;
exports.LandingDecorationsRightContainer = styled_components_1.default.div `
  position: absolute;
  right: 0px;
  pointer-events: none;

  @media (max-width: 600px) {
    display: none;
  }
`;
const AppIconContainer = styled_components_1.default.div `
  margin-left: auto;
  margin-right: auto;
`;
const Header = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  padding: 0 1.5rem;
`;
const StyledLogotypeGrey = styled_components_1.default(LogotypeGrey_1.default) `
  @media (min-width: 600px) {
    width: 250px;
  }
`;
const LogoContainer = styled_components_1.default.div `
  width: 10em;
`;
const Container = styled_components_1.default.div `
  position: fixed;
  width: 100%;
  height: 100%;
`;
const IntroPage = ({ message: Message }) => (react_1.default.createElement(Container, null,
    react_1.default.createElement(exports.LandingDecorationsLeftContainer, null,
        react_1.default.createElement(LandingDecorationsLeft_1.default, null)),
    react_1.default.createElement(exports.LandingDecorationsRightContainer, null,
        react_1.default.createElement(LandingDecorationsRight_1.default, null)),
    react_1.default.createElement(Header, null,
        react_1.default.createElement(LogoContainer, null,
            react_1.default.createElement(StyledLogotypeGrey, { width: '100%' })),
        react_1.default.createElement(AuthButtonContainer_1.default, { component: Authentication_1.Login })),
    Message && react_1.default.createElement(Message, null),
    react_1.default.createElement(Page_1.Centered, null,
        react_1.default.createElement(AppIconContainer, null,
            react_1.default.createElement(FavIcon_1.default, { width: 305, height: 200 })),
        react_1.default.createElement(Description, null, "A simple authoring tool for complex documents."),
        react_1.default.createElement(AuthButtonContainer_1.default, { component: Authentication_1.Signup }))));
exports.IntroPage = IntroPage;
//# sourceMappingURL=IntroPage.js.map