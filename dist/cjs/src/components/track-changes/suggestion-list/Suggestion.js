"use strict";
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
exports.Suggestion = void 0;
/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
const style_guide_1 = require("@manuscripts/style-guide");
const track_changes_plugin_1 = require("@manuscripts/track-changes-plugin");
const react_1 = __importStar(require("react"));
const react_tooltip_1 = __importDefault(require("react-tooltip"));
const styled_components_1 = __importDefault(require("styled-components"));
const store_1 = require("../../../store");
const Icons_1 = require("./Icons");
const SuggestionSnippet_1 = require("./SuggestionSnippet");
const Suggestion = ({ suggestion, handleAccept, handleReject, handleReset, }) => {
    const [user] = store_1.useStore((store) => store.user);
    const can = style_guide_1.usePermissions();
    const canRejectOwnSuggestion = react_1.useMemo(() => {
        if (can.handleSuggestion ||
            (can.rejectOwnSuggestion &&
                suggestion.dataTracked.status === track_changes_plugin_1.CHANGE_STATUS.pending &&
                suggestion.dataTracked.authorID === (user === null || user === void 0 ? void 0 : user._id))) {
            return true;
        }
        return false;
    }, [suggestion, can, user === null || user === void 0 ? void 0 : user._id]);
    const isRejected = react_1.useMemo(() => {
        return suggestion.dataTracked.status === track_changes_plugin_1.CHANGE_STATUS.rejected;
    }, [suggestion]);
    const isAccepted = react_1.useMemo(() => {
        return suggestion.dataTracked.status === track_changes_plugin_1.CHANGE_STATUS.accepted;
    }, [suggestion]);
    return (react_1.default.createElement(Wrapper, { isFocused: false },
        react_1.default.createElement(FocusHandle
        // href="#"
        // onClick={() => {
        //   console.log('click')
        // }}
        , { 
            // href="#"
            // onClick={() => {
            //   console.log('click')
            // }}
            isDisabled: isRejected },
            react_1.default.createElement(SuggestionSnippet_1.SuggestionSnippet, { suggestion: suggestion })),
        react_1.default.createElement(Actions, null,
            react_1.default.createElement(react_1.default.Fragment, null,
                canRejectOwnSuggestion && (react_1.default.createElement(Container, null,
                    react_1.default.createElement(Action, { type: "button", onClick: () => isRejected
                            ? handleReset(suggestion)
                            : handleReject(suggestion), "aria-pressed": isRejected, "data-tip": true, "data-for": isRejected ? 'back' : 'reject' }, isRejected ? (react_1.default.createElement(Icons_1.Back, { color: "#353535" })) : (react_1.default.createElement(Icons_1.Reject, { color: "#353535" }))),
                    react_1.default.createElement(react_tooltip_1.default, { id: isRejected ? 'back' : 'reject', place: "bottom", effect: "solid", offset: { top: 10 }, className: "tooltip" }, (isRejected && 'Back to suggestions') || 'Reject'))),
                can.handleSuggestion && (react_1.default.createElement(Container, null,
                    react_1.default.createElement(Action, { type: "button", onClick: () => isAccepted
                            ? handleReset(suggestion)
                            : handleAccept(suggestion), "aria-pressed": isAccepted, "data-tip": true, "data-for": isAccepted ? 'back' : 'accept' }, isAccepted ? (react_1.default.createElement(Icons_1.Back, { color: "#353535" })) : (react_1.default.createElement(Icons_1.Accept, { color: "#353535" }))),
                    react_1.default.createElement(react_tooltip_1.default, { id: isAccepted ? 'back' : 'accept', place: "bottom", effect: "solid", offset: { top: 10 }, className: "tooltip" }, (isAccepted && 'Back to suggestions') || 'Approve')))))));
};
exports.Suggestion = Suggestion;
const Actions = styled_components_1.default.div `
  display: flex;
  visibility: hidden;
`;
const Wrapper = styled_components_1.default.li `
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.grid.unit * 3}px
    ${(props) => props.theme.grid.unit * 2}px !important;
  border-top: 1px solid ${(props) => props.theme.colors.background.secondary};
  list-style-type: none;

  /* FocusHandle should cover entire card: */
  position: relative;

  &:hover {
    background: ${(props) => props.theme.colors.background.fifth} !important;

    ${SuggestionSnippet_1.AvatarContainer}, ${Actions}, ${SuggestionSnippet_1.Time} {
      visibility: visible;
    }
  }
`;
const FocusHandle = styled_components_1.default.a `
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  pointer-events: ${(props) => (props.isDisabled ? 'none' : 'all')};
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
  overflow: hidden;
`;
const Action = styled_components_1.default.button `
  background-color: transparent;
  margin: 0 ${(props) => props.theme.grid.unit * 2}px;
  border: 1px solid transparent;
  border-radius: 50%;
  padding: 0;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  width: ${(props) => props.theme.grid.unit * 6}px;
  height: ${(props) => props.theme.grid.unit * 6}px;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:not([disabled]):hover {
    &[aria-pressed='true'] {
      path {
        stroke: #1a9bc7;
      }
    }

    &[aria-pressed='false'] {
      path {
        fill: #1a9bc7;
      }
    }
    background: #f2fbfc;
    border: 1px solid #c9c9c9;
  }

  &:focus {
    outline: none;
  }
`;
const Container = styled_components_1.default.div `
  .tooltip {
    border-radius: 6px;
    padding: ${(props) => props.theme.grid.unit * 2}px;
    max-width: ${(props) => props.theme.grid.unit * 15}px;
    font-size: ${(props) => props.theme.grid.unit * 3}px;
  }
`;
//# sourceMappingURL=Suggestion.js.map