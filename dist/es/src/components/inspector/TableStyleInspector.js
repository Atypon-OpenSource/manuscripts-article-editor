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
exports.TableStyleInspector = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const lodash_es_1 = require("lodash-es");
const react_1 = __importStar(require("react"));
const colors_1 = require("../../lib/colors");
const styles_1 = require("../../lib/styles");
const TableStyles_1 = require("./TableStyles");
const DEFAULT_TABLE_STYLE = 'MPTableStyle:default';
const TableStyleInspector = ({ deleteModel, element, modelMap, saveModel, view }) => {
    const [error, setError] = react_1.useState();
    const [tableStyle, setTableStyle] = react_1.useState();
    const getModel = (id) => id ? modelMap.get(id) : undefined;
    const getModelByPrototype = (id) => {
        for (const model of modelMap.values()) {
            if (model.prototype === id) {
                return model;
            }
        }
    };
    const defaultTableStyle = getModelByPrototype(DEFAULT_TABLE_STYLE);
    const elementTableStyle = element.tableStyle
        ? getModel(element.tableStyle)
        : defaultTableStyle;
    react_1.useEffect(() => {
        setTableStyle(elementTableStyle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setTableStyle, elementTableStyle, JSON.stringify(elementTableStyle)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSaveTableStyle = react_1.useCallback(lodash_es_1.debounce((tableStyle) => {
        saveModel(tableStyle).catch((error) => {
            setError(error);
        });
    }, 500), [saveModel]);
    const setElementTableStyle = react_1.useCallback((tableStyle) => {
        const { tr, doc } = view.state;
        // TODO: iterator with node + pos
        doc.descendants((node, pos) => {
            if (node.attrs.id === element._id) {
                tr.setNodeMarkup(pos, undefined, Object.assign(Object.assign({}, node.attrs), { tableStyle }));
                view.dispatch(tr);
            }
        });
    }, [element, view]);
    const removeTableStyleAttr = react_1.useCallback((tableStyle) => {
        const { tr, doc } = view.state;
        const nodesToUpdate = [];
        doc.descendants((node, pos) => {
            if (node.attrs.tableStyle === tableStyle) {
                nodesToUpdate.push({ node, pos });
            }
        });
        if (nodesToUpdate.length) {
            for (const { node, pos } of nodesToUpdate) {
                tr.setNodeMarkup(pos, undefined, Object.assign(Object.assign({}, node.attrs), { tableStyle: undefined }));
            }
            view.dispatch(tr);
        }
    }, [view]);
    const saveDebouncedTableStyle = (tableStyle) => {
        setTableStyle(tableStyle);
        debouncedSaveTableStyle(tableStyle);
    };
    const saveTableStyle = react_1.useCallback((tableStyle) => {
        setTableStyle(tableStyle);
        saveModel(tableStyle).catch((error) => {
            // TODO: restore previous tableStyle?
            setError(error);
        });
    }, [saveModel]);
    const duplicateTableStyle = react_1.useCallback(() => {
        if (!tableStyle) {
            throw new Error('No table style!');
        }
        const newStyle = manuscript_transform_1.fromPrototype(tableStyle);
        const defaultTitle = `${tableStyle.title} (Copy)`;
        const title = window.prompt('New table style name:', defaultTitle);
        saveModel(Object.assign(Object.assign({}, newStyle), { title: title || defaultTitle }))
            .then((tableStyle) => {
            setElementTableStyle(tableStyle._id);
        })
            .catch((error) => {
            setError(error);
        });
    }, [tableStyle, saveModel, setElementTableStyle]);
    const renameTableStyle = react_1.useCallback(() => {
        if (!tableStyle) {
            throw new Error('No table style!');
        }
        const title = window.prompt('New table style name:', tableStyle.title);
        if (title && title !== tableStyle.title) {
            saveTableStyle(Object.assign(Object.assign({}, tableStyle), { title }));
        }
    }, [tableStyle, saveTableStyle]);
    const deleteTableStyle = react_1.useCallback(() => {
        if (!tableStyle) {
            throw new Error('No table style!');
        }
        if (confirm(`Delete "${tableStyle.title}"?`)) {
            removeTableStyleAttr(tableStyle._id);
            // TODO: delay removal? only use styles referenced by elements?
            deleteModel(tableStyle._id).catch((error) => {
                setError(error);
            });
        }
    }, [tableStyle, removeTableStyleAttr, deleteModel]);
    // TODO: what should happen if there's no defaultTableStyle?
    if (!tableStyle || !defaultTableStyle) {
        return null;
    }
    const { colors, colorScheme } = colors_1.buildColors(modelMap);
    if (!colorScheme) {
        return null;
    }
    const tableStyles = styles_1.findTableStyles(modelMap);
    const borderStyles = styles_1.findBorderStyles(modelMap);
    return (react_1.default.createElement(TableStyles_1.TableStyles, { tableStyles: tableStyles, borderStyles: borderStyles, colors: colors, colorScheme: colorScheme, defaultTableStyle: defaultTableStyle, deleteTableStyle: deleteTableStyle, duplicateTableStyle: duplicateTableStyle, error: error, tableStyle: tableStyle, renameTableStyle: renameTableStyle, saveDebouncedTableStyle: saveDebouncedTableStyle, saveModel: saveModel, saveTableStyle: saveTableStyle, setElementTableStyle: setElementTableStyle, setError: setError }));
};
exports.TableStyleInspector = TableStyleInspector;
//# sourceMappingURL=TableStyleInspector.js.map