import { Build } from '@manuscripts/manuscript-transform';
import { BibliographyItem, Citation, CommentAnnotation, Model } from '@manuscripts/manuscripts-json-schema';
import { Title } from '@manuscripts/title-editor';
import React from 'react';
export declare const CitedItemTitle: import("styled-components").StyledComponent<typeof Title, import("styled-components").DefaultTheme, {
    withOverflow?: boolean | undefined;
}, never>;
export declare const CitedItemMetadata: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
interface Props {
    filterLibraryItems: (query: string) => Promise<BibliographyItem[]>;
    setLibraryItem: (item: BibliographyItem) => void;
    removeLibraryItem: (id: string) => void;
    saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>;
    deleteModel: (id: string) => Promise<string>;
    modelMap: Map<string, Model>;
    importItems: (items: BibliographyItem[]) => Promise<BibliographyItem[]>;
    handleCancel: () => void;
    handleCite: (items: BibliographyItem[], query?: string) => Promise<void>;
    handleClose: () => void;
    handleRemove: (id: string) => void;
    items: BibliographyItem[];
    projectID: string;
    scheduleUpdate: () => void;
    selectedText: string;
    citation: Citation;
    updateCitation: (data: Partial<Citation>) => Promise<void>;
    setCommentTarget: (commentTarget: CommentAnnotation) => void;
    updatePopper: () => void;
}
declare const CitationEditor: React.FC<Props>;
export default CitationEditor;
