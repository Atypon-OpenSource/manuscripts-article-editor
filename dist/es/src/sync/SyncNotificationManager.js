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
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const CopyableText_1 = require("../components/CopyableText");
const config_1 = __importDefault(require("../config"));
const use_crisp_1 = require("../hooks/use-crisp");
const use_online_state_1 = __importStar(require("../hooks/use-online-state"));
const authorization_1 = require("../lib/authorization");
const store_1 = require("../store");
const CollectionManager_1 = __importDefault(require("./CollectionManager"));
const syncErrors_1 = require("./syncErrors");
const syncEvents_1 = require("./syncEvents");
const SyncNotification_1 = __importDefault(require("./SyncNotification"));
const SyncNotificationManager = () => {
    const [onlineState, setOfflineAcknowledged] = use_online_state_1.default();
    const [askForPersistentStorage, setAskForPersistentStorage] = react_1.useState(false);
    const [{ syncState, dispatchSyncState }] = store_1.useStore((store) => ({
        syncState: store.syncState,
        dispatchSyncState: store.dispatchSyncState,
    }));
    const errors = syncEvents_1.selectors.newErrors(syncState || []);
    const handleRetry = react_1.useCallback(() => {
        CollectionManager_1.default.restartAll();
    }, []);
    const crisp = use_crisp_1.useCrisp();
    const composeErrorReport = react_1.useCallback(() => {
        if (!syncState) {
            return;
        }
        const report = JSON.stringify({
            version: config_1.default.version,
            events: syncEvents_1.selectors.errorReport(syncState),
        }, null, 1);
        console.log(`Logging sync failure: ${report}`);
        crisp.sendDiagnostics('I am getting the following sync error:', report);
        return report;
    }, [syncState, crisp]);
    const handleOfflineAcknowledged = react_1.useCallback(() => {
        setOfflineAcknowledged();
        if (navigator.storage && navigator.storage.persisted) {
            navigator.storage
                .persisted()
                .then((granted) => {
                // eslint-disable-next-line promise/always-return
                if (!granted) {
                    setAskForPersistentStorage(true);
                }
            })
                .catch((error) => {
                console.error(error);
            });
        }
    }, [setOfflineAcknowledged]);
    const handlePersistentStorage = react_1.useCallback(() => {
        if (navigator.storage && navigator.storage.persist) {
            navigator.storage.persist().catch((error) => {
                console.error(error);
            });
        }
        setAskForPersistentStorage(false);
    }, []);
    const handlePersistentStorageDismissed = react_1.useCallback(() => {
        setAskForPersistentStorage(false);
    }, []);
    // render:
    if (onlineState === use_online_state_1.OnlineState.Offline) {
        return (react_1.default.createElement(SyncNotification_1.default, { title: "Seems like your network connection just dropped.", info: "Not to worry, you can still keep working on your documents.", buttonText: "Got it", buttonAction: handleOfflineAcknowledged }));
    }
    if (errors.find(syncErrors_1.isUnauthorized)) {
        return (react_1.default.createElement(SyncNotification_1.default, { title: "Please sign in again to sync your changes", buttonText: "Sign in", buttonAction: authorization_1.loginAgain }));
    }
    if (askForPersistentStorage) {
        return (react_1.default.createElement(SyncNotification_1.default, { title: "Allow persistent storage", info: "Prevent your system from clearing Manuscripts data when disk space runs low", buttonText: "Dismiss", buttonAction: handlePersistentStorageDismissed, primaryButtonText: "Allow", primaryButtonAction: handlePersistentStorage }));
    }
    if (onlineState === use_online_state_1.OnlineState.Acknowledged) {
        return null;
    }
    if (errors.find(syncErrors_1.isSyncTimeoutError)) {
        return (react_1.default.createElement(SyncNotification_1.default, { title: "Unable to connect to sync server", buttonText: "Retry", buttonAction: handleRetry }));
    }
    if (errors.find(syncErrors_1.isPullSyncError)) {
        return (react_1.default.createElement(SyncNotification_1.default, { title: "Unable to pull the latest changes", buttonText: "Retry", buttonAction: handleRetry }));
    }
    const pushSyncError = errors.find(syncErrors_1.isPushSyncError);
    if (pushSyncError) {
        return (react_1.default.createElement(SyncNotification_1.default, { title: syncErrors_1.getPushSyncErrorMessage(pushSyncError), info: [
                react_1.default.createElement(CopyableText_1.CopyableText, { handleCopy: composeErrorReport, key: 0 }, "Copy diagnostics to support"),
                react_1.default.createElement(react_router_dom_1.Link, { to: "/diagnostics", key: 1 }, "View Diagnostics"),
            ], buttonText: "Contact Support", buttonAction: crisp.open, primaryButtonText: "Retry", primaryButtonAction: handleRetry }));
    }
    const writeError = errors.find(syncErrors_1.isWriteError);
    if (writeError) {
        return (react_1.default.createElement(SyncNotification_1.default, { title: "Error while saving your document", info: [
                react_1.default.createElement(CopyableText_1.CopyableText, { handleCopy: composeErrorReport, key: 0 }, "Copy diagnostics to support"),
                react_1.default.createElement(react_router_dom_1.Link, { to: "/diagnostics", key: 1 }, "View Diagnostics"),
            ], buttonText: "Contact Support", buttonAction: crisp.open, primaryButtonText: "Dismiss", primaryButtonAction: () => dispatchSyncState(syncEvents_1.actions.resetErrors()) }));
    }
    return null;
};
exports.default = SyncNotificationManager;
//# sourceMappingURL=SyncNotificationManager.js.map