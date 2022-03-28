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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Corrections = exports.groupCorrectionsByStatus = void 0;
const track_changes_1 = require("@manuscripts/track-changes");
const react_1 = __importStar(require("react"));
const store_1 = require("../../store");
const CorrectionsSection_1 = require("./CorrectionsSection");
const groupCorrectionsByStatus = (corrections) => {
    const filteredCorrectionsByStatus = {
        proposed: [],
        accepted: [],
        rejected: [],
    };
    const correctionsByStatus = corrections.reduce((total, correction) => {
        if (correction.status.label === 'proposed') {
            total.proposed.push(correction);
        }
        else if (correction.status.label === 'accepted') {
            total.accepted.push(correction);
        }
        else if (correction.status.label === 'rejected') {
            total.rejected.push(correction);
        }
        return total;
    }, filteredCorrectionsByStatus);
    return correctionsByStatus;
};
exports.groupCorrectionsByStatus = groupCorrectionsByStatus;
const Corrections = ({ corrections, commits, editor, accept, reject, }) => {
    const [{ project, user, collaborators }] = store_1.useStore((store) => ({
        project: store.project,
        user: store.user,
        collaborators: store.collaborators || new Map(),
    }));
    const getCommitFromCorrectionId = react_1.useCallback((correctionId) => {
        const correction = corrections.find((corr) => corr._id === correctionId);
        if (!correction) {
            return null;
        }
        const commit = commits.find((commit) => commit.changeID === correction.commitChangeID);
        return commit || null;
    }, [commits, corrections]);
    const getCollaboratorById = react_1.useCallback((id) => collaborators.get(id), [collaborators]);
    const focusCorrection = (correctionId) => {
        const commit = getCommitFromCorrectionId(correctionId);
        if (!commit) {
            return;
        }
        editor.doCommand(track_changes_1.commands.focusCommit(commit.changeID));
    };
    const correctionsByStatus = exports.groupCorrectionsByStatus(corrections);
    const approveAll = correctionsByStatus.proposed.length
        ? () => {
            correctionsByStatus.proposed.forEach((correction) => {
                accept(correction._id);
            });
        }
        : undefined;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(CorrectionsSection_1.CorrectionsSection, { title: 'Suggestions', corrections: correctionsByStatus.proposed, project: project, focusedCommit: null, getCollaboratorById: getCollaboratorById, handleFocus: focusCorrection, handleAccept: accept, handleReject: reject, approveAll: approveAll, user: user }),
        react_1.default.createElement(CorrectionsSection_1.CorrectionsSection, { title: 'Approved Suggestions', corrections: correctionsByStatus.accepted, project: project, focusedCommit: null, getCollaboratorById: getCollaboratorById, handleFocus: focusCorrection, handleAccept: accept, handleReject: reject, user: user }),
        react_1.default.createElement(CorrectionsSection_1.CorrectionsSection, { title: 'Rejected Suggestions', corrections: correctionsByStatus.rejected, project: project, focusedCommit: null, getCollaboratorById: getCollaboratorById, handleFocus: focusCorrection, handleAccept: accept, handleReject: reject, user: user })));
};
exports.Corrections = Corrections;
//# sourceMappingURL=Corrections.js.map