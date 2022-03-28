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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationMessage = exports.NotificationLink = exports.NotificationTitle = exports.NotificationIcon = exports.NotificationActions = exports.NotificationHead = exports.NotificationPrompt = exports.Notifications = void 0;
const AttentionBlue_1 = __importDefault(require("@manuscripts/assets/react/AttentionBlue"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const renderprops_cjs_1 = require("react-spring/renderprops.cjs");
const styled_components_1 = __importDefault(require("styled-components"));
const Notifications = (_a) => {
    var { items, removeNotification } = _a, rest = __rest(_a, ["items", "removeNotification"]);
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(renderprops_cjs_1.Transition, { items: items, keys: (item) => item.id, from: {
                transform: 'translate3d(0, 100%, 0)',
                opacity: 0,
                marginBottom: 0,
            }, enter: {
                transform: 'translate3d(0, 0, 0)',
                opacity: 1,
                marginBottom: 8,
                display: 'flex',
                width: window.innerWidth < 800 ? window.innerWidth - 16 : 800,
                maxWidth: '90%',
            }, leave: {
                opacity: 0,
                marginBottom: 0,
            } }, ({ id, notification: Notification, }) => (props) => (react_1.default.createElement("div", { style: props },
            react_1.default.createElement(Notification, Object.assign({ key: id, removeNotification: () => removeNotification(id) }, rest)))))));
};
exports.Notifications = Notifications;
const Container = styled_components_1.default.div `
  position: fixed;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
`;
exports.NotificationPrompt = styled_components_1.default.div `
  border: 1px solid ${(props) => props.theme.colors.text.muted};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  border-radius: ${(props) => props.theme.grid.radius.small};
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 4}px;
  font-family: ${(props) => props.theme.font.family.sans};
  background: ${(props) => props.theme.colors.background.primary};
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
`;
exports.NotificationHead = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
exports.NotificationActions = styled_components_1.default(style_guide_1.ButtonGroup) `
  flex: 0;

  @media (max-width: ${(props) => props.theme.grid.tablet - 1}px) {
    flex-wrap: wrap;

    button:not(:first-child) {
      margin: ${(props) => props.theme.grid.unit}px 0 0;
    }
  }
`;
exports.NotificationIcon = styled_components_1.default(AttentionBlue_1.default) `
  flex-shrink: 0;
`;
exports.NotificationTitle = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.normal};
`;
exports.NotificationLink = styled_components_1.default.a.attrs({ target: '_blank' }) `
  color: inherit;
  font-size: ${(props) => props.theme.font.size.small};
`;
exports.NotificationMessage = styled_components_1.default.div `
  margin: 0 ${(props) => props.theme.grid.unit * 4}px;
  display: flex;
  flex-direction: column;
`;
//# sourceMappingURL=Notifications.js.map