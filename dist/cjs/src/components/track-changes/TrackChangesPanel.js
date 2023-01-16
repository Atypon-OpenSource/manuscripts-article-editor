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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackChangesPanel = void 0;
const track_changes_plugin_1 = require("@manuscripts/track-changes-plugin");
const react_1 = __importStar(require("react"));
const useAuthStore_1 = require("../../quarterback/useAuthStore");
const useCommentStore_1 = require("../../quarterback/useCommentStore");
const useDocStore_1 = require("../../quarterback/useDocStore");
const SnapshotsDropdown_1 = require("../inspector/SnapshotsDropdown");
const SortByDropdown_1 = require("./SortByDropdown");
const SuggestionList_1 = require("./suggestion-list/SuggestionList");
const useEditorStore_1 = require("./useEditorStore");
function TrackChangesPanel() {
    const { user, authenticate } = useAuthStore_1.useAuthStore();
    const { execCmd, trackState } = useEditorStore_1.useEditorStore();
    const { listComments } = useCommentStore_1.useCommentStore();
    const { currentDocument } = useDocStore_1.useDocStore();
    const { changeSet } = trackState || {};
    const [sortBy, setSortBy] = react_1.useState('Date');
    react_1.useEffect(() => {
        function loginListComments(docId) {
            return __awaiter(this, void 0, void 0, function* () {
                yield authenticate();
                // Comments for individual changes, example in old code & quarterback example. Not in use atm 8.9.2022
                yield listComments(docId);
            });
        }
        currentDocument && loginListComments(currentDocument.manuscriptID);
        execCmd(track_changes_plugin_1.trackCommands.setUserID(user.id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, execCmd]);
    function handleSort(event) {
        setSortBy(event.currentTarget.value);
    }
    function handleAcceptChange(c) {
        const ids = [c.id];
        if (c.type === 'node-change') {
            c.children.forEach((child) => {
                ids.push(child.id);
            });
        }
        execCmd(track_changes_plugin_1.trackCommands.setChangeStatuses(track_changes_plugin_1.CHANGE_STATUS.accepted, ids));
    }
    function handleRejectChange(c) {
        const ids = [c.id];
        if (c.type === 'node-change') {
            c.children.forEach((child) => {
                ids.push(child.id);
            });
        }
        execCmd(track_changes_plugin_1.trackCommands.setChangeStatuses(track_changes_plugin_1.CHANGE_STATUS.rejected, ids));
    }
    function handleResetChange(c) {
        const ids = [c.id];
        if (c.type === 'node-change') {
            c.children.forEach((child) => {
                ids.push(child.id);
            });
        }
        execCmd(track_changes_plugin_1.trackCommands.setChangeStatuses(track_changes_plugin_1.CHANGE_STATUS.pending, ids));
    }
    function handleAcceptPending() {
        if (!trackState) {
            return;
        }
        const { changeSet } = trackState;
        const ids = track_changes_plugin_1.ChangeSet.flattenTreeToIds(changeSet.pending);
        execCmd(track_changes_plugin_1.trackCommands.setChangeStatuses(track_changes_plugin_1.CHANGE_STATUS.accepted, ids));
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(SnapshotsDropdown_1.SnapshotsDropdown, null),
        react_1.default.createElement(SortByDropdown_1.SortByDropdown, { sortBy: sortBy, handleSort: handleSort }),
        react_1.default.createElement(SuggestionList_1.SuggestionList, { changes: (changeSet === null || changeSet === void 0 ? void 0 : changeSet.pending) || [], title: "Suggestions", sortBy: sortBy, handleAcceptChange: handleAcceptChange, handleRejectChange: handleRejectChange, handleResetChange: handleResetChange, handleAcceptPending: (changeSet === null || changeSet === void 0 ? void 0 : changeSet.pending.length) ? handleAcceptPending : undefined }),
        react_1.default.createElement(SuggestionList_1.SuggestionList, { changes: (changeSet === null || changeSet === void 0 ? void 0 : changeSet.accepted) || [], title: "Approved Suggestions", sortBy: sortBy, handleAcceptChange: handleAcceptChange, handleRejectChange: handleRejectChange, handleResetChange: handleResetChange }),
        react_1.default.createElement(SuggestionList_1.SuggestionList, { changes: (changeSet === null || changeSet === void 0 ? void 0 : changeSet.rejected) || [], title: "Rejected Suggestions", sortBy: sortBy, handleAcceptChange: handleAcceptChange, handleRejectChange: handleRejectChange, handleResetChange: handleResetChange })));
}
exports.TrackChangesPanel = TrackChangesPanel;
//# sourceMappingURL=TrackChangesPanel.js.map