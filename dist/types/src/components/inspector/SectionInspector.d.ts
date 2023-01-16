import { Build, SectionNode } from '@manuscripts/manuscript-transform';
import { MaximumSectionCharacterCountRequirement, MaximumSectionWordCountRequirement, MinimumSectionCharacterCountRequirement, MinimumSectionWordCountRequirement, Section } from '@manuscripts/manuscripts-json-schema';
import { EditorState, Transaction } from 'prosemirror-state';
import React from 'react';
import { SectionCountRequirementMaps } from '../../lib/requirements';
declare type Buildable<T> = T | Build<T>;
export interface SectionCountRequirements {
    minWordCount: Buildable<MinimumSectionWordCountRequirement>;
    maxWordCount: Buildable<MaximumSectionWordCountRequirement>;
    minCharCount: Buildable<MinimumSectionCharacterCountRequirement>;
    maxCharacterCount: Buildable<MaximumSectionCharacterCountRequirement>;
}
export declare const SectionInspector: React.FC<{
    dispatchNodeAttrs: (id: string, attrs: Record<string, unknown>, nodispatch?: boolean) => Transaction | undefined;
    section: Section;
    sectionNode?: SectionNode;
    state: EditorState;
    dispatch: (tr: Transaction) => EditorState | void;
    getSectionCountRequirements: (templateID: string) => SectionCountRequirementMaps;
}>;
export {};
