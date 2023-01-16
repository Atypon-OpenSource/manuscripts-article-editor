"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEditorStore = void 0;
const track_changes_plugin_1 = require("@manuscripts/track-changes-plugin");
const prosemirror_state_1 = require("prosemirror-state");
const zustand_1 = __importDefault(require("zustand"));
const middleware_1 = require("zustand/middleware");
function getState(state) {
    if (state.view === undefined || state.editorState === undefined) {
        throw Error('Trying to access uninitialized useEditorStore');
    }
    return state;
}
exports.useEditorStore = zustand_1.default(middleware_1.combine({
    view: undefined,
    editorState: undefined,
    trackState: undefined,
}, (set, get) => ({
    init(view) {
        const editorState = view.state, trackState = track_changes_plugin_1.trackChangesPluginKey.getState(view.state);
        set({ view, editorState, trackState });
    },
    state: () => getState(get()),
    execCmd(cmd) {
        const { view } = getState(get());
        cmd(view.state, view.dispatch);
    },
    docToJSON() {
        return getState(get()).editorState.doc.toJSON();
    },
    hydrateDocFromJSON(doc) {
        const { view } = getState(get());
        const state = prosemirror_state_1.EditorState.create({
            doc: view.state.schema.nodeFromJSON(doc),
            plugins: view.state.plugins,
        });
        view.updateState(state);
        set({ editorState: state });
    },
    setEditorState(newState) {
        const state = {
            editorState: newState,
            trackState: track_changes_plugin_1.trackChangesPluginKey.getState(newState),
        };
        set(state);
        return state;
    },
})));
//# sourceMappingURL=useEditorStore.js.map