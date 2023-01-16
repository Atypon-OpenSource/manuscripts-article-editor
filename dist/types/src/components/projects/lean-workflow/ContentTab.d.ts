import { EditorState, Transaction } from 'prosemirror-state';
import { ContentNodeWithPos } from 'prosemirror-utils';
import React from 'react';
export declare const ContentTab: React.FC<{
    selected?: ContentNodeWithPos;
    selectedElement?: ContentNodeWithPos;
    selectedSection?: ContentNodeWithPos;
    state: EditorState;
    dispatch: (tr: Transaction) => EditorState;
    hasFocus?: boolean;
}>;
