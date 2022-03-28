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
exports.CitationStyleSelectorList = void 0;
const react_1 = __importDefault(require("react"));
const react_virtualized_auto_sizer_1 = __importDefault(require("react-virtualized-auto-sizer"));
const react_window_1 = require("react-window");
const CitationStyleSelectorItem_1 = require("./CitationStyleSelectorItem");
class CitationStyleSelectorList extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.getItemKey = (index) => this.props.filteredItems[index]._id;
    }
    render() {
        const { filteredItems, listRef, selectBundle } = this.props;
        return (react_1.default.createElement(react_virtualized_auto_sizer_1.default, null, ({ height, width }) => (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(react_window_1.FixedSizeList, { ref: listRef, height: height, width: width, itemCount: filteredItems.length, itemSize: 40, itemKey: this.getItemKey, itemData: {
                    filteredItems,
                    selectBundle,
                } }, CitationStyleSelectorItem_1.CitationStyleSelectorItem)))));
    }
}
exports.CitationStyleSelectorList = CitationStyleSelectorList;
//# sourceMappingURL=CitationStyleSelectorList.js.map