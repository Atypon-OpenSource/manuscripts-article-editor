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
exports.FigureStyleInspector = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const lodash_es_1 = require("lodash-es");
const react_1 = __importStar(require("react"));
const colors_1 = require("../../lib/colors");
const node_attrs_1 = require("../../lib/node-attrs");
const styles_1 = require("../../lib/styles");
const FigureStyles_1 = require("./FigureStyles");
const DEFAULT_FIGURE_STYLE = 'MPFigureStyle:default';
const FigureStyleInspector = ({ deleteModel, element, modelMap, saveModel, view }) => {
    const [error, setError] = react_1.useState();
    const [figureStyle, setFigureStyle] = react_1.useState();
    const getModel = (id) => id ? modelMap.get(id) : undefined;
    const getModelByPrototype = (id) => {
        for (const model of modelMap.values()) {
            if (model.prototype === id) {
                return model;
            }
        }
    };
    const defaultFigureStyle = getModelByPrototype(DEFAULT_FIGURE_STYLE);
    const elementFigureStyle = element.figureStyle
        ? getModel(element.figureStyle)
        : defaultFigureStyle;
    react_1.useEffect(() => {
        setFigureStyle(elementFigureStyle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setFigureStyle, elementFigureStyle, JSON.stringify(elementFigureStyle)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSaveFigureStyle = react_1.useCallback(lodash_es_1.debounce((figureStyle) => {
        saveModel(figureStyle).catch((error) => {
            setError(error);
        });
    }, 500), [saveModel]);
    const setElementFigureStyle = react_1.useCallback((figureStyle) => {
        node_attrs_1.setNodeAttrs(view.state, view.dispatch, element._id, { figureStyle });
    }, [element, view]);
    const removeFigureStyleAttr = react_1.useCallback((figureStyle) => {
        const { tr, doc } = view.state;
        const nodesToUpdate = [];
        doc.descendants((node, pos) => {
            if (node.attrs.figureStyle === figureStyle) {
                nodesToUpdate.push({ node, pos });
            }
        });
        if (nodesToUpdate.length) {
            for (const { node, pos } of nodesToUpdate) {
                tr.setNodeMarkup(pos, undefined, Object.assign(Object.assign({}, node.attrs), { figureStyle: undefined }));
            }
            view.dispatch(tr);
        }
    }, [view]);
    const saveDebouncedFigureStyle = (figureStyle) => {
        setFigureStyle(figureStyle);
        debouncedSaveFigureStyle(figureStyle);
    };
    const saveFigureStyle = react_1.useCallback((figureStyle) => {
        setFigureStyle(figureStyle);
        saveModel(figureStyle).catch((error) => {
            // TODO: restore previous figureStyle?
            setError(error);
        });
    }, [saveModel]);
    const duplicateFigureStyle = react_1.useCallback(() => {
        if (!figureStyle) {
            throw new Error('No figure style!');
        }
        const newStyle = manuscript_transform_1.fromPrototype(figureStyle);
        const defaultTitle = `${figureStyle.title} (Copy)`;
        const title = window.prompt('New figure style name:', defaultTitle);
        saveModel(Object.assign(Object.assign({}, newStyle), { title: title || defaultTitle }))
            .then((figureStyle) => {
            setElementFigureStyle(figureStyle._id);
        })
            .catch((error) => {
            setError(error);
        });
    }, [figureStyle, saveModel, setElementFigureStyle]);
    const renameFigureStyle = react_1.useCallback(() => {
        if (!figureStyle) {
            throw new Error('No figure style!');
        }
        const title = window.prompt('New figure style name:', figureStyle.title);
        if (title && title !== figureStyle.title) {
            saveFigureStyle(Object.assign(Object.assign({}, figureStyle), { title }));
        }
    }, [figureStyle, saveFigureStyle]);
    const deleteFigureStyle = react_1.useCallback(() => {
        if (!figureStyle) {
            throw new Error('No figure style!');
        }
        if (confirm(`Delete "${figureStyle.title}"?`)) {
            removeFigureStyleAttr(figureStyle._id);
            // TODO: delay removal? only use styles referenced by elements?
            deleteModel(figureStyle._id).catch((error) => {
                setError(error);
            });
        }
    }, [deleteModel, figureStyle, removeFigureStyleAttr]);
    // TODO: what should happen if there's no defaultFigureStyle?
    if (!figureStyle || !defaultFigureStyle) {
        return null;
    }
    const { colors, colorScheme } = colors_1.buildColors(modelMap);
    if (!colorScheme) {
        return null;
    }
    const figureStyles = styles_1.findFigureStyles(modelMap);
    const borderStyles = styles_1.findBorderStyles(modelMap);
    return (react_1.default.createElement(FigureStyles_1.FigureStyles, { borderStyles: borderStyles, figureStyles: figureStyles, colors: colors, colorScheme: colorScheme, defaultFigureStyle: defaultFigureStyle, deleteFigureStyle: deleteFigureStyle, duplicateFigureStyle: duplicateFigureStyle, error: error, figureStyle: figureStyle, renameFigureStyle: renameFigureStyle, saveDebouncedFigureStyle: saveDebouncedFigureStyle, saveModel: saveModel, saveFigureStyle: saveFigureStyle, setElementFigureStyle: setElementFigureStyle, setError: setError }));
};
exports.FigureStyleInspector = FigureStyleInspector;
//# sourceMappingURL=FigureStyleInspector.js.map