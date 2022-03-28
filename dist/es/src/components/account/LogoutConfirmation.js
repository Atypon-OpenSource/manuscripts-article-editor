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
exports.LogoutConfirmation = exports.LogoutConfirmationContext = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const CollectionManager_1 = __importDefault(require("../../sync/CollectionManager"));
const syncEvents_1 = require("../../sync/syncEvents");
const SyncStore_1 = require("../../sync/SyncStore");
const ContactSupportButton_1 = require("../ContactSupportButton");
exports.LogoutConfirmationContext = react_1.default.createContext(() => null);
const headers = {
    checking: 'You may have unsynced changes',
    unsynced: 'You have unsynced changes',
    gaveup: 'Unable to sync your changes',
};
const LogoutConfirmationComponent = ({ children }) => {
    const syncState = SyncStore_1.useSyncState();
    const history = react_router_dom_1.useHistory();
    const [confirmationStage, setConfirmationStage] = react_1.useState('ready');
    const checkAndTryResync = react_1.useCallback((retries = 0) => __awaiter(void 0, void 0, void 0, function* () {
        if (retries > 1) {
            setConfirmationStage('gaveup');
            return;
        }
        const unsyncedCollections = yield CollectionManager_1.default.unsyncedCollections();
        // INSTEAD if (loggedOut)
        if (!unsyncedCollections.length && !syncEvents_1.selectors.oneZombie(syncState)) {
            history.push('/logout');
            return;
        }
        setConfirmationStage('unsynced');
        yield CollectionManager_1.default.cleanupAndDestroyAll();
        return checkAndTryResync(retries + 1);
    }), [history, syncState]);
    const handleLogout = react_1.useCallback((event) => {
        event.preventDefault();
        setConfirmationStage('checking');
        checkAndTryResync().catch(() => setConfirmationStage('gaveup'));
    }, [checkAndTryResync]);
    const message = (() => {
        switch (confirmationStage) {
            case 'gaveup':
                return (react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "If you sign out, your changes will be lost."),
                    react_1.default.createElement(ContactSupportButton_1.ContactSupportButton, null, "Chat with support."),
                    react_1.default.createElement(react_router_dom_1.Link, { to: "/diagnostics" }, "View diagnostics")));
            case 'unsynced':
                return 'Attempting to sync…';
            case 'checking':
                return 'Cleaning up…';
        }
        return '';
    })();
    return (react_1.default.createElement(exports.LogoutConfirmationContext.Provider, { value: handleLogout },
        confirmationStage !== 'ready' && (react_1.default.createElement(style_guide_1.Dialog, { isOpen: true, message: message, actions: {
                primary: {
                    action: () => history.push('/logout'),
                    title: 'Sign out now',
                },
                secondary: {
                    action: () => setConfirmationStage('ready'),
                    title: 'Cancel',
                },
            }, category: style_guide_1.Category.error, header: headers[confirmationStage] })),
        children));
};
exports.LogoutConfirmation = LogoutConfirmationComponent;
//# sourceMappingURL=LogoutConfirmation.js.map