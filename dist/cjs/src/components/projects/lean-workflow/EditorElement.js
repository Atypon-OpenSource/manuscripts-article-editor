"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2021 Atypon Systems LLC. All Rights Reserved.
 */
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const style_guide_1 = require("@manuscripts/style-guide");
const track_changes_1 = require("@manuscripts/track-changes");
const prosemirror_state_1 = require("prosemirror-state");
const react_1 = __importStar(require("react"));
const react_dnd_1 = require("react-dnd");
const node_attrs_1 = require("../../../lib/node-attrs");
const store_1 = require("../../../store");
const Icons_1 = require("../../track/Icons");
const EditorElement = ({ editor, accept, reject }) => {
    const [modelMap] = store_1.useStore((store) => store.modelMap);
    const { onRender, view, dispatch } = editor;
    const [error, setError] = react_1.useState('');
    const handleError = (e) => {
        console.log(e);
        setError(e);
    };
    // const {
    //   handleChangeAttachmentDesignation: changeAttachmentDesignation,
    // } = useFileHandling()
    // TODO:: remove this as we are not going to use designation
    const changeAttachmentDesignation = (s, d, name) => Promise.resolve({});
    const [submissionId] = store_1.useStore((store) => store.submissionID || '');
    const [, drop] = react_dnd_1.useDrop({
        accept: 'FileSectionItem',
        drop: (item, monitor) => {
            const offset = monitor.getSourceClientOffset();
            if (offset && offset.x && offset.y && view) {
                const docPos = view.posAtCoords({ left: offset.x, top: offset.y });
                // @ts-expect-error: Ignoring default type from the React DnD plugin. Seems to be unreachable
                const externalFile = item.externalFile;
                if (!externalFile || !docPos || !docPos.pos) {
                    return;
                }
                changeAttachmentDesignation(submissionId, 'figure', externalFile.filename)
                    .then((result) => {
                    var _a;
                    if (((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.setAttachmentType) === false) {
                        return handleError('Store declined designation change');
                    }
                    const resolvedPos = view.state.doc.resolve(docPos.pos);
                    if (resolvedPos.parent.type === manuscript_transform_1.schema.nodes.figure) {
                        const figure = modelMap.get(resolvedPos.parent.attrs.id);
                        // @ts-ignore
                        figure.externalFileReferences = manuscript_editor_1.addExternalFileRef(figure.externalFileReferences, externalFile.publicUrl);
                        node_attrs_1.setNodeAttrs(view.state, dispatch, figure._id, {
                            src: externalFile.publicUrl,
                            externalFileReferences: figure.externalFileReferences,
                        });
                    }
                    else {
                        const transaction = view.state.tr.setSelection(new prosemirror_state_1.NodeSelection(resolvedPos));
                        view.focus();
                        dispatch(transaction);
                        // after dispatch is called - the view.state changes and becomes the new state of the editor so exactly the view.state has to be used to make changes on the actual state
                        manuscript_editor_1.insertFileAsFigure(externalFile, view.state, dispatch);
                    }
                })
                    .catch(handleError);
            }
        },
    });
    const handleEditorClick = react_1.useCallback((e) => {
        const button = e.target && e.target.closest('button');
        if (!button) {
            return;
        }
        const action = button.getAttribute('data-action');
        const changeId = button.getAttribute('data-changeid');
        const uid = button.getAttribute('data-uid');
        if (!action) {
            return;
        }
        else if (action === 'accept') {
            accept((corr) => corr.commitChangeID === changeId);
        }
        else if (action === 'reject') {
            reject((corr) => corr.commitChangeID === changeId);
        }
        else if (action === 'select-comment') {
            if (!uid) {
                return;
            }
            editor.doCommand(track_changes_1.commands.focusAnnotation(uid));
        }
    }, [accept, reject, editor]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        error && (react_1.default.createElement(style_guide_1.Dialog, { isOpen: true, category: style_guide_1.Category.error, header: 'Designation change error', message: 'Unable to set this file to be a figure', actions: {
                primary: {
                    action: () => setError(''),
                },
            } })),
        react_1.default.createElement(Icons_1.SpriteMap, { color: "#353535" }),
        react_1.default.createElement("div", { id: "editorDropzone", ref: drop, onClick: handleEditorClick },
            react_1.default.createElement("div", { id: "editor", ref: onRender }))));
};
exports.default = EditorElement;
//# sourceMappingURL=EditorElement.js.map