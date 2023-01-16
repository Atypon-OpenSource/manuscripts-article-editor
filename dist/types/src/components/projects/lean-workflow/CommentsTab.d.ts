import { ContentNodeWithPos } from 'prosemirror-utils';
import React from 'react';
import { useCreateEditor } from '../../../hooks/use-create-editor';
export declare const CommentsTab: React.FC<{
    selected?: ContentNodeWithPos | null;
    editor: ReturnType<typeof useCreateEditor>;
}>;
