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
exports.TestComponent = void 0;
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const LoginPageContainer_1 = __importDefault(require("./components/account/LoginPageContainer"));
const Frontmatter_1 = require("./components/Frontmatter");
const config_1 = __importDefault(require("./config"));
const store_1 = require("./store");
const DeveloperPageContainer = react_1.default.lazy(() => Promise.resolve().then(() => __importStar(require(
/* webpackChunkName:"developer-page" */ './components/DeveloperPageContainer'))));
const DiagnosticsPageContainer = react_1.default.lazy(() => Promise.resolve().then(() => __importStar(require(
/* webpackChunkName:"diagnostics-page" */ './components/diagnostics/DiagnosticsPageContainer'))));
const NotFoundPage = react_1.default.lazy(() => Promise.resolve().then(() => __importStar(require(/* webpackChunkName:"not-found-page" */ './components/NotFoundPage'))));
const TestComponent = () => {
    react_1.useEffect(() => {
        console.log('TEST COMPONENT MOUNTED');
    }, []);
    const [state] = store_1.useStore();
    console.log('======================== STATE: ========================');
    console.log(state);
    return react_1.default.createElement("h1", null, "Testing...");
};
exports.TestComponent = TestComponent;
const OnlyEditor = () => {
    const [state] = store_1.useStore((store) => store);
    const { user, userID } = state;
    return userID ? (react_1.default.createElement(react_router_dom_1.Switch, null,
        react_1.default.createElement(react_router_dom_1.Route, { path: '/', exact: true, render: () => user ? (react_1.default.createElement(react_router_dom_1.Redirect, { to: '/projects' })) : config_1.default.connect.enabled ? (react_1.default.createElement(react_router_dom_1.Redirect, { to: {
                    pathname: `/login`,
                    state: {
                        errorMessage: 'missing-user-profile',
                    },
                } })) : (react_1.default.createElement(react_router_dom_1.Redirect, { to: {
                    pathname: `/signup`,
                    state: {
                        errorMessage: 'missing-user-profile',
                    },
                } })) }),
        react_1.default.createElement(react_router_dom_1.Route, { path: '/login', exact: true, render: (props) => user ? (react_1.default.createElement(react_router_dom_1.Redirect, { to: '/projects' })) : (react_1.default.createElement(Frontmatter_1.Frontmatter, null,
                react_1.default.createElement(LoginPageContainer_1.default, Object.assign({}, props)))) }),
        react_1.default.createElement(react_router_dom_1.Route, { path: '/developer', exact: true, component: DeveloperPageContainer }),
        react_1.default.createElement(react_router_dom_1.Route, { path: '/diagnostics', exact: true, component: DiagnosticsPageContainer }),
        react_1.default.createElement(react_router_dom_1.Route, { component: NotFoundPage }))) : (react_1.default.createElement(react_router_dom_1.Switch, null,
        react_1.default.createElement(react_router_dom_1.Route, { path: '/login', exact: true, render: (props) => react_1.default.createElement(LoginPageContainer_1.default, Object.assign({}, props)) }),
        react_1.default.createElement(react_router_dom_1.Route, { path: '/developer', exact: true, component: DeveloperPageContainer }),
        react_1.default.createElement(react_router_dom_1.Route, { component: NotFoundPage })));
};
exports.default = OnlyEditor;
//# sourceMappingURL=OnlyEditor.js.map