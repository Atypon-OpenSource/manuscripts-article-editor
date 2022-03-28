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
exports.ParagraphListsField = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const styles_1 = require("../../lib/styles");
const inputs_1 = require("../projects/inputs");
const StyleFields_1 = require("./StyleFields");
const ParagraphListsField = ({ paragraphStyle, saveParagraphStyle }) => {
    const [expanded, setExpanded] = react_1.useState(false);
    const { embeddedListItemBulletStyles, embeddedListItemNumberingStyles, } = paragraphStyle;
    const toggleExpanded = react_1.useCallback(() => {
        setExpanded((value) => !value);
    }, []);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Row, null,
            react_1.default.createElement(HeaderCell, null, "Level"),
            react_1.default.createElement(HeaderCell, null, "Bullet"),
            react_1.default.createElement(HeaderCell, null, "Number"),
            react_1.default.createElement(HeaderCell, null, "Start"),
            react_1.default.createElement(HeaderCell, null, "Prefix"),
            react_1.default.createElement(HeaderCell, null, "Suffix")),
        styles_1.listLevels
            .slice(0, expanded ? styles_1.listLevels.length : 3)
            .map((listLevel) => {
            const listItemBulletStyle = embeddedListItemBulletStyles &&
                embeddedListItemBulletStyles[listLevel]
                ? embeddedListItemBulletStyles[listLevel]
                : buildListItemBulletStyle();
            const listItemNumberingStyle = embeddedListItemNumberingStyles &&
                embeddedListItemNumberingStyles[listLevel]
                ? embeddedListItemNumberingStyles[listLevel]
                : buildNumberingStyle();
            return (react_1.default.createElement(Row, { key: listLevel },
                react_1.default.createElement(RowHeaderCell, null, listLevel),
                react_1.default.createElement(Cell, null,
                    react_1.default.createElement("select", { name: 'list-bullet-style', value: StyleFields_1.valueOrDefault(listItemBulletStyle.bulletStyle, styles_1.DEFAULT_LIST_BULLET_STYLE), onChange: (event) => {
                            saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { embeddedListItemBulletStyles: Object.assign(Object.assign({}, embeddedListItemBulletStyles), { [listLevel]: Object.assign(Object.assign({}, listItemBulletStyle), { bulletStyle: event.target.value }) }) }));
                        } }, Object.entries(styles_1.listBulletStyles).map(([key, value]) => (react_1.default.createElement("option", { value: key, key: key }, value.label))))),
                react_1.default.createElement(Cell, null,
                    react_1.default.createElement("select", { name: 'list-numbering-scheme', value: StyleFields_1.valueOrDefault(listItemNumberingStyle.numberingScheme, styles_1.DEFAULT_LIST_NUMBERING_STYLE), onChange: (event) => {
                            saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { embeddedListItemNumberingStyles: Object.assign(Object.assign({}, embeddedListItemNumberingStyles), { [listLevel]: Object.assign(Object.assign({}, listItemNumberingStyle), { numberingScheme: event.target
                                            .value }) }) }));
                        } }, Object.entries(styles_1.listNumberingSchemes).map(([key, value]) => (react_1.default.createElement("option", { value: key, key: key }, value.label))))),
                react_1.default.createElement(Cell, null,
                    react_1.default.createElement(inputs_1.SmallNumberField, { name: 'list-start-index', value: StyleFields_1.valueOrDefault(listItemNumberingStyle.startIndex, styles_1.DEFAULT_LIST_START_INDEX), onChange: (event) => {
                            saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { embeddedListItemNumberingStyles: Object.assign(Object.assign({}, embeddedListItemNumberingStyles), { [listLevel]: Object.assign(Object.assign({}, listItemNumberingStyle), { startIndex: Number(event.target.value) }) }) }));
                        } })),
                react_1.default.createElement(Cell, null,
                    react_1.default.createElement(inputs_1.SmallTextField, { name: 'list-prefix', size: 1, value: StyleFields_1.valueOrDefault(listItemNumberingStyle.prefix, styles_1.DEFAULT_LIST_NUMBERING_PREFIX), onChange: (event) => {
                            saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { embeddedListItemNumberingStyles: Object.assign(Object.assign({}, embeddedListItemNumberingStyles), { [listLevel]: Object.assign(Object.assign({}, listItemNumberingStyle), { prefix: event.target.value }) }) }));
                        } })),
                react_1.default.createElement(Cell, null,
                    react_1.default.createElement(inputs_1.SmallTextField, { name: 'list-suffix', size: 1, value: StyleFields_1.valueOrDefault(listItemNumberingStyle.suffix, styles_1.DEFAULT_LIST_NUMBERING_SUFFIX), onChange: (event) => {
                            saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { embeddedListItemNumberingStyles: Object.assign(Object.assign({}, embeddedListItemNumberingStyles), { [listLevel]: Object.assign(Object.assign({}, listItemNumberingStyle), { suffix: event.target.value }) }) }));
                        } }))));
        }),
        !expanded && (react_1.default.createElement(Expander, null,
            react_1.default.createElement(style_guide_1.SecondaryButton, { mini: true, onClick: toggleExpanded }, "Show all levels")))));
};
exports.ParagraphListsField = ParagraphListsField;
const Row = styled_components_1.default.div `
  display: table-row;
`;
const Cell = styled_components_1.default.div `
  display: table-cell;
  padding: ${(props) => props.theme.grid.unit}px
    ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit}px 0;
  font-size: ${(props) => props.theme.font.size.normal};
  color: ${(props) => props.theme.colors.text.muted};
`;
const HeaderCell = styled_components_1.default(Cell) ``;
const RowHeaderCell = styled_components_1.default(Cell) `
  text-align: right;
`;
const Expander = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 8}px;
`;
const buildListItemBulletStyle = () => ({
    _id: manuscript_transform_1.generateID(manuscripts_json_schema_1.ObjectTypes.ListItemBulletStyle),
    objectType: manuscripts_json_schema_1.ObjectTypes.ListItemBulletStyle,
});
const buildNumberingStyle = () => ({
    _id: manuscript_transform_1.generateID(manuscripts_json_schema_1.ObjectTypes.NumberingStyle),
    objectType: manuscripts_json_schema_1.ObjectTypes.NumberingStyle,
    startIndex: 1,
});
//# sourceMappingURL=ParagraphListsField.js.map