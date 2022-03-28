import { Manuscript, Section } from '@manuscripts/manuscripts-json-schema';
import React from 'react';
import { AnyElement } from '../inspector/ElementStyleInspector';
export declare const OptionWrapper: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {
    focused?: boolean | undefined;
}, never>;
export declare const OuterContainer: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const Container: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const EditingPopper: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const TagsInput: React.FC<{
    target: AnyElement | Section | Manuscript;
}>;
