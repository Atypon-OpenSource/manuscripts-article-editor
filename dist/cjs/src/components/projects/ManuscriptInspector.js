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
exports.ManuscriptInspector = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const react_1 = __importStar(require("react"));
const config_1 = __importDefault(require("../../config"));
const store_1 = require("../../store");
const Inspector_1 = require("../Inspector");
const LabelField_1 = require("../inspector/LabelField");
const ManuscriptStyleInspector_1 = require("../inspector/ManuscriptStyleInspector");
const InspectorSection_1 = require("../InspectorSection");
const ModalHookableProvider_1 = require("../ModalHookableProvider");
const TemplateSelector_1 = __importDefault(require("../templates/TemplateSelector"));
const CategorisedKeywordsInput_1 = require("./CategorisedKeywordsInput");
const CheckboxInput_1 = require("./CheckboxInput");
const CountInput_1 = require("./CountInput");
const DateTimeInput_1 = require("./DateTimeInput");
const DescriptionInput_1 = require("./DescriptionInput");
const DOIInput_1 = require("./DOIInput");
const KeywordsInput_1 = require("./KeywordsInput");
const RunningTitleField_1 = require("./RunningTitleField");
const ThemeInput_1 = require("./ThemeInput");
const URLInput_1 = require("./URLInput");
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
const ManuscriptInspector = ({ state, dispatch, 
// pageLayout,
openTemplateSelector, getTemplate, getManuscriptCountRequirements, canWrite, leanWorkflow, }) => {
    var _a, _b;
    const [{ manuscript, modelMap, saveManuscript, saveModel, user, project },] = store_1.useStore((store) => ({
        manuscript: store.manuscript,
        modelMap: store.modelMap,
        saveManuscript: store.saveManuscript,
        saveModel: store.saveModel,
        deleteModel: store.deleteModel,
        user: store.user,
        project: store.project,
    }));
    const authorInstructionsURL = manuscript.authorInstructionsURL
        ? manuscript.authorInstructionsURL
        : manuscript.prototype
            ? (_a = getTemplate(manuscript.prototype)) === null || _a === void 0 ? void 0 : _a.authorInstructionsURL
            : undefined;
    const getOrBuildRequirement = (objectType, id, prototype) => {
        var _a;
        if (id && modelMap.has(id)) {
            return modelMap.get(id);
        }
        // infer requirement from the manuscript prototype
        const count = prototype
            ? (_a = getManuscriptCountRequirements(prototype)) === null || _a === void 0 ? void 0 : _a.get(objectType)
            : undefined;
        return buildCountRequirement(objectType, count, count ? false : true);
    };
    const requirements = {
        minWordCount: getOrBuildRequirement(manuscripts_json_schema_1.ObjectTypes.MinimumManuscriptWordCountRequirement, manuscript.minWordCountRequirement, manuscript.prototype),
        maxWordCount: getOrBuildRequirement(manuscripts_json_schema_1.ObjectTypes.MaximumManuscriptWordCountRequirement, manuscript.maxWordCountRequirement, manuscript.prototype),
        minCharacterCount: getOrBuildRequirement(manuscripts_json_schema_1.ObjectTypes.MinimumManuscriptCharacterCountRequirement, manuscript.minCharacterCountRequirement, manuscript.prototype),
        maxCharacterCount: getOrBuildRequirement(manuscripts_json_schema_1.ObjectTypes.MaximumManuscriptCharacterCountRequirement, manuscript.maxCharacterCountRequirement, manuscript.prototype),
    };
    const manuscriptFigureElementLabelChangeHandler = react_1.useCallback((figureElementLabel) => __awaiter(void 0, void 0, void 0, function* () {
        yield saveManuscript({
            figureElementLabel,
        });
    }), [saveManuscript]);
    const manuscriptTableElementLabelChangeHandler = react_1.useCallback((tableElementLabel) => __awaiter(void 0, void 0, void 0, function* () {
        yield saveManuscript({
            tableElementLabel,
        });
    }), [saveManuscript]);
    const manuscriptEquationElementLabelChangeHandler = react_1.useCallback((equationElementLabel) => __awaiter(void 0, void 0, void 0, function* () {
        yield saveManuscript({
            equationElementLabel,
        });
    }), [saveManuscript]);
    const manuscriptListingElementLabelChangeHandler = react_1.useCallback((listingElementLabel) => __awaiter(void 0, void 0, void 0, function* () {
        yield saveManuscript({
            listingElementLabel,
        });
    }), [saveManuscript]);
    const { addModal } = ModalHookableProvider_1.useModal();
    const openTemplateSelectorHandler = (newProject, switchTemplate) => {
        addModal('template-selector', ({ handleClose }) => (react_1.default.createElement(TemplateSelector_1.default, { projectID: newProject ? undefined : project._id, user: user, handleComplete: handleClose, manuscript: manuscript, switchTemplate: switchTemplate, modelMap: modelMap })));
    };
    return (react_1.default.createElement(InspectorSection_1.InspectorSection, { title: 'Manuscript' },
        react_1.default.createElement(Inspector_1.InspectorTabs, null,
            react_1.default.createElement(Inspector_1.InspectorPanelTabList, null,
                react_1.default.createElement(Inspector_1.InspectorTab, null, "Metadata"),
                !leanWorkflow && react_1.default.createElement(Inspector_1.InspectorTab, null, "Labels"),
                !leanWorkflow && react_1.default.createElement(Inspector_1.InspectorTab, null, "Requirements")),
            react_1.default.createElement(Inspector_1.InspectorTabPanels, null,
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null,
                    config_1.default.export.literatum && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(InspectorSection_1.Subheading, null, "DOI"),
                        react_1.default.createElement(DOIInput_1.DOIInput, { value: manuscript.DOI, handleChange: (DOI) => __awaiter(void 0, void 0, void 0, function* () {
                                yield saveManuscript({
                                    DOI,
                                });
                            }) }),
                        react_1.default.createElement(InspectorSection_1.Subheading, null, "Running title"),
                        react_1.default.createElement(RunningTitleField_1.RunningTitleField, { placeholder: 'Running title', value: manuscript.runningTitle || '', handleChange: (runningTitle) => __awaiter(void 0, void 0, void 0, function* () {
                                yield saveManuscript({
                                    runningTitle,
                                });
                            }) }),
                        !leanWorkflow && (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement(InspectorSection_1.Subheading, null, "Publication Date"),
                            react_1.default.createElement(DateTimeInput_1.DateTimeInput, { value: manuscript.publicationDate, handleChange: (publicationDate) => __awaiter(void 0, void 0, void 0, function* () {
                                    yield saveManuscript({
                                        publicationDate,
                                    });
                                }) }),
                            react_1.default.createElement(InspectorSection_1.Subheading, null, "Paywall"),
                            react_1.default.createElement(CheckboxInput_1.CheckboxInput, { value: manuscript.paywall, handleChange: (paywall) => __awaiter(void 0, void 0, void 0, function* () {
                                    yield saveManuscript({ paywall });
                                }), label: 'Publish behind a paywall' }),
                            react_1.default.createElement(InspectorSection_1.Subheading, null, "Abstract"),
                            react_1.default.createElement(DescriptionInput_1.DescriptionInput, { value: manuscript.desc, handleChange: (desc) => __awaiter(void 0, void 0, void 0, function* () {
                                    yield saveManuscript({
                                        desc,
                                    });
                                }) }),
                            react_1.default.createElement(InspectorSection_1.Subheading, null, "Theme"),
                            react_1.default.createElement(ThemeInput_1.ThemeInput, { value: manuscript.layoutTheme || '', handleChange: (layoutTheme) => __awaiter(void 0, void 0, void 0, function* () {
                                    yield saveManuscript({
                                        layoutTheme,
                                    });
                                }) }))))),
                    react_1.default.createElement(InspectorSection_1.Subheading, null, "Keywords"),
                    config_1.default.keywordsCategories ? (react_1.default.createElement(CategorisedKeywordsInput_1.CategorisedKeywordsInput, { target: manuscript })) : (react_1.default.createElement(KeywordsInput_1.KeywordsInput, { state: state, dispatch: dispatch })),
                    !leanWorkflow && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(InspectorSection_1.Subheading, null, "Author Instruction URL"),
                        react_1.default.createElement(URLInput_1.URLInput, { handleChange: (authorInstructionsURL) => __awaiter(void 0, void 0, void 0, function* () {
                                yield saveManuscript({
                                    authorInstructionsURL,
                                });
                            }), value: authorInstructionsURL }))),
                    config_1.default.features.switchTemplate && canWrite && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(InspectorSection_1.Subheading, null, "Template"),
                        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorValue, { onClick: () => openTemplateSelector
                                ? openTemplateSelector(false, true)
                                : openTemplateSelectorHandler(false, true) },
                            react_1.default.createElement(ManuscriptStyleInspector_1.CitationStyle, { value: manuscript.prototype
                                    ? (_b = getTemplate(manuscript.prototype)) === null || _b === void 0 ? void 0 : _b.title
                                    : '' }),
                            react_1.default.createElement(ManuscriptStyleInspector_1.ChooseButton, { mini: true }, "Choose"))))),
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null,
                    react_1.default.createElement(LabelField_1.LabelField, { label: 'Figure Panel', placeholder: 'Figure', value: manuscript.figureElementLabel || '', handleChange: manuscriptFigureElementLabelChangeHandler }),
                    react_1.default.createElement(LabelField_1.LabelField, { label: 'Table', placeholder: 'Table', value: manuscript.tableElementLabel || '', handleChange: manuscriptTableElementLabelChangeHandler }),
                    react_1.default.createElement(LabelField_1.LabelField, { label: 'Equation', placeholder: 'Equation', value: manuscript.equationElementLabel || '', handleChange: manuscriptEquationElementLabelChangeHandler }),
                    react_1.default.createElement(LabelField_1.LabelField, { label: 'Listing', placeholder: 'Listing', value: manuscript.listingElementLabel || '', handleChange: manuscriptListingElementLabelChangeHandler })),
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null,
                    react_1.default.createElement(CountInput_1.CountInput, { label: 'Min word count', placeholder: 'Minimum', value: requirements.minWordCount, handleChange: (requirement) => __awaiter(void 0, void 0, void 0, function* () {
                            yield saveModel(requirement);
                            if (requirement._id !== manuscript.minWordCountRequirement) {
                                yield saveManuscript({
                                    minWordCountRequirement: requirement._id,
                                });
                            }
                        }) }),
                    react_1.default.createElement(CountInput_1.CountInput, { label: 'Max word count', placeholder: 'Maximum', value: requirements.maxWordCount, handleChange: (requirement) => __awaiter(void 0, void 0, void 0, function* () {
                            yield saveModel(requirement);
                            if (requirement._id !== manuscript.maxWordCountRequirement) {
                                yield saveManuscript({
                                    maxWordCountRequirement: requirement._id,
                                });
                            }
                        }) }),
                    react_1.default.createElement(CountInput_1.CountInput, { label: 'Min character count', placeholder: 'Minimum', value: requirements.minCharacterCount, handleChange: (requirement) => __awaiter(void 0, void 0, void 0, function* () {
                            yield saveModel(requirement);
                            if (requirement._id !== manuscript.minCharacterCountRequirement) {
                                yield saveManuscript({
                                    minCharacterCountRequirement: requirement._id,
                                });
                            }
                        }) }),
                    react_1.default.createElement(CountInput_1.CountInput, { label: 'Max character count', placeholder: 'Maximum', value: requirements.maxCharacterCount, handleChange: (requirement) => __awaiter(void 0, void 0, void 0, function* () {
                            yield saveModel(requirement);
                            if (requirement._id !== manuscript.maxCharacterCountRequirement) {
                                yield saveManuscript({
                                    maxCharacterCountRequirement: requirement._id,
                                });
                            }
                        }) }))))));
};
exports.ManuscriptInspector = ManuscriptInspector;
//# sourceMappingURL=ManuscriptInspector.js.map