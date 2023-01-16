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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManuscriptEditorApp = exports.ExceptionDialog = exports.SaveStatusController = exports.ProjectRole = void 0;
require("./lib/analytics");
require("./lib/fonts");
require("./channels");
const AppIcon_1 = __importDefault(require("@manuscripts/assets/react/AppIcon"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const react_1 = __importStar(require("react"));
const IntlHookableProvider_1 = require("./components/IntlHookableProvider");
const Loading_1 = require("./components/Loading");
const token_1 = __importDefault(require("./lib/token"));
const user_id_1 = __importDefault(require("./lib/user-id"));
const Main_1 = __importDefault(require("./Main"));
const ThemeProvider_1 = require("./theme/ThemeProvider");
var roles_1 = require("./lib/roles");
Object.defineProperty(exports, "ProjectRole", { enumerable: true, get: function () { return roles_1.ProjectRole; } });
__exportStar(require("./store/ParentObserver"), exports);
var SaveStatusController_1 = require("./components/projects/lean-workflow/SaveStatusController");
Object.defineProperty(exports, "SaveStatusController", { enumerable: true, get: function () { return SaveStatusController_1.SaveStatusController; } });
var ExceptionDialog_1 = require("./components/projects/lean-workflow/ExceptionDialog");
Object.defineProperty(exports, "ExceptionDialog", { enumerable: true, get: function () { return ExceptionDialog_1.ExceptionDialog; } });
const ManuscriptEditor = ({ fileManagement, parentObserver, submissionId, manuscriptID, projectID, submission, person, authToken, }) => {
    react_1.useEffect(() => {
        if (authToken) {
            token_1.default.remove();
            token_1.default.set(authToken); // @TODO actually relogin whe the token changes
            const { userId } = jwt_decode_1.default(authToken);
            if (!userId) {
                throw new Error('Invalid token');
            }
            user_id_1.default.set(userId);
        }
        return () => {
            token_1.default.remove();
            user_id_1.default.remove();
        };
    }, [authToken]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(IntlHookableProvider_1.IntlProvider, null,
            react_1.default.createElement(ThemeProvider_1.ThemeProvider, null,
                react_1.default.createElement(react_1.default.Suspense, { fallback: react_1.default.createElement(Loading_1.LoadingPage, { className: 'loader' },
                        react_1.default.createElement(AppIcon_1.default, null)) },
                    react_1.default.createElement(Main_1.default
                    // userID={userID}
                    , { 
                        // userID={userID}
                        fileManagement: fileManagement, authToken: authToken || '', parentObserver: parentObserver, submissionId: submissionId, manuscriptID: manuscriptID, projectID: projectID, submission: submission, person: person })))),
        react_1.default.createElement("div", { id: "menu" }),
        react_1.default.createElement("div", { id: "notifications" }),
        react_1.default.createElement("div", { id: "size" })));
};
exports.ManuscriptEditorApp = react_1.default.memo(ManuscriptEditor, (prev, next) => {
    // Due to complexity of this component rerendering it idly would be a major inconvenience and a performance problem
    // To update that component from above we introduced the parentObserver that allowes to manipulate the state in a controlled manner
    return prev.manuscriptID == next.manuscriptID; // if props are equal, do not rerender
});
//# sourceMappingURL=index.js.map