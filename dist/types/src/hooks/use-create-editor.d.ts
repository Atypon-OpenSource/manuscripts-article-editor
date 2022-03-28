import { ManuscriptSchema } from '@manuscripts/manuscript-transform';
interface Permissions {
    write: boolean;
}
export declare const useCreateEditor: (permissions: Permissions) => {
    state: import("prosemirror-state").EditorState<ManuscriptSchema>;
    onRender: (el: HTMLDivElement | null) => void;
    isCommandValid: (command: import("prosemirror-commands").Command<ManuscriptSchema>) => boolean;
    doCommand: (command: import("prosemirror-commands").Command<ManuscriptSchema>) => boolean;
    replaceState: (state: import("prosemirror-state").EditorState<any>) => void;
    replaceView: (state: import("prosemirror-state").EditorState<any>, createView: import("@manuscripts/manuscript-editor/dist/types/useEditor").CreateView) => void;
    view: import("prosemirror-view").EditorView<any> | undefined;
    dispatch: (tr: import("prosemirror-state").Transaction<any>) => import("prosemirror-state").EditorState<ManuscriptSchema>;
};
export {};
