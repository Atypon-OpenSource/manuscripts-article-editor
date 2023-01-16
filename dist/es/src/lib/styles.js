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
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildInlineStyles = exports.buildParagraphStyles = exports.sectionNumberingSchemes = exports.listNumberingSchemes = exports.listBulletStyles = exports.listLevels = exports.figureAlignments = exports.alignments = exports.captionAlignments = exports.tableCaptionPositions = exports.figureLabelPositions = exports.figureCaptionPositions = exports.isFigureLayout = exports.isInlineStyle = exports.isTableStyle = exports.isBorderStyle = exports.isFigureStyle = exports.isParagraphStyle = exports.DEFAULT_TEXT_INDENT = exports.DEFAULT_TABLE_HEADER_BACKGROUND_COLOR = exports.DEFAULT_TABLE_FOOTER_BACKGROUND_COLOR = exports.DEFAULT_TABLE_CAPTION_POSITION = exports.DEFAULT_TABLE_CAPTION_ALIGNMENT = exports.DEFAULT_TABLE_BORDER_WIDTH = exports.DEFAULT_SECTION_NUMBERING_SUFFIX = exports.DEFAULT_SECTION_START_INDEX = exports.DEFAULT_SECTION_NUMBERING_STYLE = exports.DEFAULT_PART_OF_TOC = exports.DEFAULT_MARGIN_TOP = exports.DEFAULT_MARGIN_BOTTOM = exports.DEFAULT_LIST_START_INDEX = exports.DEFAULT_LIST_NUMBERING_SUFFIX = exports.DEFAULT_LIST_NUMBERING_PREFIX = exports.DEFAULT_LIST_NUMBERING_STYLE = exports.DEFAULT_LIST_INDENT_PER_LEVEL = exports.DEFAULT_LIST_INDENT = exports.DEFAULT_LIST_BULLET_STYLE = exports.DEFAULT_LINE_HEIGHT = exports.DEFAULT_FONT_SIZE = exports.DEFAULT_FIGURE_WIDTH = exports.DEFAULT_FIGURE_OUTER_SPACING = exports.DEFAULT_FIGURE_OUTER_BORDER_WIDTH = exports.DEFAULT_FIGURE_LABEL_POSITION = exports.DEFAULT_FIGURE_INNER_SPACING = exports.DEFAULT_FIGURE_INNER_BORDER_WIDTH = exports.DEFAULT_FIGURE_CAPTION_POSITION = exports.DEFAULT_FIGURE_CAPTION_ALIGNMENT = exports.DEFAULT_FIGURE_ALIGNMENT = exports.DEFAULT_COLOR = exports.DEFAULT_ALIGNMENT = void 0;
exports.trackChangesCssSelector = exports.chooseParagraphStyle = exports.findInlineStyles = exports.findTableStyles = exports.findBorderStyles = exports.findFigureStyles = exports.findFigureLayouts = exports.findBodyTextParagraphStyles = exports.buildHeadingStyles = exports.buildTableStyles = exports.buildFigureLayoutStyles = exports.buildFigureStyles = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const lodash_es_1 = require("lodash-es");
const StyleFields_1 = require("../components/inspector/StyleFields");
const sort_1 = require("./sort");
exports.DEFAULT_ALIGNMENT = 'left';
exports.DEFAULT_COLOR = '#000';
exports.DEFAULT_FIGURE_ALIGNMENT = 'center';
exports.DEFAULT_FIGURE_CAPTION_ALIGNMENT = 'center';
exports.DEFAULT_FIGURE_CAPTION_POSITION = 'bottom';
exports.DEFAULT_FIGURE_INNER_BORDER_WIDTH = 1;
exports.DEFAULT_FIGURE_INNER_SPACING = 4;
exports.DEFAULT_FIGURE_LABEL_POSITION = 'inline';
exports.DEFAULT_FIGURE_OUTER_BORDER_WIDTH = 1;
exports.DEFAULT_FIGURE_OUTER_SPACING = 4;
exports.DEFAULT_FIGURE_WIDTH = 1;
exports.DEFAULT_FONT_SIZE = 12;
exports.DEFAULT_LINE_HEIGHT = 1.5;
exports.DEFAULT_LIST_BULLET_STYLE = 'disc';
exports.DEFAULT_LIST_INDENT = 0;
exports.DEFAULT_LIST_INDENT_PER_LEVEL = 20;
exports.DEFAULT_LIST_NUMBERING_STYLE = 'decimal';
exports.DEFAULT_LIST_NUMBERING_PREFIX = '';
exports.DEFAULT_LIST_NUMBERING_SUFFIX = '.';
exports.DEFAULT_LIST_START_INDEX = 1;
exports.DEFAULT_MARGIN_BOTTOM = 0;
exports.DEFAULT_MARGIN_TOP = 12;
exports.DEFAULT_PART_OF_TOC = true;
exports.DEFAULT_SECTION_NUMBERING_STYLE = 'decimal';
exports.DEFAULT_SECTION_START_INDEX = 1;
exports.DEFAULT_SECTION_NUMBERING_SUFFIX = '.';
// export const DEFAULT_SPACING = 20
exports.DEFAULT_TABLE_BORDER_WIDTH = 1;
exports.DEFAULT_TABLE_CAPTION_ALIGNMENT = 'center';
exports.DEFAULT_TABLE_CAPTION_POSITION = 'below';
exports.DEFAULT_TABLE_FOOTER_BACKGROUND_COLOR = '#eee';
exports.DEFAULT_TABLE_HEADER_BACKGROUND_COLOR = '#eee';
exports.DEFAULT_TEXT_INDENT = 0;
exports.isParagraphStyle = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.ParagraphStyle);
exports.isFigureStyle = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.FigureStyle);
exports.isBorderStyle = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.BorderStyle);
exports.isTableStyle = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.TableStyle);
exports.isInlineStyle = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.InlineStyle);
exports.isFigureLayout = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.FigureLayout);
exports.figureCaptionPositions = {
    // above: {
    //   label: 'Above Figure',
    // },
    top: {
        label: 'Top of Figure',
    },
    bottom: {
        label: 'Bottom of Figure',
    },
    // below: {
    //   label: 'Below Figure',
    // },
};
exports.figureLabelPositions = {
    // block: {
    //   label: 'Above Caption',
    // },
    inline: {
        label: 'Inline',
    },
    none: {
        label: 'None',
    },
};
exports.tableCaptionPositions = {
    above: {
        label: 'Above Table',
    },
    below: {
        label: 'Below Table',
    },
};
exports.captionAlignments = {
    left: {
        label: 'Left',
    },
    center: {
        label: 'Center',
    },
    right: {
        label: 'Right',
    },
    justify: {
        label: 'Justify',
    },
};
/*export type BorderStyleType = 'none' | 'solid' | 'dashed' | 'dotted' | 'double'

export const borderStyles: {
  [key in BorderStyleType]: {
    css: Property.BorderBlockStyle
    label: string
  }
} = {
  none: {
    css: 'none',
    label: 'None',
  },
  solid: {
    css: 'solid',
    label: 'Solid',
  },
  dashed: {
    css: 'dashed',
    label: 'Dashed',
  },
  dotted: {
    css: 'dotted',
    label: 'Dotted',
  },
  double: {
    css: 'double',
    label: 'Double lines',
  },
}*/
const fontSize = (model) => model.textStyling && model.textStyling.fontSize
    ? model.textStyling.fontSize
    : exports.DEFAULT_FONT_SIZE;
