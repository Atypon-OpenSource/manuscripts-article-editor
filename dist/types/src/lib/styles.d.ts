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
import { AuxiliaryObjectReferenceStyle, BorderStyle, CaptionStyle, Color, ColorScheme, FigureLayout, FigureStyle, InlineStyle, Model, PageLayout, ParagraphStyle, TableStyle } from '@manuscripts/manuscripts-json-schema';
import { Property } from 'csstype';
export declare const DEFAULT_ALIGNMENT = "left";
export declare const DEFAULT_COLOR = "#000";
export declare const DEFAULT_FIGURE_ALIGNMENT = "center";
export declare const DEFAULT_FIGURE_CAPTION_ALIGNMENT = "center";
export declare const DEFAULT_FIGURE_CAPTION_POSITION: FigureCaptionPosition;
export declare const DEFAULT_FIGURE_INNER_BORDER_WIDTH = 1;
export declare const DEFAULT_FIGURE_INNER_SPACING = 4;
export declare const DEFAULT_FIGURE_LABEL_POSITION: FigureLabelPosition;
export declare const DEFAULT_FIGURE_OUTER_BORDER_WIDTH = 1;
export declare const DEFAULT_FIGURE_OUTER_SPACING = 4;
export declare const DEFAULT_FIGURE_WIDTH = 1;
export declare const DEFAULT_FONT_SIZE = 12;
export declare const DEFAULT_LINE_HEIGHT = 1.5;
export declare const DEFAULT_LIST_BULLET_STYLE = "disc";
export declare const DEFAULT_LIST_INDENT = 0;
export declare const DEFAULT_LIST_INDENT_PER_LEVEL = 20;
export declare const DEFAULT_LIST_NUMBERING_STYLE = "decimal";
export declare const DEFAULT_LIST_NUMBERING_PREFIX = "";
export declare const DEFAULT_LIST_NUMBERING_SUFFIX = ".";
export declare const DEFAULT_LIST_START_INDEX = 1;
export declare const DEFAULT_MARGIN_BOTTOM = 0;
export declare const DEFAULT_MARGIN_TOP = 12;
export declare const DEFAULT_PART_OF_TOC = true;
export declare const DEFAULT_SECTION_NUMBERING_STYLE = "decimal";
export declare const DEFAULT_SECTION_START_INDEX = 1;
export declare const DEFAULT_SECTION_NUMBERING_SUFFIX = ".";
export declare const DEFAULT_TABLE_BORDER_WIDTH = 1;
export declare const DEFAULT_TABLE_CAPTION_ALIGNMENT = "center";
export declare const DEFAULT_TABLE_CAPTION_POSITION: TableCaptionPosition;
export declare const DEFAULT_TABLE_FOOTER_BACKGROUND_COLOR = "#eee";
export declare const DEFAULT_TABLE_HEADER_BACKGROUND_COLOR = "#eee";
export declare const DEFAULT_TEXT_INDENT = 0;
export declare const isParagraphStyle: (model: Model) => model is ParagraphStyle;
export declare const isFigureStyle: (model: Model) => model is FigureStyle;
export declare const isBorderStyle: (model: Model) => model is BorderStyle;
export declare const isTableStyle: (model: Model) => model is TableStyle;
export declare const isInlineStyle: (model: Model) => model is InlineStyle;
export declare const isFigureLayout: (model: Model) => model is FigureLayout;
export declare type Style = AuxiliaryObjectReferenceStyle | BorderStyle | CaptionStyle | Color | ColorScheme | FigureLayout | FigureStyle | PageLayout | ParagraphStyle | TableStyle;
export declare type FigureCaptionPosition = 'top' | 'bottom';
export declare const figureCaptionPositions: {
    [key in FigureCaptionPosition]: {
        label: string;
    };
};
export declare type FigureLabelPosition = 'inline' | 'none';
export declare const figureLabelPositions: {
    [key in FigureLabelPosition]: {
        label: string;
    };
};
export declare type TableCaptionPosition = 'above' | 'below';
export declare const tableCaptionPositions: {
    [key in TableCaptionPosition]: {
        label: string;
    };
};
export declare type CaptionAlignment = 'left' | 'right' | 'center' | 'justify';
export declare const captionAlignments: {
    [key in CaptionAlignment]: {
        label: string;
    };
};
export declare type Alignment = 'left' | 'right' | 'center' | 'justify';
export declare const alignments: {
    [key in Alignment]: {
        css: Property.TextAlign;
        label: string;
    };
};
export declare type FigureAlignment = 'left' | 'right' | 'center';
export declare const figureAlignments: {
    [key in FigureAlignment]: {
        css: Property.TextAlign;
        label: string;
    };
};
export declare const listLevels: string[];
export declare type ListBulletStyle = 'disc' | 'circle' | 'square' | 'none';
export declare const listBulletStyles: {
    [key in ListBulletStyle]: {
        css: Property.ListStyleType;
        label: string;
    };
};
export declare type ListNumberingScheme = 'none' | 'decimal' | 'decimal-with-leading-zero' | 'lowercase-latin' | 'uppercase-latin' | 'uppercase-roman' | 'lowercase-roman' | 'lowercase-greek';
export declare const listNumberingSchemes: {
    [key in ListNumberingScheme]: {
        css: Property.ListStyleType;
        label: string;
    };
};
export declare type SectionNumberingScheme = 'none' | 'decimal';
export declare const sectionNumberingSchemes: {
    [key in SectionNumberingScheme]: {
        css: Property.ListStyleType;
        label: string;
    };
};
export declare const buildParagraphStyles: (model: ParagraphStyle, colors: Map<string, Color>) => string;
export declare const buildInlineStyles: (model: InlineStyle) => string;
export declare const buildFigureStyles: (model: FigureStyle, colors: Map<string, Color>, borderStyles: Map<string, BorderStyle>) => string;
export declare const buildFigureLayoutStyles: (model: FigureLayout) => string;
export declare const buildTableStyles: (model: TableStyle, colors: Map<string, Color>, borderStyles: Map<string, BorderStyle>) => string;
export declare const buildHeadingStyles: (model: ParagraphStyle, colors: Map<string, Color>, depth: number) => string;
export declare const findBodyTextParagraphStyles: (modelMap: Map<string, Model>) => ParagraphStyle[];
export declare const findFigureLayouts: (modelMap: Map<string, Model>) => FigureLayout[];
export declare const findFigureStyles: (modelMap: Map<string, Model>) => FigureStyle[];
export declare const findBorderStyles: (modelMap: Map<string, Model>) => BorderStyle[];
export declare const findTableStyles: (modelMap: Map<string, Model>) => TableStyle[];
export declare const findInlineStyles: (modelMap: Map<string, Model>) => InlineStyle[];
export declare const chooseParagraphStyle: (modelMap: Map<string, Model>, styleName: string) => ParagraphStyle | undefined;
export declare const trackChangesCssSelector: (ids: string[]) => string;
