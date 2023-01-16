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
exports.TemplateTopicSelector = void 0;
const ArrowDownBlack_1 = __importDefault(require("@manuscripts/assets/react/ArrowDownBlack"));
const ArrowDownUp_1 = __importDefault(require("@manuscripts/assets/react/ArrowDownUp"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const TemplateTopicsList_1 = require("./TemplateTopicsList");
const TopicSelector = styled_components_1.default.div `
  border-left: 1px solid ${(props) => props.theme.colors.border.secondary};
  flex-shrink: 0;

  button {
    border-radius: 0;
  }

  svg path[stroke] {
    stroke: currentColor;
  }
`;
const TopicsToggleButton = styled_components_1.default(style_guide_1.TertiaryButton) `
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.font.size.normal};
  font-weight: ${(props) => props.theme.font.weight.normal};
  text-transform: none;
`;
const SelectedTopic = styled_components_1.default.div `
  margin-right: ${(props) => props.theme.grid.unit}px;
`;
class TemplateTopicSelector extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isOpen: false,
        };
        this.nodeRef = react_1.default.createRef();
        this.handleClickOutside = (event) => {
            if (this.state.isOpen &&
                this.nodeRef.current &&
                !this.nodeRef.current.contains(event.target)) {
                this.setState({
                    isOpen: false,
                });
            }
        };
    }
    componentDidMount() {
        this.addClickListener();
    }
    componentWillUnmount() {
        this.removeClickListener();
    }
    render() {
        const { isOpen } = this.state;
        const { options, handleChange, value } = this.props;
        return (react_1.default.createElement(TopicSelector, { ref: this.nodeRef },
            react_1.default.createElement(TopicsToggleButton, { onClick: () => this.setState({ isOpen: !isOpen }) },
                react_1.default.createElement(SelectedTopic, null, value ? value.name : 'All Topics'),
                isOpen ? (react_1.default.createElement(ArrowDownUp_1.default, { "data-cy": 'arrow-up' })) : (react_1.default.createElement(ArrowDownBlack_1.default, { "data-cy": 'arrow-down' }))),
            isOpen && (react_1.default.createElement(TemplateTopicsList_1.TemplateTopicsList, { handleChange: (value) => {
                    handleChange(value);
                    this.setState({ isOpen: false });
                }, options: options, value: value }))));
    }
    addClickListener() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    removeClickListener() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
}
exports.TemplateTopicSelector = TemplateTopicSelector;
//# sourceMappingURL=TemplateTopicSelector.js.map