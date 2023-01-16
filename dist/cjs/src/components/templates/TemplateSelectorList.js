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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateSelectorList = void 0;
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_window_1 = require("react-window");
const ThemeProvider_1 = require("../../theme/ThemeProvider");
const TemplateListItem_1 = require("./TemplateListItem");
const TemplateSelectorItem_1 = require("./TemplateSelectorItem");
const calculateItemKey = (item) => item.template ? item.template._id : item.bundle._id;
exports.TemplateSelectorList = react_1.default.memo(({ filteredItems, height, listRef, resetList, selectItem, width }) => {
    const [selectedItem, setSelectedItem] = react_1.useState();
    const [selectedItemHeight, setSelectedItemHeight] = react_1.useState();
    const getItemSize = react_1.useCallback((index) => {
        const item = filteredItems[index];
        if (item === selectedItem && selectedItemHeight) {
            return selectedItemHeight;
        }
        return 48;
    }, [filteredItems, selectedItem, selectedItemHeight]);
    const getItemKey = react_1.useCallback((index) => calculateItemKey(filteredItems[index]), [filteredItems]);
    const handleSelectItem = react_1.useCallback((item) => {
        if (item) {
            const container = document.createElement('div');
            container.style.width = width + 'px';
            container.style.visibility = 'hidden';
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            document.body.appendChild(container);
            react_dom_1.default.render(react_1.default.createElement(ThemeProvider_1.ThemeProvider, null,
                react_1.default.createElement(TemplateListItem_1.TemplateListItem, { articleType: item.articleType, item: item, publisher: item.publisher, selectItem: handleSelectItem, template: item.template, title: item.title, selected: true })), container, () => {
                const clientHeight = container.clientHeight;
                document.body.removeChild(container);
                setSelectedItem(item);
                setSelectedItemHeight(clientHeight);
                resetList(0);
                selectItem(item);
            });
        }
        else {
            setSelectedItemHeight(undefined);
            resetList(0);
        }
    }, [width, resetList, selectItem]);
    return (react_1.default.createElement(react_window_1.VariableSizeList, { ref: listRef, height: height, width: width, itemCount: filteredItems.length, itemSize: getItemSize, itemKey: getItemKey, itemData: { filteredItems, selectedItem, selectItem: handleSelectItem } }, TemplateSelectorItem_1.TemplateSelectorItem));
});
//# sourceMappingURL=TemplateSelectorList.js.map