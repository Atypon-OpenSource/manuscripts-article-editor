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
exports.TemplateSelectorModal = void 0;
const fuzzysort_1 = __importDefault(require("fuzzysort"));
const react_1 = __importStar(require("react"));
const react_virtualized_auto_sizer_1 = __importDefault(require("react-virtualized-auto-sizer"));
const styled_components_1 = __importDefault(require("styled-components"));
const Search_1 = __importDefault(require("../Search"));
const TemplateCategorySelector_1 = require("./TemplateCategorySelector");
const TemplateEmpty_1 = require("./TemplateEmpty");
const TemplateModalClose_1 = require("./TemplateModalClose");
const TemplateModalFooter_1 = require("./TemplateModalFooter");
const TemplateModalHeader_1 = require("./TemplateModalHeader");
const TemplateSelectorList_1 = require("./TemplateSelectorList");
const TemplateTopicSelector_1 = require("./TemplateTopicSelector");
const ModalContainer = styled_components_1.default.div `
  background: ${(props) => props.theme.colors.background.primary};
  border-radius: ${(props) => props.theme.grid.radius.default};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  display: flex;
  flex-direction: column;
  font-family: ${(props) => props.theme.font.family.sans};
  margin: ${(props) => props.theme.grid.unit * 3}px;
  overflow: hidden;
  height: 80vh;
  max-height: 900px;
`;
const ModalBody = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 auto;
  max-width: 626px;
  position: relative;
  margin-top: ${(props) => props.theme.grid.unit * 3}px;
`;
const FiltersContainer = styled_components_1.default.div `
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  border-radius: ${(props) => props.theme.grid.radius.small};
  display: flex;
  margin: 0 30px ${(props) => props.theme.grid.unit * 4}px;

  input {
    border: none;
  }

  @media (max-width: 450px) {
    margin-left: ${(props) => props.theme.grid.unit * 4}px;
    margin-right: ${(props) => props.theme.grid.unit * 4}px;
  }
`;
const TemplatesContainer = styled_components_1.default.div `
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  border-radius: ${(props) => props.theme.grid.radius.small};
  list-style: none;
  margin: 0 30px ${(props) => props.theme.grid.unit * 4}px;
  flex-grow: 1;
  overflow: hidden;
  padding: 0;

  @media (max-width: 450px) {
    margin: 0 ${(props) => props.theme.grid.unit * 4}px;
  }
`;
const EmptyTemplateContainer = styled_components_1.default.div `
  margin: 0 30px ${(props) => props.theme.grid.unit * 4}px;
