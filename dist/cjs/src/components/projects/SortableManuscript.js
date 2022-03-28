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
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
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
exports.SortableManuscript = void 0;
const react_1 = __importStar(require("react"));
const react_dnd_1 = require("react-dnd");
const styled_components_1 = __importDefault(require("styled-components"));
const SortableManuscript = ({ setIndex, children, item, index }) => {
    const [side, setSide] = react_1.useState();
    const ref = react_1.useRef(null);
    const [{ isDragging }, dragSource] = react_dnd_1.useDrag({
        item: { type: 'manuscript', id: item._id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const [{ isOver }, dropTarget] = react_dnd_1.useDrop({
        accept: 'manuscript',
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
        hover: (item, monitor) => {
            if (ref.current) {
                const offset = monitor.getClientOffset();
                if (offset) {
                    const { bottom, top } = ref.current.getBoundingClientRect();
                    const verticalHover = offset.y - top;
                    const verticalMiddle = (bottom - top) / 2;
                    setSide(verticalHover < verticalMiddle ? 'before' : 'after');
                }
            }
        },
        drop: (item, monitor) => {
            const fraction = side === 'before' ? -0.5 : 0.5;
            setIndex(item.id, index + fraction);
            return undefined;
        },
    });
    dragSource(dropTarget(ref));
    return (react_1.default.createElement("div", { ref: ref },
        react_1.default.createElement(Container, { isDragging: isDragging },
            react_1.default.createElement(BeforeDropPreview, { isOver: isOver, side: side }),
            children,
            react_1.default.createElement(AfterDropPreview, { isOver: isOver, side: side }))));
};
exports.SortableManuscript = SortableManuscript;
const DropPreview = styled_components_1.default.div `
  background: #65a3ff;
  height: 1px;
  z-index: 2;
  width: 100%;
  position: absolute;
`;
const BeforeDropPreview = styled_components_1.default(DropPreview) `
  top: 0;
  visibility: ${(props) => props.isOver && props.side === 'before' ? 'visible' : 'hidden'};
`;
const AfterDropPreview = styled_components_1.default(DropPreview) `
  bottom: -1px;
  visibility: ${(props) => props.isOver && props.side === 'after' ? 'visible' : 'hidden'};
`;
const Container = styled_components_1.default.div `
  opacity: ${(props) => (props.isDragging ? 0.25 : 1)};
  position: relative;
`;
//# sourceMappingURL=SortableManuscript.js.map