const fontStyle = (model) => model.textStyling && model.textStyling.italic ? 'italic' : 'normal';
const fontWeight = (model) => model.textStyling && model.textStyling.bold ? 'bold' : 'normal';
const paragraphColor = (model, colors) => {
    return colorValue(colors, model.textStyling && model.textStyling.color);
};
const borderColor = (border, colors) => {
    return colorValue(colors, border && border.color);
};
const colorValue = (colors, id, defaultColor = exports.DEFAULT_COLOR) => {
    if (id) {
        const color = colors.get(id);
        if (color && color.value) {
            return color.value;
        }
    }
    return defaultColor;
};
const borderStyle = (border, borderStyles) => {
    const id = border && border.style;
    if (id) {
        const style = borderStyles.get(id);
        // TODO: use `doubleLines` and `pattern`?
        if (style && style.name) {
            return style.name;
        }
    }
    return 'none';
};
exports.alignments = {
    left: {
        css: 'left',
        label: 'Left',
    },
    center: {
        css: 'center',
        label: 'Center',
    },
    right: {
        css: 'right',
        label: 'Right',
    },
    justify: {
        css: 'justify',
        label: 'Justify',
    },
};
exports.figureAlignments = {
    left: {
        css: 'left',
        label: 'Left',
    },
    center: {
        css: 'center',
        label: 'Center',
    },
    right: {
        css: 'right',
        label: 'Right',
    },
};
exports.listLevels = ['1', '2', '3', '4', '5', '6'];
exports.listBulletStyles = {
    disc: {
        css: 'disc',
        label: '●',
    },
    circle: {
        css: 'circle',
        label: '○',
    },
    square: {
        css: 'square',
        label: '■',
    },
    none: {
        css: 'none',
        label: '',
    },
};
exports.listNumberingSchemes = {
    none: {
        css: 'none',
        label: 'None',
    },
    decimal: {
        css: 'decimal',
        label: '1 2 3',
    },
    'decimal-with-leading-zero': {
        css: 'decimal-leading-zero',
        label: '01 02 03',
    },
    'uppercase-latin': {
        css: 'upper-latin',
        label: 'A B C',
    },
    'lowercase-latin': {
        css: 'lower-latin',
        label: 'a b c',
    },
    'uppercase-roman': {
        css: 'upper-roman',
        label: 'I II III',
    },
    'lowercase-roman': {
        css: 'lower-roman',
        label: 'i ii iii',
    },
    'lowercase-greek': {
        css: 'lower-greek',
        label: 'α β γ',
    },
};
exports.sectionNumberingSchemes = {
    none: {
        css: 'none',
        label: 'None',
    },
    decimal: {
        css: 'decimal',
        label: '1 2 3',
    },
};
const chooseListNumberingStyle = (model, level) => {
    if (model.embeddedListItemNumberingStyles) {
        const itemNumberingStyle = model.embeddedListItemNumberingStyles[level];
        if (itemNumberingStyle) {
            const { numberingScheme } = itemNumberingStyle;
            if (numberingScheme) {
                const scheme = exports.listNumberingSchemes[numberingScheme];
                if (scheme) {
                    return scheme.css;
                }
            }
        }
    }
    return exports.DEFAULT_LIST_NUMBERING_STYLE;
};
const chooseListNumberingPrefix = (model, level) => {
    if (model.embeddedListItemNumberingStyles) {
        const itemNumberingStyle = model.embeddedListItemNumberingStyles[level];
        if (itemNumberingStyle) {
            const { prefix } = itemNumberingStyle;
            if (prefix) {
                return prefix;
            }
        }
    }
    return exports.DEFAULT_LIST_NUMBERING_PREFIX;
};
const chooseListNumberingSuffix = (model, level) => {
    if (model.hierarchicalListNumbering &&
        model.hideListNumberingSuffixForLastLevel
    // level === lastLevel
    ) {
        return '';
    }
    if (model.embeddedListItemNumberingStyles) {
        const itemNumberingStyle = model.embeddedListItemNumberingStyles[level];
        if (itemNumberingStyle) {
            const { suffix } = itemNumberingStyle;
            if (suffix) {
                return suffix;
            }
        }
    }
    return exports.DEFAULT_LIST_NUMBERING_SUFFIX;
};
const chooseListNumberingStartIndex = (model, level) => {
    if (model.embeddedListItemNumberingStyles) {
        const itemNumberingStyle = model.embeddedListItemNumberingStyles[level];
        if (itemNumberingStyle) {
            return itemNumberingStyle.startIndex;
        }
    }
    return exports.DEFAULT_LIST_START_INDEX;
};
const chooseListBulletStyle = (model, level) => {
    if (model.embeddedListItemBulletStyles) {
        const itemBulletStyle = model.embeddedListItemBulletStyles[level];
        if (itemBulletStyle) {
            const { bulletStyle } = itemBulletStyle;
            if (bulletStyle) {
                const style = exports.listBulletStyles[bulletStyle];
                if (style) {
                    return style.css;
                }
            }
        }
    }
    return exports.DEFAULT_LIST_BULLET_STYLE;
};
const listStyles = (model) => {
    const styles = [];
    for (const level of exports.listLevels) {
        if (level === '1') {
            continue; // already handled
        }
        // ordered lists
        const depth = Number(level) - 1;
        const parentListSelector = '.list '.repeat(depth - 1);
        const listSelector = '.list '.repeat(depth);
        const startIndex = chooseListNumberingStartIndex(model, level);
        styles.push(`${listSelector} {
      counter-reset: list-level-${level} ${startIndex - 1};
    }`);
        styles.push(`${listSelector} > li {
      counter-increment: list-level-${level};
    }`);
        const buildHierarchicalOrderedListCounters = (level) => {
            return lodash_es_1.range(1, Number(level) + 1) // end is not inclusive
                .map((activeLevel) => {
                const style = chooseListNumberingStyle(model, String(activeLevel));
                return `counter(list-level-${activeLevel}, ${style})`;
            })
                .join('"."');
        };
        const buildOrderedListCounters = (level, hierarchical = false) => {
            const style = chooseListNumberingStyle(model, level);
            const prefix = chooseListNumberingPrefix(model, level);
            const suffix = chooseListNumberingSuffix(model, level);
            const content = hierarchical
                ? buildHierarchicalOrderedListCounters(level)
                : `counter(list-level-${level}, ${style})`;
            return `"${prefix}" ${content} "${suffix}"`;
        };
        const stringNextLevel = String(Number(level));
        styles.push(`${parentListSelector} > li > ol > li::before {
        content: ${buildOrderedListCounters(stringNextLevel, model.hierarchicalListNumbering)};
      }`);
        const bulletStyle = chooseListBulletStyle(model, level);
        styles.push(`${parentListSelector} > li > ul {
        list-style-type: ${bulletStyle};
      }`);
    }
    return styles.join('\n');
};
const orderedListRootStyles = (model) => {
    const styles = [];
    const startIndex = chooseListNumberingStartIndex(model, '1');
    styles.push(`counter-reset: list-level-1 ${startIndex - 1}`);
    styles.push(`> li { counter-increment: list-level-1 }`);
    const style = chooseListNumberingStyle(model, '1');
    const prefix = chooseListNumberingPrefix(model, '1');
    const suffix = chooseListNumberingSuffix(model, '1');
    styles.push(`> li::before {
      content: "${prefix}" counter(list-level-1, ${style}) "${suffix}";
    }`);
    return styles.join(';');
};
const bulletListRootStyles = (model) => {
    const styles = [];
    const listBulletStyle = chooseListBulletStyle(model, '1');
    styles.push(`counter-reset: list-level-1`);
    styles.push(`> li { counter-increment: list-level-1 }`);
    styles.push(`list-style-type: ${listBulletStyle}`);
    return styles.join(';');
};
const marginTop = (model) => model.topSpacing;
const marginBottom = (model) => model.bottomSpacing === undefined
    ? exports.DEFAULT_MARGIN_BOTTOM
    : model.bottomSpacing;
