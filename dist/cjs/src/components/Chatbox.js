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
exports.Chatbox = void 0;
const Chat_1 = __importDefault(require("@manuscripts/assets/react/Chat"));
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
exports.Chatbox = react_1.default.memo(() => {
    const [open, setOpen] = react_1.useState();
    const [unreadCount, setUnreadCount] = react_1.useState();
    // mirror the opened state to this component's state
    react_1.useEffect(() => {
        window.$crisp.push([
            'on',
            'chat:opened',
            () => {
                // wait a small amount of time so the button is already hidden
                window.setTimeout(() => {
                    setOpen(true);
                }, 500);
            },
        ]);
        window.$crisp.push(['on', 'chat:closed', () => setOpen(false)]);
        const getUnreadCount = () => {
            // wait for some time, as asking for chat:unread:count immediately isn't reliable
            window.setTimeout(() => {
                if (typeof window.$crisp.get === 'function') {
                    const unreadCount = window.$crisp.get('chat:unread:count');
                    setUnreadCount(Number(unreadCount));
                }
            }, 5000);
        };
        if (typeof window.$crisp.get === 'function') {
            getUnreadCount();
        }
        else {
            window.CRISP_READY_TRIGGER = getUnreadCount;
        }
        window.$crisp.push(['on', 'message:received', getUnreadCount]);
        window.$crisp.push(['on', 'chat:closed', getUnreadCount]);
        return () => {
            delete window.CRISP_READY_TRIGGER;
            window.$crisp.push(['off', 'chat:opened']);
            window.$crisp.push(['off', 'chat:closed']);
            window.$crisp.push(['off', 'message:received']);
        };
    }, []);
    // show/hide the chatbox when it's opened/closed
    react_1.useEffect(() => {
        if (open) {
            window.$crisp.push(['do', 'chat:show']);
        }
        else {
            window.$crisp.push(['do', 'chat:hide']);
        }
    }, [open]);
    // open the chatbox on button click
    const handleClick = react_1.useCallback((event) => {
        event.preventDefault();
        window.$crisp.push(['do', 'chat:open']);
    }, []);
    if (open) {
        return null;
    }
    return (react_1.default.createElement(ChatButton, { onClick: handleClick },
        unreadCount ? react_1.default.createElement(UnreadCount, null, unreadCount) : null,
        react_1.default.createElement(Chat_1.default, { width: 32, height: 32 })));
});
const ChatButton = styled_components_1.default.button `
  cursor: pointer;
  border: none;
  background: none;
  padding: ${(props) => props.theme.grid.unit * 2}px;
  position: fixed;
  bottom: ${(props) => props.theme.grid.unit * 4}px;
  right: ${(props) => props.theme.grid.unit * 4}px;
  z-index: 5000000;

  &:hover {
    & path {
      fill: ${(props) => props.theme.colors.brand.secondary};
    }
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: initial;
  }
`;
const UnreadCount = styled_components_1.default.div `
  height: ${(props) => props.theme.grid.unit * 3}px;
  font-size: ${(props) => props.theme.font.size.small};
  background: ${(props) => props.theme.colors.brand.secondary};
  padding: 2px 6px;
  color: ${(props) => props.theme.colors.text.onDark};
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border-radius: ${(props) => props.theme.grid.radius.default};
  position: absolute;
  top: ${(props) => props.theme.grid.unit}px;
  right: ${(props) => props.theme.grid.unit}px;
`;
//# sourceMappingURL=Chatbox.js.map