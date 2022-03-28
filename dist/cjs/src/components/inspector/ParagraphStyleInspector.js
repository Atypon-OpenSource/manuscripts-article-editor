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
exports.ParagraphStyleInspector = exports.hasParagraphStyle = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const lodash_es_1 = require("lodash-es");
const react_1 = __importStar(require("react"));
const colors_1 = require("../../lib/colors");
const styles_1 = require("../../lib/styles");
const ParagraphStyles_1 = require("./ParagraphStyles");
const objectsWithParagraphStyle = [
    manuscripts_json_schema_1.ObjectTypes.BibliographyElement,
    manuscripts_json_schema_1.ObjectTypes.ParagraphElement,
    manuscripts_json_schema_1.ObjectTypes.KeywordsElement,
    manuscripts_json_schema_1.ObjectTypes.ListElement,
    manuscripts_json_schema_1.ObjectTypes.TableElement,
    manuscripts_json_schema_1.ObjectTypes.TOCElement,
];
const hasParagraphStyle = (element) => objectsWithParagraphStyle.includes(element.objectType);
exports.hasParagraphStyle = hasParagraphStyle;
const ParagraphStyleInspector = ({ deleteModel, element, manuscript, modelMap, saveModel, view }) => {
    const [error, setError] = react_1.useState();
    const [paragraphStyle, setParagraphStyle] = react_1.useState();
    const getModel = (id) => id ? modelMap.get(id) : undefined;
    const findDefaultParagraphStyle = () => {
        const pageLayout = getModel(manuscript.pageLayout || manuscript_transform_1.DEFAULT_PAGE_LAYOUT);
        if (pageLayout) {
            return getModel(pageLayout.defaultParagraphStyle);
        }
    };
    const defaultParagraphStyle = findDefaultParagraphStyle();
    const elementParagraphStyle = element.paragraphStyle
        ? getModel(element.paragraphStyle)
        : defaultParagraphStyle;
    react_1.useEffect(() => {
        setParagraphStyle(elementParagraphStyle);
    }, [
        setParagraphStyle,
        elementParagraphStyle,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(elementParagraphStyle),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSaveParagraphStyle = react_1.useCallback(lodash_es_1.debounce((paragraphStyle) => {
        saveModel(paragraphStyle).catch((error) => {
            setError(error);
        });
    }, 500), [saveModel]);
    const setElementParagraphStyle = react_1.useCallback((paragraphStyle) => {
        const { tr, doc } = view.state;
        // TODO: iterator with node + pos
        doc.descendants((node, pos) => {
            if (node.attrs.id === element._id) {
                tr.setNodeMarkup(pos, undefined, Object.assign(Object.assign({}, node.attrs), { paragraphStyle }));
                view.dispatch(tr);
            }
        });
    }, [element, view]);
    const removeParagraphStyleAttr = react_1.useCallback((paragraphStyle) => {
        const { tr, doc } = view.state;
        const nodesToUpdate = [];
        doc.descendants((node, pos) => {
            if (node.attrs.paragraphStyle === paragraphStyle) {
                nodesToUpdate.push({ node, pos });
            }
        });
        if (nodesToUpdate.length) {
            for (const { node, pos } of nodesToUpdate) {
                tr.setNodeMarkup(pos, undefined, Object.assign(Object.assign({}, node.attrs), { paragraphStyle: undefined }));
            }
            view.dispatch(tr);
        }
    }, [view]);
    const saveDebouncedParagraphStyle = (paragraphStyle) => {
        setParagraphStyle(paragraphStyle);
        debouncedSaveParagraphStyle(paragraphStyle);
    };
    const saveParagraphStyle = react_1.useCallback((paragraphStyle) => {
        setParagraphStyle(paragraphStyle);
        saveModel(paragraphStyle).catch((error) => {
            // TODO: restore previous paragraphStyle?
            setError(error);
        });
    }, [saveModel]);
    const duplicateParagraphStyle = react_1.useCallback(() => {
        if (!paragraphStyle) {
            throw new Error('No paragraph style!');
        }
        const newStyle = manuscript_transform_1.fromPrototype(paragraphStyle);
        const defaultTitle = `${paragraphStyle.title} (Copy)`;
        const title = window.prompt('New paragraph style name:', defaultTitle);
        saveModel(Object.assign(Object.assign({}, newStyle), { title: title || defaultTitle }))
            .then((paragraphStyle) => {
            setElementParagraphStyle(paragraphStyle._id);
        })
            .catch((error) => {
            setError(error);
        });
    }, [paragraphStyle, saveModel, setElementParagraphStyle]);
    const renameParagraphStyle = react_1.useCallback(() => {
        if (!paragraphStyle) {
            throw new Error('No paragraph style!');
        }
        const title = window.prompt('New paragraph style name:', paragraphStyle.title);
        if (title && title !== paragraphStyle.title) {
            saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { title }));
        }
    }, [paragraphStyle, saveParagraphStyle]);
    const deleteParagraphStyle = react_1.useCallback(() => {
        if (!paragraphStyle) {
            throw new Error('No paragraph style!');
        }
        if (confirm(`Delete "${paragraphStyle.title}"?`)) {
            removeParagraphStyleAttr(paragraphStyle._id);
            // TODO: delay removal? only use styles referenced by elements?
            deleteModel(paragraphStyle._id).catch((error) => {
                setError(error);
            });
        }
    }, [deleteModel, paragraphStyle, removeParagraphStyleAttr]);
    // TODO: what should happen if there's no defaultParagraphStyle?
    if (!paragraphStyle || !defaultParagraphStyle) {
        return null;
    }
    const { colors, colorScheme } = colors_1.buildColors(modelMap);
    const bodyTextParagraphStyles = styles_1.findBodyTextParagraphStyles(modelMap);
    return (react_1.default.createElement(ParagraphStyles_1.ParagraphStyles, { bodyTextParagraphStyles: bodyTextParagraphStyles, colors: colors, colorScheme: colorScheme, defaultParagraphStyle: defaultParagraphStyle, deleteParagraphStyle: deleteParagraphStyle, duplicateParagraphStyle: duplicateParagraphStyle, error: error, paragraphStyle: paragraphStyle, renameParagraphStyle: renameParagraphStyle, saveDebouncedParagraphStyle: saveDebouncedParagraphStyle, saveModel: saveModel, saveParagraphStyle: saveParagraphStyle, setElementParagraphStyle: setElementParagraphStyle, setError: setError }));
};
exports.ParagraphStyleInspector = ParagraphStyleInspector;
//# sourceMappingURL=ParagraphStyleInspector.js.map