const textIndent = (model) => model.firstLineIndent;
const lineHeight = (model) => model.lineSpacing;
const listIndentPerLevel = (model) => model.listItemIndentPerLevel === undefined
    ? exports.DEFAULT_LIST_INDENT_PER_LEVEL
    : model.listItemIndentPerLevel;
const listIndent = (model) => model.listTailIndent === undefined
    ? exports.DEFAULT_LIST_INDENT
    : model.listTailIndent;
const textAlign = (model) => model.alignment || exports.DEFAULT_ALIGNMENT;
const chooseSectionNumberingSuffix = (model) => {
    const { sectionNumberingStyle } = model;
    if (sectionNumberingStyle) {
        const { suffix } = sectionNumberingStyle;
        if (suffix !== undefined) {
            return suffix;
        }
    }
    return exports.DEFAULT_SECTION_NUMBERING_SUFFIX;
};
const chooseSectionNumberingStyle = (model) => {
    const { sectionNumberingStyle } = model;
    if (sectionNumberingStyle) {
        const { numberingScheme } = sectionNumberingStyle;
        if (numberingScheme) {
            const scheme = exports.sectionNumberingSchemes[numberingScheme];
            if (scheme) {
                return scheme.css;
            }
        }
    }
    return exports.DEFAULT_SECTION_NUMBERING_STYLE;
};
const buildParagraphStyles = (model, colors) => `
      [data-paragraph-style="${model._id}"] {
        font-size: ${fontSize(model)}pt !important;
        font-style: ${fontStyle(model)} !important;
        font-weight: ${fontWeight(model)} !important;
        color: ${paragraphColor(model, colors)} !important;
        text-align: ${textAlign(model)} !important;
        margin-top: ${marginTop(model)}pt !important;
        margin-bottom: ${marginBottom(model)}pt !important;
        line-height: ${lineHeight(model)} !important;
        text-indent: ${textIndent(model)}pt !important;
        ${listStyles(model)}

        ul, ol {
          margin-left: ${listIndentPerLevel(model)}pt;
          padding-left: 0 !important;
        }
      }

      ol[data-paragraph-style="${model._id}"] {
        margin-left: ${listIndent(model)}pt !important;

        ${orderedListRootStyles(model)}
      }

      ul[data-paragraph-style="${model._id}"] {
        margin-left: ${listIndent(model)}pt !important;

        ${bulletListRootStyles(model)}
      }
    `;
