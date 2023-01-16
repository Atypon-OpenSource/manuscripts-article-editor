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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitationStyleSelectorModal = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const fuzzysort_1 = __importDefault(require("fuzzysort"));
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const CitationStyleEmpty_1 = require("./CitationStyleEmpty");
const CitationStyleSelectorList_1 = require("./CitationStyleSelectorList");
const TemplateSearchInput_1 = require("./TemplateSearchInput");
const ListContainer = styled_components_1.default.div `
  flex: 1;
  width: 600px;
  max-width: 100%;
`;
const FadingEdge = styled_components_1.default.div `
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
  height: ${(props) => props.theme.grid.unit * 8}px;
  background-image: linear-gradient(
    transparent,
    ${(props) => props.theme.colors.background.primary}
  );
`;
const TemplateSearch = styled_components_1.default.div `
  flex-shrink: 0;
`;
const ModalContainerInner = styled_components_1.default(style_guide_1.ModalMain) `
  display: flex;
  flex-direction: column;
  height: calc(70vh - 24px - 32px);
`;
class CitationStyleSelectorModal extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            filteredItems: [],
            searchText: '',
        };
        this.listRef = react_1.default.createRef();
        this.filterBundles = (searchText) => __awaiter(this, void 0, void 0, function* () {
            const { items } = this.props;
            if (!searchText) {
                return items;
            }
            this.sortPromise = fuzzysort_1.default.goAsync(searchText.trim(), items, {
                keys: ['csl.title'],
                limit: 250,
                allowTypo: false,
                threshold: -10000,
            });
            const results = yield this.sortPromise;
            return results.map((result) => result.obj);
        });
        this.handleSearchChange = (searchText) => __awaiter(this, void 0, void 0, function* () {
            this.setState({ searchText });
            if (this.sortPromise) {
                this.sortPromise.cancel();
            }
            this.setState({
                filteredItems: yield this.filterBundles(searchText),
            });
        });
        this.resetScroll = () => {
            if (this.listRef.current) {
                this.listRef.current.scrollTo(0);
            }
        };
    }
    componentDidMount() {
        this.setState({
            filteredItems: this.props.items,
        });
    }
    render() {
        const { handleComplete, selectBundle } = this.props;
        const { searchText, filteredItems } = this.state;
        this.resetScroll();
        return (react_1.default.createElement(style_guide_1.ModalContainer, null,
            react_1.default.createElement(style_guide_1.ModalHeader, null,
                react_1.default.createElement(style_guide_1.CloseButton, { onClick: () => handleComplete() })),
            react_1.default.createElement(ModalContainerInner, null,
                react_1.default.createElement(TemplateSearch, null,
                    react_1.default.createElement(TemplateSearchInput_1.TemplateSearchInput, { value: searchText, handleChange: this.handleSearchChange })),
                filteredItems.length ? (react_1.default.createElement(ListContainer, null,
                    react_1.default.createElement(CitationStyleSelectorList_1.CitationStyleSelectorList, { listRef: this.listRef, filteredItems: filteredItems, selectBundle: selectBundle }),
                    react_1.default.createElement(FadingEdge, null))) : (react_1.default.createElement(CitationStyleEmpty_1.CitationStyleEmpty, { searchText: this.state.searchText })))));
    }
}
exports.CitationStyleSelectorModal = CitationStyleSelectorModal;
//# sourceMappingURL=CitationStyleSelectorModal.js.map