"use strict";
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
exports.PlaceholderInput = exports.SectionInspector = void 0;
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
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const style_guide_1 = require("@manuscripts/style-guide");
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importStar(require("react"));
const react_useinterval_1 = __importDefault(require("react-useinterval"));
const styled_components_1 = __importDefault(require("styled-components"));
const section_categories_1 = require("../../lib/section-categories");
const store_1 = require("../../store");
const Inspector_1 = require("../Inspector");
const InspectorSection_1 = require("../InspectorSection");
const CategoryInput_1 = require("../projects/CategoryInput");
const CountInput_1 = require("../projects/CountInput");
const PageBreakInput_1 = require("../projects/PageBreakInput");
const buildCountRequirement = (objectType, count, ignored, severity = 0) => {
    const item = {
        _id: manuscript_transform_1.generateID(objectType),
        objectType,
        count,
        ignored,
        severity,
    };
    return item;
};
const SectionInspector = ({ dispatchNodeAttrs, section, sectionNode, state, dispatch, getSectionCountRequirements, }) => {
    const [modelMap] = store_1.useStore((store) => store.modelMap);
    const [saveModel] = store_1.useStore((store) => store.saveModel);
    const firstParagraph = react_1.useMemo(() => section_categories_1.findFirstParagraph(section, modelMap), [
        section,
        modelMap,
    ]);
    const [placeholder, setPlaceholder] = react_1.useState(firstParagraph ? firstParagraph.placeholderInnerHTML : undefined);
    const existingCatsCounted = react_1.useMemo(() => {
        const exisitingCats = {};
        for (const model of modelMap) {
            const section = model[1];
            if (section.category &&
                section.category.startsWith('MPSectionCategory:')) {
                exisitingCats[section.category] = exisitingCats[section.category]
                    ? exisitingCats[section.category]++
                    : 1;
            }
            // section.category == 'MPSectionCategory:abstract-graphical'
        }
        return exisitingCats;
    }, [modelMap.size]); // eslint-disable-line react-hooks/exhaustive-deps
    react_useinterval_1.default(() => {
        if (firstParagraph && placeholder !== firstParagraph.placeholderInnerHTML) {
            dispatchNodeAttrs(firstParagraph._id, {
                placeholder,
            });
        }
    }, 500);
    const [titleSuppressed, setTitleSuppressed] = react_1.useState(!!section.titleSuppressed);
    const updateTitleSuppressed = react_1.useCallback((e) => {
        e.preventDefault();
        const nextTitleSuppressed = !e.target.checked;
        setTitleSuppressed(nextTitleSuppressed);
        dispatchNodeAttrs(section._id, { titleSuppressed: nextTitleSuppressed });
    }, [section, dispatchNodeAttrs]);
    const updateGeneratedLabel = react_1.useCallback((e) => {
        e.preventDefault();
        const isGenerated = !e.target.checked;
        // setGeneratedLabel(isGenerated)
        const tr = dispatchNodeAttrs(section._id, {
            generatedLabel: isGenerated,
        }, !isGenerated);
        if (!isGenerated) {
            let existingLabel = null;
            sectionNode === null || sectionNode === void 0 ? void 0 : sectionNode.descendants((node) => {
                if (manuscript_transform_1.isSectionLabelNode(node)) {
                    existingLabel = node;
                }
            });
            if (!existingLabel) {
                manuscript_editor_1.insertSectionLabel(state, dispatch, tr);
            }
            else if (tr) {
                dispatch(tr);
            }
        }
    }, [section, dispatchNodeAttrs, state, dispatch, sectionNode]);
    // requirements
    const getOrBuildRequirement = (objectType, manuscriptID, category, id) => {
        var _a;
        if (id && modelMap.has(id)) {
            return modelMap.get(id);
        }
        // infer requirement from the manuscript prototype
        let count = undefined;
        if (manuscriptID && category) {
            const manuscript = modelMap.get(manuscriptID);
            count = (manuscript === null || manuscript === void 0 ? void 0 : manuscript.prototype)
                ? (_a = getSectionCountRequirements(manuscript === null || manuscript === void 0 ? void 0 : manuscript.prototype)[category]) === null || _a === void 0 ? void 0 : _a.get(objectType)
                : undefined;
        }
        return buildCountRequirement(objectType, count, count ? false : true);
    };
    const requirements = {
        minWordCount: getOrBuildRequirement(manuscripts_json_schema_1.ObjectTypes.MinimumSectionWordCountRequirement, section.manuscriptID, section.category, section.minWordCountRequirement),
        maxWordCount: getOrBuildRequirement(manuscripts_json_schema_1.ObjectTypes.MaximumSectionWordCountRequirement, section.manuscriptID, section.category, section.maxWordCountRequirement),
        minCharCount: getOrBuildRequirement(manuscripts_json_schema_1.ObjectTypes.MinimumSectionCharacterCountRequirement, section.manuscriptID, section.category, section.minCharacterCountRequirement),
        maxCharacterCount: getOrBuildRequirement(manuscripts_json_schema_1.ObjectTypes.MaximumSectionCharacterCountRequirement, section.manuscriptID, section.category, section.maxCharacterCountRequirement),
    };
    const currentSectionCategory = section_categories_1.chooseSectionCategory(section);
    return (react_1.default.createElement(InspectorSection_1.InspectorSection, { title: 'Section' },
        section.title && react_1.default.createElement(StyledTitle, { value: section.title }),
        react_1.default.createElement(Inspector_1.InspectorTabs, null,
            react_1.default.createElement(Inspector_1.InspectorPanelTabList, null,
                react_1.default.createElement(Inspector_1.InspectorTab, null, "General"),
                react_1.default.createElement(Inspector_1.InspectorTab, null, "Requirements")),
            react_1.default.createElement(Inspector_1.InspectorTabPanels, null,
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null,
                    sectionNode && 'titleSuppressed' in sectionNode.attrs && (react_1.default.createElement("div", null,
                        react_1.default.createElement("label", null,
                            react_1.default.createElement("input", { type: 'checkbox', checked: !titleSuppressed, onChange: updateTitleSuppressed }),
                            ' ',
                            "Title is shown"))),
                    sectionNode && 'generatedLabel' in sectionNode.attrs && (react_1.default.createElement("div", null,
                        react_1.default.createElement("label", null,
                            react_1.default.createElement("input", { type: 'checkbox', checked: sectionNode.attrs.generatedLabel === false, onChange: updateGeneratedLabel }),
                            ' ',
                            "Use custom label"))),
                    section_categories_1.isEditableSectionCategoryID(currentSectionCategory) && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(InspectorSection_1.Subheading, null, "Category"),
                        react_1.default.createElement(CategoryInput_1.CategoryInput, { value: currentSectionCategory, existingCatsCounted: existingCatsCounted, handleChange: (category) => {
                                dispatchNodeAttrs(section._id, { category });
                            } }))),
                    react_1.default.createElement(InspectorSection_1.Subheading, null, "Placeholder"),
                    react_1.default.createElement(exports.PlaceholderInput, { value: placeholder, onChange: (event) => {
                            setPlaceholder(event.target.value);
                        } }),
                    react_1.default.createElement(InspectorSection_1.Subheading, null, "Page Break"),
                    react_1.default.createElement(PageBreakInput_1.PageBreakInput, { value: section.pageBreakStyle, handleChange: (pageBreakStyle) => {
                            dispatchNodeAttrs(section._id, { pageBreakStyle });
                        } })),
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null,
                    react_1.default.createElement(CountInput_1.CountInput, { label: 'Min word count', placeholder: 'Minimum', value: requirements.minWordCount, handleChange: (requirement) => __awaiter(void 0, void 0, void 0, function* () {
                            yield saveModel(requirement);
                            if (requirement._id !== section.minWordCountRequirement) {
                                yield saveModel(Object.assign(Object.assign({}, section), { minWordCountRequirement: requirement._id }));
                            }
                        }) }),
                    react_1.default.createElement(CountInput_1.CountInput, { label: 'Max word count', placeholder: 'Maximum', value: requirements.maxWordCount, handleChange: (requirement) => __awaiter(void 0, void 0, void 0, function* () {
                            yield saveModel(requirement);
                            if (requirement._id !== section.maxWordCountRequirement) {
                                yield saveModel(Object.assign(Object.assign({}, section), { maxWordCountRequirement: requirement._id }));
                            }
                        }) }),
                    react_1.default.createElement(CountInput_1.CountInput, { label: 'Min character count', placeholder: 'Minimum', value: requirements.minCharCount, handleChange: (requirement) => __awaiter(void 0, void 0, void 0, function* () {
                            yield saveModel(requirement);
                            if (requirement._id !== section.minCharacterCountRequirement) {
                                yield saveModel(Object.assign(Object.assign({}, section), { minCharacterCountRequirement: requirement._id }));
                            }
                        }) }),
                    react_1.default.createElement(CountInput_1.CountInput, { label: 'Max character count', placeholder: 'Maximum', value: requirements.maxCharacterCount, handleChange: (requirement) => __awaiter(void 0, void 0, void 0, function* () {
                            yield saveModel(requirement);
                            if (requirement._id !== section.maxCharacterCountRequirement) {
                                yield saveModel(Object.assign(Object.assign({}, section), { maxCharacterCountRequirement: requirement._id }));
                            }
                        }) }))))));
};
exports.SectionInspector = SectionInspector;
const StyledTitle = styled_components_1.default(title_editor_1.Title) `
  color: ${(props) => props.theme.colors.text.primary};
  margin: 4px 0;
`;
exports.PlaceholderInput = styled_components_1.default(style_guide_1.TextField) `
  width: 100%;
  padding: 4px 8px;
  font-size: 1em;
`;
//# sourceMappingURL=SectionInspector.js.map