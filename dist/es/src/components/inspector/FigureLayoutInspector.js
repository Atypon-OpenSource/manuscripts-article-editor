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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FigureLayoutInspector = void 0;
const react_1 = __importStar(require("react"));
const node_attrs_1 = require("../../lib/node-attrs");
const styles_1 = require("../../lib/styles");
const FigureLayouts_1 = require("./FigureLayouts");
const DEFAULT_FIGURE_LAYOUT = 'MPFigureLayout:default';
const FigureLayoutInspector = ({ element, modelMap, view }) => {
    const [figureLayout, setFigureLayout] = react_1.useState();
    const getModel = react_1.useCallback((id) => id ? modelMap.get(id) : undefined, [modelMap]);
    const getModelByPrototype = (id) => {
        for (const model of modelMap.values()) {
            if (model.prototype === id) {
                return model;
            }
        }
    };
    const defaultFigureLayout = getModelByPrototype(DEFAULT_FIGURE_LAYOUT);
    const elementFigureLayout = element.figureLayout
        ? getModel(element.figureLayout)
        : defaultFigureLayout;
    react_1.useEffect(() => {
        setFigureLayout(elementFigureLayout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementFigureLayout, JSON.stringify(elementFigureLayout)]);
    const setElementFigureLayout = react_1.useCallback((figureLayoutID) => {
        const { tr, doc } = view.state;
        // TODO: iterator with node + pos
        doc.descendants((node, pos) => {
            if (node.attrs.id === element._id) {
                tr.setNodeMarkup(pos, undefined, Object.assign(Object.assign({}, node.attrs), { figureLayout: figureLayoutID }));
                const figureType = node.type.schema.nodes.figure;
                const figures = [];
                node.forEach((child) => {
                    if (child.type === figureType) {
                        figures.push(child); // TODO: placeholders?
                    }
                });
                const figuresSize = figures.reduce((output, figure) => output + figure.nodeSize, 0);
                const nextFigurePos = pos + 1 + figuresSize;
                const figureLayout = getModel(figureLayoutID);
                if (figureLayout) {
                    const figuresWanted = figureLayout.columns * figureLayout.rows;
                    if (figuresWanted > figures.length) {
                        const figuresToInsert = [];
                        for (let i = figures.length; i < figuresWanted; i++) {
                            figuresToInsert.push(figureType.createAndFill());
                        }
                        tr.insert(nextFigurePos, figuresToInsert);
                    }
                    else if (figures.length > figuresWanted) {
                        const keep = figures
                            .slice(0, figuresWanted)
                            .reduce((output, figure) => output + figure.nodeSize, 0);
                        tr.delete(pos + 1 + keep, pos + node.nodeSize - 1);
                    }
                }
                view.dispatch(tr);
            }
        });
    }, [element, getModel, view]);
    const setElementSizeFraction = react_1.useCallback((sizeFraction) => {
        node_attrs_1.setNodeAttrs(view.state, view.dispatch, element._id, { sizeFraction });
    }, [element, view]);
    const setElementAlignment = react_1.useCallback((alignment) => {
        const { tr, doc } = view.state;
        doc.descendants((node, pos) => {
            if (node.attrs.id === element._id) {
                tr.setNodeMarkup(pos, undefined, Object.assign(Object.assign({}, node.attrs), { alignment }));
                view.dispatch(tr);
            }
        });
    }, [element, view]);
    if (!figureLayout) {
        return null;
    }
    const figureLayouts = styles_1.findFigureLayouts(modelMap);
    return (react_1.default.createElement(FigureLayouts_1.FigureLayouts, { figureElement: element, figureLayouts: figureLayouts, figureLayout: figureLayout, setElementFigureLayout: setElementFigureLayout, setElementAlignment: setElementAlignment, setElementSizeFraction: setElementSizeFraction }));
};
exports.FigureLayoutInspector = FigureLayoutInspector;
//# sourceMappingURL=FigureLayoutInspector.js.map