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
exports.TrackChangesStyles = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../../../config"));
const store_1 = require("../../../store");
const useEditorStore_1 = require("../../track-changes/useEditorStore");
const TrackChangesOn = styled_components_1.default.div `

  .track-changes--control {
    display: none;
    position: absolute;
  }

  .track-changes--control > button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: ${(props) => props.theme.colors.button.secondary.background.default};
    border: 1px solid
      ${(props) => props.theme.colors.button.secondary.border.default};
    color: ${(props) => props.theme.colors.button.secondary.color.default};
    width: 2em;
    height: 2em;
    border-radius: 50%;
    cursor: pointer;
  }

  .track-changes--control > button:hover {
    background: ${(props) => props.theme.colors.button.default.background.hover} !important;
  }

  .track-changes--control > button > svg {
    display: inline-flex;
    width: 1.2em;
    height: 1.2em;
  }
  }
`;
const TrackChangesReadOnly = styled_components_1.default(TrackChangesOn) `
  .track-changes--control {
    display: none !important;
  }
`;
const TrackChangesRejectOnly = styled_components_1.default(TrackChangesOn) `
  [data-action='accept'] {
    display: none !important;
  }
`;
const TrackChangesOff = styled_components_1.default.div `
  .track-changes--control {
    display: none !important;
  }
`;
const Actions = styled_components_1.default.div `
  .pending:hover + .track-changes--control:is(${(props) => props.selector}),
  .track-changes--control:is(${(props) => props.selector}):hover {
    display: inline-flex;
  }
`;
const trackChangesCssSelector = (ids) => {
    return ids.map((id) => `[data-changeid="${id}"]`).join(',\n');
};
const TrackChangesStyles = ({ children }) => {
    const { trackState } = useEditorStore_1.useEditorStore();
    const can = style_guide_1.usePermissions();
    const [user] = store_1.useStore((store) => store.user);
    const { changeSet } = trackState || {};
    const suggestedChangesSelector = trackChangesCssSelector((changeSet === null || changeSet === void 0 ? void 0 : changeSet.pending) ? changeSet === null || changeSet === void 0 ? void 0 : changeSet.pending.map((change) => change.id) : []);
    const mySuggestedChangesSelector = trackChangesCssSelector((changeSet === null || changeSet === void 0 ? void 0 : changeSet.pending)
        ? changeSet === null || changeSet === void 0 ? void 0 : changeSet.pending.filter((change) => change.dataTracked.authorID == (user === null || user === void 0 ? void 0 : user._id)).map((change) => change.id)
        : []);
    if (!config_1.default.quarterback.enabled) {
        return react_1.default.createElement(TrackChangesOff, null, children);
    }
    if (can.handleSuggestion) {
        return (react_1.default.createElement(TrackChangesOn, null,
            react_1.default.createElement(Actions, { selector: suggestedChangesSelector }, children)));
    }
    if (can.rejectOwnSuggestion) {
        return (react_1.default.createElement(TrackChangesRejectOnly, null,
            react_1.default.createElement(Actions, { selector: mySuggestedChangesSelector }, children)));
    }
    return react_1.default.createElement(TrackChangesReadOnly, null, children);
};
exports.TrackChangesStyles = TrackChangesStyles;
//# sourceMappingURL=TrackChangesStyles.js.map