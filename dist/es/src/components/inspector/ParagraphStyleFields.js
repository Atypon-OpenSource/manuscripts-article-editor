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
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListNumberingField = exports.ListIndentPerLevelField = exports.ListTailIndentField = exports.LineSpacingField = exports.FirstLineIndentField = exports.BottomSpacingField = exports.TopSpacingField = exports.TextAlignmentField = exports.TextStyleField = exports.TextSizeField = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const styles_1 = require("../../lib/styles");
const inputs_1 = require("../projects/inputs");
const ManuscriptStyleInspector_1 = require("./ManuscriptStyleInspector");
const StyleFields_1 = require("./StyleFields");
const TextSizeField = ({ paragraphStyle, saveParagraphStyle }) => {
    const { textStyling } = paragraphStyle;
    if (!textStyling) {
        return null;
    }
    return (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Size"),
        react_1.default.createElement(inputs_1.SmallNumberField, { value: StyleFields_1.valueOrDefault(textStyling.fontSize, styles_1.DEFAULT_FONT_SIZE), onChange: (event) => {
                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { textStyling: Object.assign(Object.assign({}, textStyling), { fontSize: Number(event.target.value) }) }));
            } }),
        "pt"));
};
exports.TextSizeField = TextSizeField;
const TextStyleField = ({ paragraphStyle, saveParagraphStyle }) => {
    const { textStyling } = paragraphStyle;
    if (!textStyling) {
        return null;
    }
    return (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Style"),
        react_1.default.createElement(TextStyleButton, { type: 'button', isActive: textStyling.bold, onMouseDown: () => {
                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { textStyling: Object.assign(Object.assign({}, textStyling), { bold: !textStyling.bold }) }));
            } }, "B"),
        react_1.default.createElement(TextStyleButton, { type: 'button', isActive: textStyling.italic, style: { fontStyle: 'italic' }, onMouseDown: () => {
                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { textStyling: Object.assign(Object.assign({}, textStyling), { italic: !textStyling.italic }) }));
            } }, "I")));
};
exports.TextStyleField = TextStyleField;
const TextStyleButton = styled_components_1.default.button `
  font-weight: ${(props) => props.isActive
    ? props.theme.font.weight.bold
    : props.theme.font.weight.normal};
  font-size: inherit;
  border: none;
  border-radius: 50%;
  background: none;
  padding: 0 ${(props) => props.theme.grid.unit * 2}px;
  cursor: pointer;
`;
const TextAlignmentField = ({ paragraphStyle, saveParagraphStyle }) => {
    const value = StyleFields_1.valueOrDefault(paragraphStyle.alignment, styles_1.DEFAULT_ALIGNMENT);
    return (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Alignment"),
        react_1.default.createElement(inputs_1.StyleSelect, { value: value, onChange: (event) => {
                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { alignment: event.target.value }));
            } }, Object.entries(styles_1.alignments).map(([key, value]) => (react_1.default.createElement("option", { value: key, key: key }, value.label))))));
};
exports.TextAlignmentField = TextAlignmentField;
const TopSpacingField = ({ paragraphStyle, saveParagraphStyle }) => {
    const value = StyleFields_1.valueOrDefault(paragraphStyle.topSpacing, styles_1.DEFAULT_MARGIN_TOP);
    return (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Top spacing"),
        react_1.default.createElement(inputs_1.SpacingRange, { name: 'top-spacing', min: 0, max: 40, step: 2, list: 'topSpacingList', value: value, onChange: (event) => {
                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { topSpacing: Number(event.target.value) }));
            } }),
        react_1.default.createElement(inputs_1.SmallNumberField, { value: value, onChange: (event) => {
                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { topSpacing: Number(event.target.value) }));
            } }),
        "pt"));
};
exports.TopSpacingField = TopSpacingField;
const BottomSpacingField = ({ paragraphStyle, saveParagraphStyle }) => {
    const value = StyleFields_1.valueOrDefault(paragraphStyle.bottomSpacing, styles_1.DEFAULT_MARGIN_BOTTOM);
    return (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Bottom spacing"),
        react_1.default.createElement(inputs_1.SpacingRange, { name: 'bottom-spacing', min: 0, max: 40, step: 2, value: value, list: 'bottomSpacingLsit', onChange: (event) => {
                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { bottomSpacing: Number(event.target.value) }));
            } }),
        react_1.default.createElement(inputs_1.SmallNumberField, { value: value, onChange: (event) => {
                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { bottomSpacing: Number(event.target.value) }));
            } }),
        "pt"));
};
exports.BottomSpacingField = BottomSpacingField;
const FirstLineIndentField = ({ paragraphStyle, saveParagraphStyle }) => {
    const value = StyleFields_1.valueOrDefault(paragraphStyle.firstLineIndent, styles_1.DEFAULT_TEXT_INDENT);
    return (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "First line indent"),
        react_1.default.createElement(inputs_1.SpacingRange, { name: 'first-line-indent', min: 0, max: 40, step: 2, value: value, list: 'firstLineIndentList', onChange: (event) => {
                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { firstLineIndent: Number(event.target.value) }));
            } }),
        react_1.default.createElement(inputs_1.SmallNumberField, { value: value, onChange: (event) => {
                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { firstLineIndent: Number(event.target.value) }));
            } }),
        "pt"));
};
exports.FirstLineIndentField = FirstLineIndentField;
const LineSpacingField = ({ paragraphStyle, saveParagraphStyle }) => {
    const value = StyleFields_1.valueOrDefault(paragraphStyle.lineSpacing, styles_1.DEFAULT_LINE_HEIGHT);
    return (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Line spacing"),
        react_1.default.createElement(inputs_1.StyleRange, { type: 'range', name: 'line-spacing', min: 1, max: 2, step: 0.25, value: value, list: 'lineSpacingList', onChange: (event) => {
                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { lineSpacing: Number(event.target.value) }));
            } }),
        react_1.default.createElement(inputs_1.SmallNumberField, { value: value, onChange: (event) => {
                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { lineSpacing: Number(event.target.value) }));
            } }),
        "pt"));
};
exports.LineSpacingField = LineSpacingField;
const ListTailIndentField = ({ paragraphStyle, saveParagraphStyle }) => {
    const value = StyleFields_1.valueOrDefault(paragraphStyle.listTailIndent, styles_1.DEFAULT_LIST_INDENT);
    return (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "List indent"),
        react_1.default.createElement(inputs_1.SpacingRange, { name: 'list-indent', type: 'range', min: 0, max: 40, step: 2, list: 'listTailIndentList', value: value, onChange: (event) => {
                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { listTailIndent: Number(event.target.value) }));
            } }),
        react_1.default.createElement(inputs_1.SmallNumberField, { value: value, onChange: (event) => {
                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { listTailIndent: Number(event.target.value) }));
            } }),
        "pt"));
};
exports.ListTailIndentField = ListTailIndentField;
const ListIndentPerLevelField = ({ paragraphStyle, saveParagraphStyle }) => {
    const value = StyleFields_1.valueOrDefault(paragraphStyle.listItemIndentPerLevel, styles_1.DEFAULT_LIST_INDENT_PER_LEVEL);
    return (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Indent per level"),
        react_1.default.createElement(inputs_1.SpacingRange, { name: 'list-level-indent', type: 'range', min: 0, max: 40, step: 2, list: 'listLevelIndentList', value: value, onChange: (event) => {
                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { listItemIndentPerLevel: Number(event.target.value) }));
            } }),
        react_1.default.createElement(inputs_1.SmallNumberField, { value: value, onChange: (event) => {
                saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { listItemIndentPerLevel: Number(event.target.value) }));
            } }),
        "pt"));
};
exports.ListIndentPerLevelField = ListIndentPerLevelField;
const ListNumberingField = ({ paragraphStyle, saveParagraphStyle }) => (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
    react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "List numbering"),
    react_1.default.createElement(StyleFields_1.BlockFields, null,
        react_1.default.createElement(StyleFields_1.BlockField, null,
            react_1.default.createElement("input", { name: 'list-hierarchical-numbering', type: 'checkbox', checked: paragraphStyle.hierarchicalListNumbering, onChange: (event) => {
                    saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { hierarchicalListNumbering: Boolean(event.target.checked) }));
                } }),
            "Hierarchical"),
        paragraphStyle.hierarchicalListNumbering && (react_1.default.createElement(StyleFields_1.BlockField, null,
            react_1.default.createElement("input", { name: 'list-hide-suffix', type: 'checkbox', checked: paragraphStyle.hideListNumberingSuffixForLastLevel, onChange: (event) => {
                    saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { hideListNumberingSuffixForLastLevel: Boolean(event.target.checked) }));
                } }),
            "Hide suffix for last level")))));
exports.ListNumberingField = ListNumberingField;
//# sourceMappingURL=ParagraphStyleFields.js.map