exports.buildParagraphStyles = buildParagraphStyles;
const buildInlineStyles = (model) => `
  [data-inline-style="${model._id}"] {
    ${model.style};
  }
`;
exports.buildInlineStyles = buildInlineStyles;
const buildFigureStyles = (model, colors, borderStyles) => `
  [data-figure-style="${model._id}"] {
    ${model.outerBorder &&
    `
      border-color: ${borderColor(model.outerBorder, colors)} !important;
      border-style: ${borderStyle(model.outerBorder, borderStyles)} !important;
      border-width: ${StyleFields_1.valueOrDefault(model.outerBorder.width, exports.DEFAULT_FIGURE_OUTER_BORDER_WIDTH)}pt !important;
    `}

    padding: ${model.outerSpacing || exports.DEFAULT_FIGURE_OUTER_SPACING}pt !important;
    gap: ${model.innerSpacing || exports.DEFAULT_FIGURE_INNER_SPACING}pt !important;

    > figure {
      ${model.innerBorder &&
    `
        border-color: ${borderColor(model.innerBorder, colors)} !important;
        border-style: ${borderStyle(model.innerBorder, borderStyles)} !important;
        border-width: ${StyleFields_1.valueOrDefault(model.innerBorder.width, exports.DEFAULT_FIGURE_INNER_BORDER_WIDTH)}pt !important;
      `}
    }

    > figcaption {
      grid-row: ${
// TODO: implement 'above' and 'below'
model.captionPosition === 'top' || model.captionPosition === 'above'
    ? 1
    : 'caption'} !important;
      text-align: ${model.alignment || exports.DEFAULT_FIGURE_CAPTION_ALIGNMENT} !important;

      > .figure-label {
        display: ${model.labelPosition === 'none' ? 'none' : 'initial'} !important;
      }
    }
  }
`;
exports.buildFigureStyles = buildFigureStyles;
const buildFigureLayoutStyles = (model) => `
  [data-figure-layout="${model._id}"] {
    grid-template-columns: ${model.columns ? `repeat(${model.columns}, 1fr)` : 1} !important;

    grid-template-rows: ${model.rows
    ? `repeat(${model.rows}, minmax(min-content, max-content)) [caption listing] auto`
    : 1} !important;

    .figure-caption {
      display: ${model.rows * model.columns === 1 ? 'none' : 'initial'} !important;
    }
  }
`;
exports.buildFigureLayoutStyles = buildFigureLayoutStyles;
const buildTableStyles = (model, colors, borderStyles) => `
  [data-table-style="${model._id}"] {
    border-collapse: collapse;
    empty-cells: show;
    display: grid;

    tr:first-of-type {
      > td {
        background-color: ${colorValue(colors, model.headerBackgroundColor, exports.DEFAULT_TABLE_HEADER_BACKGROUND_COLOR)} !important;

        ${model.headerTopBorder &&
    `
          border-top-color: ${borderColor(model.headerTopBorder, colors)} !important;
          border-top-style: ${borderStyle(model.headerTopBorder, borderStyles)} !important;
          border-top-width: ${StyleFields_1.valueOrDefault(model.headerTopBorder.width, exports.DEFAULT_TABLE_BORDER_WIDTH)}pt !important;
        `}

        ${model.headerBottomBorder &&
    `
          border-bottom-color: ${borderColor(model.headerBottomBorder, colors)} !important;
          border-bottom-style: ${borderStyle(model.headerBottomBorder, borderStyles)} !important;
          border-bottom-width: ${StyleFields_1.valueOrDefault(model.headerBottomBorder.width, exports.DEFAULT_TABLE_BORDER_WIDTH)}pt !important;
        `}
      }
    }

    tr:last-of-type {
      > td {
        background-color: ${colorValue(colors, model.footerBackgroundColor, exports.DEFAULT_TABLE_FOOTER_BACKGROUND_COLOR)} !important;

        ${model.footerTopBorder &&
    `
          border-top-color: ${borderColor(model.footerTopBorder, colors)} !important;
          border-top-style: ${borderStyle(model.footerTopBorder, borderStyles)} !important;
          border-top-width: ${StyleFields_1.valueOrDefault(model.footerTopBorder.width, exports.DEFAULT_TABLE_BORDER_WIDTH)}pt !important;
        `}

        ${model.footerBottomBorder &&
    `
          border-bottom-color: ${borderColor(model.footerBottomBorder, colors)} !important;
          border-bottom-style: ${borderStyle(model.footerBottomBorder, borderStyles)} !important;
          border-bottom-width: ${StyleFields_1.valueOrDefault(model.footerBottomBorder.width, exports.DEFAULT_TABLE_BORDER_WIDTH)}pt !important;
        `}
      }
    }

    > figcaption {
      grid-row: ${model.captionPosition === 'above' ? 1 : 2} !important;
      text-align: ${model.alignment || exports.DEFAULT_TABLE_CAPTION_ALIGNMENT} !important;
    }
  }`;
