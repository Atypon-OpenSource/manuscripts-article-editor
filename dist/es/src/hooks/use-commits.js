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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCommits = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const track_changes_1 = require("@manuscripts/track-changes");
const react_1 = require("react");
const uuid_1 = require("uuid");
const bootstrap_manuscript_1 = require("../lib/bootstrap-manuscript");
const session_id_1 = __importDefault(require("../lib/session-id"));
const store_1 = require("../store");
const use_unmount_effect_1 = require("./use-unmount-effect");
const use_window_unload_effect_1 = require("./use-window-unload-effect");
const buildCorrection = (data) => (Object.assign({ _id: `MPCorrection:${uuid_1.v4()}`, createdAt: Date.now() / 1000, updatedAt: Date.now() / 1000, sessionID: session_id_1.default, objectType: manuscripts_json_schema_1.ObjectTypes.Correction }, data));
const correctionsByDate = (a, b) => b.contributions[0].timestamp - a.contributions[0].timestamp;
const correctionsByContext = (a, b) => a.positionInSnapshot - b.positionInSnapshot;
// TODO: Refactor to use useMicrostore
const useCommits = ({ sortBy, editor }) => {
    const [store] = store_1.useStore((store) => {
        var _a;
        return ({
            modelMap: store.modelMap,
            saveModel: store.saveModel,
            initialCommits: store.commits,
            projectID: store.project._id,
            manuscriptID: store.manuscript._id,
            snapshotID: store.snapshotID,
            userProfileID: ((_a = store.user) === null || _a === void 0 ? void 0 : _a._id) || '',
            ancestorDoc: store.ancestorDoc,
        });
    });
    const [handlers] = store_1.useStore((store) => {
        return {
            saveCommitToDb: store.saveCommit,
            saveCorrectionToDb: store.saveCorrection,
        };
    });
    const { saveCommitToDb, saveCorrectionToDb } = handlers;
    const [lastSave, setLastSave] = react_1.useState(Date.now());
    const timeSinceLastSave = react_1.useCallback(() => Date.now() - lastSave, [lastSave]);
    const [commits, setCommits] = react_1.useState(store.initialCommits);
    const [corrections, setCorrections] = react_1.useState(manuscript_transform_1.getModelsByType(store.modelMap, manuscripts_json_schema_1.ObjectTypes.Correction).filter((corr) => corr.snapshotID === store.snapshotID));
    const { commit: currentCommit } = track_changes_1.getTrackPluginState(editor.state);
    const [isDirty, setIsDirty] = react_1.useState(false);
    const saveCommit = (commit) => {
        setCommits((last) => [...last, commit]);
        return saveCommitToDb(commit);
    };
    const saveCorrection = (correction) => {
        setCorrections((last) => [
            ...last.filter((corr) => corr._id !== correction._id),
            correction,
        ]);
        return saveCorrectionToDb(correction);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const freeze = (asAccepted) => __awaiter(void 0, void 0, void 0, function* () {
        const { commit } = track_changes_1.getTrackPluginState(editor.state);
        if (!commit.steps.length) {
            return;
        }
        const changeSummary = track_changes_1.getChangeSummary(editor.state, commit.changeID);
        if (!changeSummary) {
            return;
        }
        let changeType = 'text';
        //This is needed because some changes have no inserted or deleted text, but we still need to define the change type (i.e figure update), so we can add a suggestion indicating that change.
        if (changeSummary.deletion.length === 0 &&
            changeSummary.insertion.length === 0) {
            changeType = track_changes_1.commitToJSON(commit, store.projectID).steps[0].slice
                .content[0].type;
            if (changeType !== 'figure') {
                return;
            }
        }
        setIsDirty(true);
        bootstrap_manuscript_1.saveEditorState(editor.state, store.modelMap, store.saveModel);
        editor.doCommand(track_changes_1.commands.freezeCommit());
        setLastSave(Date.now());
        const correction = buildCorrection({
            contributions: [manuscript_transform_1.buildContribution(store.userProfileID)],
            commitChangeID: commit.changeID,
            containerID: store.projectID,
            manuscriptID: store.manuscriptID,
            snapshotID: store.snapshotID || '',
            insertion: changeSummary.insertion ||
                (changeType == 'figure' && 'IMAGE UPDATED') ||
                '',
            deletion: changeSummary.deletion || '',
            positionInSnapshot: changeSummary ? changeSummary.ancestorPos : undefined,
            status: {
                label: asAccepted ? 'accepted' : 'proposed',
                editorProfileID: store.userProfileID,
            },
        });
        return Promise.all([
            saveCommit(commit),
            saveCorrection(correction),
        ]).finally(() => setIsDirty(false));
    });
    // Freeze the commit when 10 s has passed since the last save AND
    // the cursor is not contiguous with any part of the current commit
    react_1.useEffect(() => {
        if (timeSinceLastSave() > 10000 &&
            !track_changes_1.isCommitContiguousWithSelection(editor.state)) {
            freeze();
        }
    }, [editor.state, freeze, timeSinceLastSave]);
    use_unmount_effect_1.useUnmountEffect(freeze);
    use_window_unload_effect_1.useWindowUnloadEffect(freeze, !!currentCommit.steps.length);
    const unreject = (correction) => {
        const unrejectedCorrections = corrections
            .filter((cor) => cor._id === correction._id || cor.status.label !== 'rejected')
            .map((cor) => cor.commitChangeID || '');
        const existingCommit = track_changes_1.findCommitWithChanges(commits, unrejectedCorrections);
        if (existingCommit) {
            editor.replaceState(track_changes_1.checkout(store.ancestorDoc, editor.state, existingCommit));
            return;
        }
        // TODO: is there some way to find the most optimal instance? The first
        // one created should be the one that was never rebased?
        const pickInstances = commits
            .map((commit) => track_changes_1.findCommitWithin(commit)(correction.commitChangeID))
            .filter(Boolean).sort((a, b) => a.updatedAt - b.updatedAt);
        if (!pickInstances.length) {
            return;
        }
        const { commit: nextCommit, mapping } = track_changes_1.rebases.cherryPick(pickInstances[0], currentCommit);
        saveCommit(nextCommit);
        editor.replaceState(track_changes_1.checkout(store.ancestorDoc, editor.state, nextCommit, mapping));
    };
    const findOneCorrection = (correction) => {
        return typeof correction === 'function'
            ? corrections.find(correction)
            : corrections.find((corr) => corr._id === correction);
    };
    const accept = (correction) => {
        const current = findOneCorrection(correction);
        if (!current) {
            return freeze(true);
        }
        const { status } = current;
        if (status.label === 'rejected') {
            unreject(current);
        }
        saveCorrection(Object.assign(Object.assign({}, current), { status: {
                label: status.label === 'accepted' ? 'proposed' : 'accepted',
                editorProfileID: store.userProfileID,
            }, updatedAt: Date.now() / 1000 }));
    };
    const reject = (correction) => {
        const current = findOneCorrection(correction);
        if (!current) {
            return editor.replaceState(track_changes_1.reset(store.ancestorDoc, editor.state));
        }
        const { status } = current;
        if (status.label === 'rejected') {
            saveCorrection(Object.assign(Object.assign({}, current), { status: { label: 'proposed', editorProfileID: store.userProfileID }, updatedAt: Date.now() / 1000 }));
            return unreject(current);
        }
        saveCorrection(Object.assign(Object.assign({}, current), { status: { label: 'rejected', editorProfileID: store.userProfileID }, updatedAt: Date.now() / 1000 }));
        const unrejectedCorrections = corrections
            .filter((cor) => cor.status.label !== 'rejected' && cor._id !== current._id)
            .map((cor) => cor.commitChangeID || '');
        const existingCommit = track_changes_1.findCommitWithChanges(commits, unrejectedCorrections);
        if (existingCommit) {
            editor.replaceState(track_changes_1.checkout(store.ancestorDoc, editor.state, existingCommit));
            return;
        }
        const commitToRemove = track_changes_1.findCommitWithin(currentCommit)(current.commitChangeID);
        if (!commitToRemove) {
            // safely return early because the commit is not in the current list
            return;
        }
        const { commit: nextCommit, mapping } = track_changes_1.rebases.without(currentCommit, [
            commitToRemove.changeID,
        ]);
        if (!nextCommit) {
            return;
        }
        saveCommit(nextCommit);
        editor.replaceState(track_changes_1.checkout(store.ancestorDoc, editor.state, nextCommit, mapping));
    };
    return {
        commits,
        isDirty,
        corrections: corrections
            .slice()
            .sort(sortBy === 'Date' ? correctionsByDate : correctionsByContext),
        accept,
        reject,
        commitHash: currentCommit._id,
    };
};
exports.useCommits = useCommits;
//# sourceMappingURL=use-commits.js.map