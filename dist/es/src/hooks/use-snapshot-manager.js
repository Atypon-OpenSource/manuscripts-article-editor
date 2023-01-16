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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSnapshotManager = exports.buildSnapshot = exports.SaveSnapshotStatus = void 0;
const Check_1 = __importDefault(require("@manuscripts/assets/react/Check"));
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const uuid_1 = require("uuid");
const Notifications_1 = require("../components/Notifications");
const api = __importStar(require("../lib/snapshot"));
const exporter_1 = require("../pressroom/exporter");
const CollectionManager_1 = __importDefault(require("../sync/CollectionManager"));
var SaveSnapshotStatus;
(function (SaveSnapshotStatus) {
    SaveSnapshotStatus["Ready"] = "Ready";
    SaveSnapshotStatus["Submitting"] = "Submitting";
    SaveSnapshotStatus["GotResponse"] = "GotResponse";
    SaveSnapshotStatus["Saved"] = "Saved";
    SaveSnapshotStatus["Error"] = "Error";
})(SaveSnapshotStatus = exports.SaveSnapshotStatus || (exports.SaveSnapshotStatus = {}));
const getInitialState = () => ({
    textName: '',
    status: SaveSnapshotStatus.Ready,
    nameSubmitted: false,
});
const buildSnapshot = ({ creator, key, proofs }, name) => ({
    _id: `MPSnapshot:${uuid_1.v4()}`,
    objectType: manuscripts_json_schema_1.ObjectTypes.Snapshot,
    creator,
    s3Id: key,
    proof: proofs && proofs.filter(Boolean),
    name,
});
exports.buildSnapshot = buildSnapshot;
const SnapshotSuccessNotification = ({ removeNotification, }) => (react_1.default.createElement(Notifications_1.NotificationPrompt, null,
    react_1.default.createElement(Notifications_1.NotificationHead, null,
        react_1.default.createElement(Check_1.default, { color: 'green' }),
        react_1.default.createElement(Notifications_1.NotificationMessage, null,
            react_1.default.createElement(Notifications_1.NotificationTitle, null, "Snapshot saved successfully"))),
    react_1.default.createElement(Notifications_1.NotificationActions, null,
        react_1.default.createElement(style_guide_1.SecondaryButton, { onClick: removeNotification }, "Dismiss"))));
const useSnapshotManager = (project, showNotification) => {
    const collection = CollectionManager_1.default.getCollection(`project-${project._id}`);
    const [state, setState] = react_1.useState(getInitialState);
    const getEntireProject = react_1.useCallback(() => collection
        .find({ containerID: project._id })
        .exec()
        .then((models) => {
        return new Map(models.map((model) => {
            const json = model.toJSON();
            return [json._id, json];
        }));
    }), [collection, project]);
    const saveSnapshot = react_1.useCallback((data, name) => {
        collection
            .save(exports.buildSnapshot(data, name), { containerID: project._id })
            .catch((e) => {
            console.error('Error saving snapshot', e);
        });
        if (showNotification) {
            showNotification('snapshot', SnapshotSuccessNotification);
        }
        setState(getInitialState());
    }, [collection, showNotification, project]);
    const requestTakeSnapshot = react_1.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setState(Object.assign(Object.assign({}, state), { status: SaveSnapshotStatus.Submitting }));
            const projectModelMap = yield getEntireProject();
            const blob = yield exporter_1.exportProject(collection.getAttachmentAsBlob, projectModelMap, null, 'manuproj', project);
            const data = yield api.takeSnapshot(project._id, blob);
            if (state.nameSubmitted) {
                saveSnapshot(data, state.textName);
            }
            else {
                setState((state) => (Object.assign(Object.assign({}, state), { status: SaveSnapshotStatus.GotResponse, snapshotData: data })));
            }
        }
        catch (e) {
            setState((state) => (Object.assign(Object.assign({}, state), { status: SaveSnapshotStatus.Error })));
        }
    }), [
        state,
        getEntireProject,
        collection.getAttachmentAsBlob,
        project,
        saveSnapshot,
    ]);
    const handleTextChange = react_1.useCallback((e) => {
        e.preventDefault();
        setState(Object.assign(Object.assign({}, state), { textName: e.target.value }));
    }, [state]);
    const submitName = react_1.useCallback((e) => {
        e.preventDefault();
        if (state.status === SaveSnapshotStatus.GotResponse) {
            saveSnapshot(state.snapshotData, state.textName);
        }
        else {
            setState(Object.assign(Object.assign({}, state), { nameSubmitted: true }));
        }
    }, [saveSnapshot, state]);
    return {
        textValue: state.textName,
        requestTakeSnapshot,
        handleTextChange,
        submitName,
        status: state.status,
    };
};
exports.useSnapshotManager = useSnapshotManager;
//# sourceMappingURL=use-snapshot-manager.js.map