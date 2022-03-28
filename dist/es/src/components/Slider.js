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
exports.Slider = void 0;
const ArrowDownBlue_1 = __importDefault(require("@manuscripts/assets/react/ArrowDownBlue"));
const ArrowUpBlue_1 = __importDefault(require("@manuscripts/assets/react/ArrowUpBlue"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const SliderContainer = styled_components_1.default.div `
  position: relative;

  ::before,
  ::after {
    background-color: ${(props) => props.theme.colors.border.secondary};
    content: ' ';
    display: none;
    height: 64px;
    width: 1px;
    position: absolute;
    z-index: 1;
    top: -11px;
  }
  ::before {
    left: -4px;
    ${(props) => props.hasLeft && 'display: block;'}
  }
  ::after {
    right: -4px;
    ${(props) => props.hasRight && 'display: block;'}
  }
`;
const SliderContainerInner = styled_components_1.default.div `
  display: flex;
  flex-wrap: nowrap;
  overflow: auto;
  -ms-overflow-style: none;
  margin: auto;
  width: 100%;

  // visibly hide scrollbars while retaining the functionality, Webkit & Firefox only
  ::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
  scrollbar-width: none;
`;
const SliderButton = styled_components_1.default(style_guide_1.SecondaryIconButton).attrs(() => ({
    size: 20,
})) `
  border: none;
  border-radius: 50%;
  position: absolute;
  top: ${(props) => props.theme.grid.unit * 2}px;

  &:focus,
  &:hover {
    &:not([disabled]) {
      background: ${(props) => props.theme.colors.background.fifth};
    }
  }

  ${(props) => props.left && 'left: -36px;'};
  ${(props) => props.right && 'right: -36px;'};

  svg {
    transform: rotate(90deg);
    circle {
      stroke: ${(props) => props.theme.colors.border.secondary};
    }
  }
`;
class Slider extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            canScrollLeft: false,
            canScrollRight: false,
            hasOverflow: false,
        };
        this.sliderRef = react_1.default.createRef();
        this.checkForOverflow = () => {
            if (this.sliderRef.current) {
                const { scrollWidth, clientWidth } = this.sliderRef.current;
                const hasOverflow = scrollWidth > clientWidth;
                this.setState({ hasOverflow });
            }
        };
        this.checkForScrollPosition = () => {
            if (this.sliderRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = this.sliderRef.current;
                this.setState({
                    canScrollLeft: scrollLeft > 0,
                    canScrollRight: scrollLeft !== scrollWidth - clientWidth,
                });
            }
        };
        this.scrollContainerBy = (distance) => {
            if (this.sliderRef.current) {
                this.sliderRef.current.scrollBy({ left: distance, behavior: 'smooth' });
            }
        };
    }
    componentDidMount() {
        this.checkForOverflow();
        this.checkForScrollPosition();
        if (this.sliderRef.current) {
            this.sliderRef.current.addEventListener('scroll', this.checkForScrollPosition);
        }
    }
    componentWillUnmount() {
        if (this.sliderRef.current) {
            this.sliderRef.current.removeEventListener('scroll', this.checkForScrollPosition);
        }
    }
    render() {
        const { scrollingDistance } = this.props;
        const { canScrollLeft, canScrollRight } = this.state;
        return (react_1.default.createElement(SliderContainer, { hasLeft: canScrollLeft, hasRight: canScrollRight },
            react_1.default.createElement(SliderButton, { "aria-label": 'Scroll left', left: true, type: "button", disabled: !canScrollLeft, onClick: () => {
                    this.scrollContainerBy(scrollingDistance ? -scrollingDistance : -200);
                } },
                react_1.default.createElement(ArrowDownBlue_1.default, null)),
            react_1.default.createElement(SliderContainerInner, { ref: this.sliderRef }, this.props.children),
            react_1.default.createElement(SliderButton, { "aria-label": 'Scroll right', right: true, type: "button", disabled: !canScrollRight, onClick: () => {
                    this.scrollContainerBy(scrollingDistance ? -scrollingDistance : 200);
                } },
                react_1.default.createElement(ArrowUpBlue_1.default, null))));
    }
}
exports.Slider = Slider;
//# sourceMappingURL=Slider.js.map