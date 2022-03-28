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
exports.apolloClient = void 0;
const AbsintheSocket = __importStar(require("@absinthe/socket"));
const socket_apollo_link_1 = require("@absinthe/socket-apollo-link");
const apollo_cache_inmemory_1 = require("apollo-cache-inmemory");
const apollo_client_1 = require("apollo-client");
const apollo_link_1 = require("apollo-link");
const apollo_link_context_1 = require("apollo-link-context");
const apollo_link_error_1 = require("apollo-link-error");
const apollo_link_http_1 = require("apollo-link-http");
const apollo_upload_client_1 = require("apollo-upload-client");
const apollo_utilities_1 = require("apollo-utilities");
const phoenix_1 = require("phoenix");
const config_1 = __importDefault(require("../config"));
const token_1 = __importDefault(require("./token"));
// TODO: fetch temporary token from manuscripts-api
const httpLink = new apollo_link_http_1.HttpLink({
    uri: config_1.default.beacon.http,
});
const wsLink = socket_apollo_link_1.createAbsintheSocketLink(AbsintheSocket.create(new phoenix_1.Socket(config_1.default.beacon.ws, {
    params: {
        Authorization: token_1.default.get(),
    },
})));
const authLink = apollo_link_context_1.setContext((_, { headers }) => ({
    headers: Object.assign(Object.assign({}, headers), { Authorization: `Bearer ${token_1.default.get()}` }),
}));
const filesServerLink = apollo_upload_client_1.createUploadLink({
    uri: `${config_1.default.leanWorkflow.url}${config_1.default.leanWorkflow.graphqlEndpoint}`,
    credentials: 'include',
});
const hasSubscription = ({ query }) => {
    const definition = apollo_utilities_1.getMainDefinition(query);
    return (definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription');
};
const beaconOrFiles = (operation) => {
    const context = operation.getContext();
    if (config_1.default.leanWorkflow &&
        config_1.default.leanWorkflow.url &&
        context &&
        context.clientPurpose == 'leanWorkflowManager') {
        return false;
    }
    return true;
};
const errorLink = apollo_link_error_1.onError(({ networkError, operation }) => {
    if (networkError) {
        const { statusCode } = networkError;
        const { clientPurpose } = operation.getContext();
        const redirectUri = window.location.href;
        if (statusCode === 401 && clientPurpose == 'leanWorkflowManager') {
            // Auto login
            window.location.assign(`${config_1.default.leanWorkflow.url}/action/showLogin?redirectUri=${redirectUri}`);
        }
    }
});
exports.apolloClient = new apollo_client_1.ApolloClient({
    cache: new apollo_cache_inmemory_1.InMemoryCache(),
    link: apollo_link_1.from([
        errorLink,
        apollo_link_1.split(hasSubscription, wsLink, apollo_link_1.split(beaconOrFiles, authLink.concat(httpLink), filesServerLink)),
    ]),
});
//# sourceMappingURL=apollo.js.map