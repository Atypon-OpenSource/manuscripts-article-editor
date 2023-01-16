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
exports.AuthenticationContainer = exports.Login = exports.Signup = exports.ConnectLogin = exports.OrcidLogin = exports.GoogleLogin = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const connect_png_1 = __importDefault(require("../../../assets/connect.png"));
const config_1 = __importDefault(require("../../config"));
const ButtonText = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.secondary};
`;
const IconButtonWithText = styled_components_1.default(style_guide_1.IconButton) `
  margin: ${(props) => props.theme.grid.unit}px;
  padding: 0 ${(props) => props.theme.grid.unit * 4}px;
  width: auto;
`;
const GoogleImage = styled_components_1.default.span `
  height: ${(props) => props.theme.grid.unit * 10}px;
  margin: -${(props) => props.theme.grid.unit}px 0 0 -${(props) => props.theme.grid.unit}px;
`;
const SignupButton = styled_components_1.default.button `
  color: ${(props) => props.theme.colors.background.primary};
  background-color: #0d79d0;
  font-size: 16pt;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  line-height: 1;
  font-family: Lato;

  &:hover {
    background-color: #0b6bb8;
  }
`;
const LoginButton = styled_components_1.default.button `
  color: #6c6c6c;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  border: solid 1px #ebebeb;
  border-radius: 4px;

  &:hover {
    color: ${(props) => props.theme.colors.brand.default};
  }
`;
const Text = styled_components_1.default.div `
  margin-right: 8px;
  font-weight: normal;
  font-size: 14px;

  @media (max-width: 600px) {
    display: none;
  }
`;
const SignupText = styled_components_1.default.div `
  padding: 12px 125px;
  white-space: nowrap;
  @media (max-width: 350px) {
    font-size: 14px;
  }
`;
const LoginText = styled_components_1.default.div `
  padding: 7px 15px;
`;
const GoogleLogin = ({ redirect, }) => (react_1.default.createElement(IconButtonWithText, { onClick: redirect('google'), defaultColor: true },
    react_1.default.createElement(GoogleImage, null,
        react_1.default.createElement(style_guide_1.GoogleIcon, { size: 45, title: 'Google logo' })),
    react_1.default.createElement(ButtonText, null, "Google")));
exports.GoogleLogin = GoogleLogin;
const OrcidLogin = ({ redirect, }) => (react_1.default.createElement(style_guide_1.IconButton, { onClick: redirect('orcid'), defaultColor: true },
    react_1.default.createElement(style_guide_1.OrcidIcon, { size: 48 })));
exports.OrcidLogin = OrcidLogin;
const ConnectLogin = ({ redirect, }) => (react_1.default.createElement(IconButtonWithText, { onClick: redirect('iam') },
    react_1.default.createElement("img", { src: connect_png_1.default, height: 25, alt: 'Connect logo' })));
exports.ConnectLogin = ConnectLogin;
const Signup = ({ redirect, }) => (react_1.default.createElement(SignupButton, { onClick: config_1.default.connect.enabled
        ? redirect('iam', 'register')
        : () => window.location.assign('/signup') },
    react_1.default.createElement(SignupText, null, "Sign Up")));
exports.Signup = Signup;
const Login = ({ redirect, }) => (react_1.default.createElement(style_guide_1.ButtonGroup, null,
    react_1.default.createElement(Text, null, "Already a user?"),
    react_1.default.createElement(LoginButton, { onClick: config_1.default.connect.enabled
            ? redirect('iam', 'login')
            : () => window.location.assign('/login') },
        react_1.default.createElement(LoginText, null, "Sign in"))));
exports.Login = Login;
exports.AuthenticationContainer = styled_components_1.default('div') `
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-top: 50px;
  margin-bottom: 50px;
`;
//# sourceMappingURL=Authentication.js.map