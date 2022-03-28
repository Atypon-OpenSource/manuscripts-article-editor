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
exports.SectionStyles = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styles_1 = require("../../lib/styles");
const Inspector_1 = require("../Inspector");
const InspectorSection_1 = require("../InspectorSection");
const inputs_1 = require("../projects/inputs");
const ColorField_1 = require("./ColorField");
const ManuscriptStyleInspector_1 = require("./ManuscriptStyleInspector");
const ParagraphStyleFields_1 = require("./ParagraphStyleFields");
const StyleFields_1 = require("./StyleFields");
const buildNumberingStyle = () => ({
    _id: manuscript_transform_1.generateID(manuscripts_json_schema_1.ObjectTypes.NumberingStyle),
    objectType: manuscripts_json_schema_1.ObjectTypes.NumberingStyle,
    startIndex: styles_1.DEFAULT_SECTION_START_INDEX,
});
const SectionStyles = ({ colors, colorScheme, error, paragraphStyle, saveModel, saveParagraphStyle, saveDebouncedParagraphStyle, setError, title, }) => {
    const { partOfTOC, runIn, sectionNumberingStyle = buildNumberingStyle(), } = paragraphStyle;
    return (react_1.default.createElement(InspectorSection_1.InspectorSection, { title: title },
        error && react_1.default.createElement("div", null, error.message),
        react_1.default.createElement(Inspector_1.InspectorTabs, null,
            react_1.default.createElement(Inspector_1.InspectorPanelTabList, null,
                react_1.default.createElement(Inspector_1.InspectorTab, null, "Text"),
                react_1.default.createElement(Inspector_1.InspectorTab, null, "Spacing"),
                react_1.default.createElement(Inspector_1.InspectorTab, null, "Numbering"),
                react_1.default.createElement(Inspector_1.InspectorTab, null, "Options")),
            react_1.default.createElement(Inspector_1.InspectorTabPanels, null,
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null,
                    react_1.default.createElement(ParagraphStyleFields_1.TextSizeField, { saveParagraphStyle: saveParagraphStyle, paragraphStyle: paragraphStyle }),
                    react_1.default.createElement(ParagraphStyleFields_1.TextStyleField, { saveParagraphStyle: saveParagraphStyle, paragraphStyle: paragraphStyle }),
                    colorScheme && paragraphStyle.textStyling && (react_1.default.createElement(ColorField_1.ColorField, { colors: colors, colorScheme: colorScheme, value: paragraphStyle.textStyling.color, handleChange: (color) => saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { textStyling: Object.assign(Object.assign({}, paragraphStyle.textStyling), { color }) })), saveModel: saveModel, setError: setError }))),
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null,
                    react_1.default.createElement(ParagraphStyleFields_1.TextAlignmentField, { saveParagraphStyle: saveParagraphStyle, paragraphStyle: paragraphStyle }),
                    react_1.default.createElement(ParagraphStyleFields_1.TopSpacingField, { saveParagraphStyle: saveDebouncedParagraphStyle, paragraphStyle: paragraphStyle }),
                    react_1.default.createElement(ParagraphStyleFields_1.BottomSpacingField, { saveParagraphStyle: saveDebouncedParagraphStyle, paragraphStyle: paragraphStyle }),
                    react_1.default.createElement(ParagraphStyleFields_1.FirstLineIndentField, { saveParagraphStyle: saveDebouncedParagraphStyle, paragraphStyle: paragraphStyle }),
                    react_1.default.createElement(ParagraphStyleFields_1.LineSpacingField, { saveParagraphStyle: saveDebouncedParagraphStyle, paragraphStyle: paragraphStyle })),
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null,
                    react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
                        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Numbering"),
                        react_1.default.createElement(inputs_1.StyleSelect, { name: 'section-numbering-scheme', value: StyleFields_1.valueOrDefault(sectionNumberingStyle.numberingScheme, styles_1.DEFAULT_SECTION_NUMBERING_STYLE), onChange: (event) => {
                                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { sectionNumberingStyle: Object.assign(Object.assign({}, sectionNumberingStyle), { numberingScheme: event.target
                                            .value }) }));
                            } }, Object.entries(styles_1.sectionNumberingSchemes).map(([key, value]) => (react_1.default.createElement("option", { value: key, key: key }, value.label))))),
                    react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
                        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Suffix"),
                        react_1.default.createElement(inputs_1.SmallTextField, { name: 'list-suffix', value: StyleFields_1.valueOrDefault(sectionNumberingStyle.suffix, styles_1.DEFAULT_SECTION_NUMBERING_SUFFIX), onChange: (event) => {
                                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { sectionNumberingStyle: Object.assign(Object.assign({}, sectionNumberingStyle), { suffix: event.target.value }) }));
                            } }))),
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null,
                    react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
                        react_1.default.createElement(style_guide_1.CheckboxField, { name: 'part-of-toc', id: 'part-of-toc', checked: StyleFields_1.valueOrDefault(partOfTOC, styles_1.DEFAULT_PART_OF_TOC), disabled: paragraphStyle.name === 'heading1', onChange: (event) => {
                                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { partOfTOC: event.target.checked }));
                            } }),
                        react_1.default.createElement(style_guide_1.CheckboxLabel, { htmlFor: 'part-of-toc' }, "Include in Table of Contents")),
                    react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
                        react_1.default.createElement(style_guide_1.CheckboxField, { name: 'run-in', id: 'run-in', checked: StyleFields_1.valueOrDefault(runIn, false), 
                            // disabled={paragraphStyle.name === 'heading1'}
                            onChange: (event) => {
                                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { runIn: event.target.checked }));
                            } }),
                        react_1.default.createElement(style_guide_1.CheckboxLabel, { htmlFor: 'run-in' }, "Run into first paragraph")))))));
};
exports.SectionStyles = SectionStyles;
//# sourceMappingURL=SectionStyles.js.map