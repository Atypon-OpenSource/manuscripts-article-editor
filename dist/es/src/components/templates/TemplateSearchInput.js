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
exports.TemplateSearchInput = exports.SearchContainer = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Search_1 = __importDefault(require("../Search"));
exports.SearchContainer = styled_components_1.default.div `
  margin: 0 30px 20px 10px;
`;
class TemplateSearchInput extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            searching: false,
        };
    }
    render() {
        return (react_1.default.createElement(exports.SearchContainer, null,
            react_1.default.createElement(Search_1.default, { autoFocus: true, handleSearchChange: (event) => this.props.handleChange(event.currentTarget.value), placeholder: 'Search', type: 'search', value: this.props.value })));
    }
}
exports.TemplateSearchInput = TemplateSearchInput;
//# sourceMappingURL=TemplateSearchInput.js.map