`;
class TemplateSelectorModal extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            creatingManuscript: false,
            selectedCategory: 'MPManuscriptCategory:research-article',
            searchText: '',
        };
        this.listRef = react_1.default.createRef();
        this.handleSearchChange = (event) => {
            const searchText = event.currentTarget.value;
            this.setState({ searchText });
        };
        this.createEmpty = () => __awaiter(this, void 0, void 0, function* () {
            this.setState({ creatingManuscript: true });
            try {
                yield this.props.createEmpty();
            }
            catch (error) {
                console.error(error);
            }
            this.setState({ creatingManuscript: false });
        });
        this.selectTemplate = () => __awaiter(this, void 0, void 0, function* () {
            if (this.state.selectedItem) {
                this.setState({ creatingManuscript: true });
                try {
                    yield this.props.selectTemplate(this.state.selectedItem);
                }
                catch (error) {
                    console.error(error);
                }
                this.setState({ creatingManuscript: false });
            }
        });
        this.setSelectedTemplate = (selectedItem) => {
            this.setState({ selectedItem });
        };
        this.selectedCategoryName = () => {
            const { selectedCategory } = this.state;
            const category = this.props.categories.find((category) => category._id === selectedCategory);
            return category && category.name ? category.name : 'selected';
        };
        this.hasSelectedCategory = (item) => item.category === this.state.selectedCategory;
        this.hasSelectedField = (item) => {
            const { selectedField } = this.state;
            if (!selectedField) {
                return true;
            }
            if (!item.bundle || !item.bundle.csl || !item.bundle.csl.fields) {
                return false;
            }
            for (const field of item.bundle.csl.fields) {
                if (field === selectedField._id) {
                    return true;
                }
            }
        };
        this.resetScroll = () => {
            if (this.listRef.current) {
                this.listRef.current.scrollToItem(0);
            }
        };
        this.resetList = (index = 0) => {
            if (this.listRef.current) {
                this.listRef.current.resetAfterIndex(index, true);
            }
        };
        this.filterTemplates = () => {
            const { items } = this.props;
            const { searchText } = this.state;
            const filteredItems = items.filter((item) => this.hasSelectedCategory(item) && this.hasSelectedField(item));
            if (searchText) {
                const results = fuzzysort_1.default.go(searchText, filteredItems, {
                    keys: ['titleAndType'],
                    limit: 100,
                    allowTypo: false,
                    threshold: -1000,
                });
                return results.map((result) => result.obj);
            }
            return filteredItems;
        };
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedItem === this.state.selectedItem) {
            this.resetScroll();
        }
    }
    render() {
        const { categories, handleComplete, 
        // importManuscript,
        researchFields, switchTemplate, } = this.props;
        const { creatingManuscript, selectedCategory, selectedItem, selectedField, searchText, } = this.state;
        const filteredItems = this.filterTemplates();
        this.resetList();
        return (react_1.default.createElement(ModalBody, null,
            react_1.default.createElement(TemplateModalClose_1.TemplateModalClose, { handleComplete: handleComplete }),
            react_1.default.createElement(ModalContainer, null,
                react_1.default.createElement(TemplateModalHeader_1.TemplateModalHeader, { title: switchTemplate
                        ? 'Update Manuscript Template'
                        : 'Add Manuscript to Project' }),
                react_1.default.createElement(TemplateCategorySelector_1.TemplateCategorySelector, { options: categories, value: selectedCategory, handleChange: (selectedCategory) => this.setState({
                        selectedCategory,
                        searchText: '',
                        selectedItem: undefined,
                    }) }),
                (searchText || filteredItems.length !== 0) && (react_1.default.createElement(FiltersContainer, null,
                    react_1.default.createElement(Search_1.default, { autoComplete: 'off', autoFocus: true, handleSearchChange: this.handleSearchChange, placeholder: 'Search', type: 'search', value: searchText }),
                    react_1.default.createElement(TemplateTopicSelector_1.TemplateTopicSelector, { handleChange: (selectedField) => this.setState({ selectedField }), options: researchFields, value: selectedField }))),
                filteredItems.length ? (react_1.default.createElement(TemplatesContainer, null,
                    react_1.default.createElement(react_virtualized_auto_sizer_1.default, null, ({ height, width }) => (react_1.default.createElement(TemplateSelectorList_1.TemplateSelectorList, { filteredItems: filteredItems, height: height, listRef: this.listRef, resetList: this.resetList, selectItem: this.setSelectedTemplate, width: width }))))) : (react_1.default.createElement(EmptyTemplateContainer, null,
                    react_1.default.createElement(TemplateEmpty_1.TemplateEmpty, { createEmpty: this.createEmpty, searchText: this.state.searchText, selectedCategoryName: this.selectedCategoryName() }))),
                react_1.default.createElement(TemplateModalFooter_1.TemplateModalFooter, { createEmpty: this.createEmpty, 
                    // importManuscript={importManuscript}
                    selectTemplate: this.selectTemplate, selectedTemplate: selectedItem, creatingManuscript: creatingManuscript, noTemplate: filteredItems.length === 0, switchTemplate: switchTemplate }))));
    }
}
exports.TemplateSelectorModal = TemplateSelectorModal;
//# sourceMappingURL=TemplateSelectorModal.js.map