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
exports.ResizerButton = void 0;
const resizer_1 = require("@manuscripts/resizer");
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const layout_1 = __importDefault(require("../lib/layout"));
exports.ResizerButton = styled_components_1.default(style_guide_1.RoundIconButton) `
  position: absolute;
  top: 50%;
  margin: -${(props) => props.theme.grid.unit * 5}px;
  line-height: 1;
`;
class Panel extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            originalSize: null,
            size: null,
            collapsed: false,
            hidden: false,
        };
        this.buildStyle = (direction, size) => {
            return {
                position: 'relative',
                width: direction === 'row' ? size : '100%',
                height: direction === 'row' ? '100%' : size,
            };
        };
        this.handleHideWhenChange = (event) => {
            this.setState({ hidden: event.matches });
            this.updateState(layout_1.default.get(this.props.name));
        };
        this.handleResize = (resizeDelta) => {
            const { originalSize } = this.state;
            this.setState({
                size: originalSize + resizeDelta,
            });
        };
        this.handleResizeEnd = (resizeDelta) => {
            const { originalSize } = this.state;
            const { name } = this.props;
            const data = layout_1.default.get(name);
            data.size = resizeDelta < -originalSize ? 0 : originalSize + resizeDelta;
            data.collapsed = data.size === 0;
            layout_1.default.set(name, data);
            this.updateState(data);
        };
        this.handleResizeButton = () => {
            const { name } = this.props;
            const data = layout_1.default.get(name);
            data.collapsed = !data.collapsed;
            layout_1.default.set(name, data);
            this.updateState(data);
        };
    }
    componentDidMount() {
        if (this.props.hideWhen) {
            this.hideWhenQuery = window.matchMedia(`screen and (${this.props.hideWhen})`);
            this.hideWhenQuery.addListener(this.handleHideWhenChange);
            this.setState({
                hidden: this.hideWhenQuery.matches,
            });
        }
        this.updateState(layout_1.default.get(this.props.name));
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.forceOpen !== this.props.forceOpen) {
            this.updateState(layout_1.default.get(this.props.name), nextProps.forceOpen);
        }
    }
    componentWillUnmount() {
        if (this.hideWhenQuery) {
            this.hideWhenQuery.removeListener(this.handleHideWhenChange);
        }
    }
    render() {
        const { children, direction, resizerButton, side } = this.props;
        const { collapsed, hidden, size, originalSize } = this.state;
        if (size === null || originalSize === null) {
            return null;
        }
        const style = this.buildStyle(direction, size);
        const resizer = hidden ? null : (react_1.default.createElement(resizer_1.Resizer, { collapsed: collapsed, direction: direction, side: side, onResize: this.handleResize, onResizeEnd: this.handleResizeEnd, onResizeButton: this.handleResizeButton, buttonInner: resizerButton }));
        return side === 'start' ? (react_1.default.createElement("div", { style: style },
            resizer,
            !collapsed && children)) : (react_1.default.createElement("div", { style: style },
            !collapsed && children,
            resizer));
    }
    updateState(data, forceOpen = false) {
        const { minSize } = this.props;
        const { hidden } = this.state;
        const size = Math.max(minSize || 0, data.size);
        const collapsed = !forceOpen && (data.collapsed || hidden);
        this.setState({
            originalSize: size,
            size: collapsed ? 0 : size,
            collapsed,
        });
    }
}
exports.default = Panel;
//# sourceMappingURL=Panel.js.map