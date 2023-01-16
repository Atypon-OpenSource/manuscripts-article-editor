import { BibliographyItem, Model } from '@manuscripts/manuscripts-json-schema';
import React from 'react';
import { ReferenceFormValues } from './ReferenceForm';
export declare const CitationModel: React.FC<{
    editCitation: boolean;
    modelMap: Map<string, Model>;
    saveCallback: (item?: ReferenceFormValues) => void;
    deleteCallback: () => void;
    selectedItem?: BibliographyItem;
    setSelectedItem: React.Dispatch<React.SetStateAction<BibliographyItem>>;
    setShowEditModel: React.Dispatch<React.SetStateAction<boolean>>;
    getReferences: (query?: string) => Promise<BibliographyItem[]>;
}>;
export declare const Legend: import("styled-components").StyledComponent<"legend", import("styled-components").DefaultTheme, {}, never>;
export declare const Fields: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const Label: import("styled-components").StyledComponent<"label", import("styled-components").DefaultTheme, {}, never>;
export declare const Container: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const Fieldset: import("styled-components").StyledComponent<"fieldset", import("styled-components").DefaultTheme, {}, never>;
