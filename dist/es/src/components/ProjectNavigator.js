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
// eslint-disable-next-line simple-import-sort/sort
const mousetrap_1 = __importDefault(require("mousetrap"));
require("mousetrap/plugins/global-bind/mousetrap-global-bind");
const react_1 = __importDefault(require("react"));
const react_router_1 = require("react-router");
class ProjectNavigator extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        const { match, history } = this.props;
        const { projectID } = match.params;
        this.keymap = {
            'alt+mod+3': () => history.push(`/projects/${projectID}`),
            'alt+mod+4': () => history.push(`/projects/${projectID}/library`),
            'alt+mod+5': () => history.push(`/projects/${projectID}/collaborators`),
        };
    }
    componentDidMount() {
        Object.entries(this.keymap).forEach(([combo, handler]) => {
            mousetrap_1.default.bind(combo, handler);
        });
    }
    componentWillUnmount() {
        mousetrap_1.default.unbind(Object.keys(this.keymap));
    }
    render() {
        return null;
    }
}
exports.default = react_router_1.withRouter(ProjectNavigator);
//# sourceMappingURL=ProjectNavigator.js.map