exports.buildTableStyles = buildTableStyles;
const headingCounter = (model, depth) => {
    const numberingSuffix = chooseSectionNumberingSuffix(model);
    const numberingStyle = chooseSectionNumberingStyle(model);
    // TODO: iterate over higher levels to get their numbering styles?
    if (numberingStyle === 'none') {
        return '""';
    }
    const content = lodash_es_1.range(1, depth + 1) // end is non-inclusive
        .map((level) => `counter(section-${level}, ${numberingStyle})`)
        .join(' "." ');
    return `${content} "${numberingSuffix} "`;
};
// TODO: use a ParagraphStyle property?
const includeInNumberingSelector = ':not(.toc)';
const buildHeadingStyles = (model, colors, depth) => {
    const sectionSelector = `.ProseMirror ${'> section '.repeat(depth)}`.trim();
    const titleSelector = `${sectionSelector} > .block-section_title > h1`;
    const titleContentSelector = `${sectionSelector}${includeInNumberingSelector} > .block-section_title > h1`;
    const headingCounterContent = headingCounter(model, depth);
    return `
    ${sectionSelector}${includeInNumberingSelector} {
      counter-increment: section-${depth};
      counter-reset: section-${depth + 1};
    }

    ${titleSelector} {
      font-size: ${fontSize(model)}pt !important;
      font-style: ${fontStyle(model)} !important;
      font-weight: ${fontWeight(model)} !important;
      color: ${paragraphColor(model, colors)} !important;
      text-align: ${textAlign(model)};
      margin-top: ${marginTop(model)}pt !important;
      margin-bottom: ${marginBottom(model)}pt !important;
      line-height: ${lineHeight(model)};
      text-indent: ${textIndent(model)}pt;
      display: inline;
    }

    ${titleContentSelector}::before {
      content: ${headingCounterContent};
    }

    ${titleContentSelector}.empty-node[data-placeholder]::before {
      content: ${headingCounterContent} attr(data-placeholder);
    }
  `;
};
exports.buildHeadingStyles = buildHeadingStyles;
// TODO: read default embeddedNumberingStyle from PageLayout?
const findBodyTextParagraphStyles = (modelMap) => {
    const output = [];
    for (const model of modelMap.values()) {
        if (exports.isParagraphStyle(model)) {
            if (model.kind === 'body' && model.prototype !== 'MPParagraphStyle:toc') {
                output.push(model);
            }
        }
    }
    return output;
};
exports.findBodyTextParagraphStyles = findBodyTextParagraphStyles;
const findFigureLayouts = (modelMap) => {
    const output = [];
    for (const model of modelMap.values()) {
        if (exports.isFigureLayout(model)) {
            output.push(model);
        }
    }
    return output.sort(sort_1.ascendingPriority);
};
exports.findFigureLayouts = findFigureLayouts;
const findFigureStyles = (modelMap) => {
    const output = [];
    for (const model of modelMap.values()) {
        if (exports.isFigureStyle(model)) {
            output.push(model);
        }
    }
    return output.sort(sort_1.ascendingPriority);
};
exports.findFigureStyles = findFigureStyles;
const findBorderStyles = (modelMap) => {
    const output = [];
    for (const model of modelMap.values()) {
        if (exports.isBorderStyle(model)) {
            output.push(model);
        }
    }
    return output.sort(sort_1.ascendingPriority);
};
exports.findBorderStyles = findBorderStyles;
const findTableStyles = (modelMap) => {
    const output = [];
    for (const model of modelMap.values()) {
        if (exports.isTableStyle(model)) {
            output.push(model);
        }
    }
    return output;
};
exports.findTableStyles = findTableStyles;
const findInlineStyles = (modelMap) => {
    const output = [];
    for (const model of modelMap.values()) {
        if (exports.isInlineStyle(model)) {
            output.push(model);
        }
    }
    return output.sort(sort_1.ascendingPriority);
};
exports.findInlineStyles = findInlineStyles;
const chooseParagraphStyle = (modelMap, styleName) => {
    for (const model of modelMap.values()) {
        if (exports.isParagraphStyle(model) && model.name === styleName) {
            return model;
        }
    }
};
exports.chooseParagraphStyle = chooseParagraphStyle;
const trackChangesCssSelector = (ids) => {
    return ids.map((id) => `[data-changeid="${id}"]`).join(',\n');
};
exports.trackChangesCssSelector = trackChangesCssSelector;
//# sourceMappingURL=styles.js.map