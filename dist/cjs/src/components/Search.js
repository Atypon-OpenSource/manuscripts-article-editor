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
exports.SearchWrapper = void 0;
const SearchIconNoBG_1 = __importDefault(require("@manuscripts/assets/react/SearchIconNoBG"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const SearchContainer = styled_components_1.default.div `
  align-items: center;
  display: flex;
  flex: 1 0 auto;
  position: relative;
`;
const SearchIconContainer = styled_components_1.default.span `
  display: flex;
  left: ${(props) => props.theme.grid.unit * 4}px;
  position: absolute;
  z-index: 2;

  path {
    fill: ${(props) => props.active
    ? props.theme.colors.brand.medium
    : props.theme.colors.text.primary};
  }
`;
const SearchText = styled_components_1.default(style_guide_1.TextField) `
  -webkit-appearance: textfield;
  padding-left: ${(props) => props.theme.grid.unit * 11}px;
  &:hover,
  &:focus {
    background-color: ${(props) => props.theme.colors.background.fifth};
  }
`;
exports.SearchWrapper = styled_components_1.default.div `
  display: flex;
  align-items: center;
  padding: ${(props) => props.theme.grid.unit * 3}px;
`;
class Search extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isSearchFocused: false,
            isSearchHovered: false,
        };
        this.handleSearchFocus = () => {
            this.setState({
                isSearchFocused: true,
            });
        };
        this.handleSearchBlur = () => {
            this.setState({
                isSearchFocused: false,
            });
        };
        this.onMouseEnter = () => {
            this.setState({ isSearchHovered: true });
        };
        this.onMouseLeave = () => {
            this.setState({ isSearchHovered: false });
        };
    }
    render() {
        const { autoComplete, autoFocus, handleSearchChange, maxLength, placeholder, type, value, } = this.props;
        const { isSearchFocused, isSearchHovered } = this.state;
        return (react_1.default.createElement(SearchContainer, { onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave, onFocus: this.handleSearchFocus, onBlur: this.handleSearchBlur },
            react_1.default.createElement(SearchIconContainer, { active: isSearchHovered || isSearchFocused },
                react_1.default.createElement(SearchIconNoBG_1.default, null)),
            react_1.default.createElement(SearchText, { autoComplete: autoComplete, autoFocus: autoFocus, maxLength: maxLength, onChange: handleSearchChange, placeholder: placeholder, type: type, value: value })));
    }
}
exports.default = Search;
//# sourceMappingURL=Search.js.map