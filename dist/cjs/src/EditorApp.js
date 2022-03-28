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
const react_1 = __importStar(require("react"));
const react_hot_loader_1 = require("react-hot-loader");
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const Loading_1 = require("./components/Loading");
const NotificationProvider_1 = require("./components/NotificationProvider");
const ManuscriptPageContainerLW_1 = __importDefault(require("./components/projects/lean-workflow/ManuscriptPageContainerLW"));
const CouchSource_1 = __importDefault(require("./couch-data/CouchSource"));
const user_1 = require("./lib/user");
const store_1 = require("./store");
const Wrapper = styled_components_1.default.div `
  display: flex;
  box-sizing: border-box;
  color: rgb(53, 53, 53);
  width: 100%;
  overflow: hidden;
  font-family: Lato, sans-serif;
`;
const EditorApp = ({ submissionId, manuscriptID, projectID, }) => {
    const userID = user_1.getCurrentUserId();
    const [store, setStore] = react_1.useState();
    react_1.useEffect(() => {
        // implement remount for the store if component is retriggered
        if (store) {
            store.unmount();
        }
        const basicSource = new store_1.BasicSource(submissionId, projectID, manuscriptID, userID || '');
        const couchSource = new CouchSource_1.default();
        store_1.createStore([basicSource, couchSource])
            .then((store) => {
            setStore(store);
        })
            .catch((e) => {
            console.log(e);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submissionId, manuscriptID, projectID]);
    return store ? (react_1.default.createElement(store_1.GenericStoreProvider, { store: store },
        react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
            react_1.default.createElement(NotificationProvider_1.NotificationProvider, null,
                react_1.default.createElement(Wrapper, null,
                    react_1.default.createElement(ManuscriptPageContainerLW_1.default, null)))))) : (react_1.default.createElement(Loading_1.Loading, null, "Loading store..."));
};
exports.default = react_hot_loader_1.hot(module)(EditorApp);
//# sourceMappingURL=EditorApp.js.map