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
const react_hooks_1 = require("@apollo/react-hooks");
const react_1 = __importDefault(require("react"));
const react_dnd_1 = require("react-dnd");
const react_dnd_html5_backend_1 = require("react-dnd-html5-backend");
const ServiceWorker_1 = require("./components/ServiceWorker");
const EditorApp_1 = __importDefault(require("./EditorApp"));
const apollo_1 = require("./lib/apollo");
const theme_1 = require("./theme/theme");
// submissionId="13f64873-a9bf-4d88-a44a-2a25f9e49fc3"
// manuscriptID="MPProject:E1895468-4DFE-4F17-9B06-5212ECD29555"
// projectID="MPManuscript:5F6D807F-CECF-45D0-B94C-5CF1361BDF05"
const Main = ({ fileManagement, parentObserver, submissionId, manuscriptID, projectID, authToken, submission, person, }) => (react_1.default.createElement(react_dnd_1.DndProvider, { backend: react_dnd_html5_backend_1.HTML5Backend },
    react_1.default.createElement(theme_1.GlobalStyle, null),
    react_1.default.createElement(ServiceWorker_1.ServiceWorker, null),
    react_1.default.createElement(react_hooks_1.ApolloProvider, { client: apollo_1.apolloClient },
        react_1.default.createElement(EditorApp_1.default, { fileManagement: fileManagement, parentObserver: parentObserver, submissionId: submissionId, manuscriptID: manuscriptID, projectID: projectID, submission: submission, person: person, authToken: authToken }))));
exports.default = Main;
//# sourceMappingURL=Main.js.map