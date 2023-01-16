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
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const style_guide_1 = require("@manuscripts/style-guide");
const track_changes_plugin_1 = require("@manuscripts/track-changes-plugin");
const prosemirror_state_1 = require("prosemirror-state");
const react_1 = __importStar(require("react"));
const react_dnd_1 = require("react-dnd");
const node_attrs_1 = require("../../../lib/node-attrs");
const store_1 = require("../../../store");
const Icons_1 = require("../../track-changes/suggestion-list/Icons");
const useEditorStore_1 = require("../../track-changes/useEditorStore");
const EditorElement = ({ editor }) => {
    const { onRender, view, dispatch } = editor;
    const [error, setError] = react_1.useState('');
    const [{ modelMap, deleteModel }] = store_1.useStore((store) => ({
        modelMap: store.modelMap,
        deleteModel: store.deleteModel,
    }));
    const { execCmd, trackState } = useEditorStore_1.useEditorStore();
    const [, drop] = react_dnd_1.useDrop({
        accept: 'FileSectionItem',
        drop: (item, monitor) => {
            const offset = monitor.getSourceClientOffset();
            if (offset && offset.x && offset.y && view) {
                const docPos = view.posAtCoords({ left: offset.x, top: offset.y });
                // @ts-expect-error: Ignoring default type from the React DnD plugin. Seems to be unreachable
                const attachment = item.externalFile;
                if (!attachment || !docPos || !docPos.pos) {
                    return;
                }
                const resolvedPos = view.state.doc.resolve(docPos.pos);
                const attrs = {
                    src: attachment.link,
                    label: attachment.name,
                    externalFileReferences: [
                        {
                            url: `attachment:${attachment.id}`,
                            kind: 'imageRepresentation',
                            ref: attachment,
                        },
                    ],
                };
                switch (resolvedPos.parent.type) {
                    case manuscript_transform_1.schema.nodes.figure: {
                        const figure = resolvedPos.parent;
                        if (isEmptyFigureNode(figure)) {
                            node_attrs_1.setNodeAttrs(view.state, dispatch, figure.attrs.id, attrs);
                        }
                        else {
                            addNewFigure(view, dispatch, attrs, resolvedPos.pos + 1);
                        }
                        return deleteSupplementFile(deleteModel, modelMap, attachment);
                    }
                    case manuscript_transform_1.schema.nodes.figcaption:
                    case manuscript_transform_1.schema.nodes.caption:
                    case manuscript_transform_1.schema.nodes.caption_title: {
                        addFigureAtFigCaptionPosition(editor, resolvedPos.parent, resolvedPos.pos, attrs, new prosemirror_state_1.NodeSelection(resolvedPos), attachment);
                        return deleteSupplementFile(deleteModel, modelMap, attachment);
                    }
                    case manuscript_transform_1.schema.nodes.figure_element: {
                        addFigureAtFigureElementPosition(editor, resolvedPos.parent, resolvedPos.pos, attrs);
                        return deleteSupplementFile(deleteModel, modelMap, attachment);
                    }
                    default: {
                        const transaction = view.state.tr.setSelection(new prosemirror_state_1.NodeSelection(resolvedPos));
                        view.focus();
                        dispatch(transaction);
                        // after dispatch is called - the view.state changes and becomes the new state of the editor so exactly the view.state has to be used to make changes on the actual state
                        manuscript_editor_1.insertFileAsFigure(attachment, view.state, dispatch);
                        return deleteSupplementFile(deleteModel, modelMap, attachment);
                    }
                }
            }
        },
    });
    const handleAcceptChange = react_1.useCallback((c) => {
        const ids = [c.id];
        if (c.type === 'node-change') {
            c.children.forEach((child) => {
                ids.push(child.id);
            });
        }
        execCmd(track_changes_plugin_1.trackCommands.setChangeStatuses(track_changes_plugin_1.CHANGE_STATUS.accepted, ids));
    }, [execCmd]);
    const handleRejectChange = react_1.useCallback((c) => {
        const ids = [c.id];
        if (c.type === 'node-change') {
            c.children.forEach((child) => {
                ids.push(child.id);
            });
        }
        execCmd(track_changes_plugin_1.trackCommands.setChangeStatuses(track_changes_plugin_1.CHANGE_STATUS.rejected, ids));
    }, [execCmd]);
    const handleEditorClick = react_1.useCallback((e) => {
        const button = e.target && e.target.closest('button');
        if (!button) {
            return;
        }
        if (!trackState) {
            return;
        }
        const { changeSet } = trackState;
        const action = button.getAttribute('data-action');
        const changeId = button.getAttribute('data-changeid');
        if (action && changeId) {
            const change = changeSet.changes.find((c) => c.id == changeId);
            if (change) {
                if (action === 'accept') {
                    handleAcceptChange(change);
                }
                else if (action === 'reject') {
                    handleRejectChange(change);
                }
            }
        }
    }, [handleAcceptChange, handleRejectChange, trackState]);
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
/**
 *   Will get figureElement node and position of figcaption.
 *   then check if the current figure empty to update it's external file.
 *   if not will add a new Figure above figcaption node
 */
const addFigureAtFigCaptionPosition = (editor, node, pos, attrs, nodeSelection, attachment) => {
    const { view, dispatch } = editor;
    if (!view) {
        return;
    }
    const getFigureElementWithFigcaptionPos = () => {
        var _a;
        let figureElement, figcaptionPos;
        if (node.type === manuscript_transform_1.schema.nodes.caption ||
            node.type === manuscript_transform_1.schema.nodes.caption_title) {
            const figcaptionPos = (_a = manuscript_editor_1.findParentElement(prosemirror_state_1.NodeSelection.create(view.state.doc, pos))) === null || _a === void 0 ? void 0 : _a.start;
            figureElement = figcaptionPos
                ? manuscript_editor_1.findParentElement(prosemirror_state_1.NodeSelection.create(view.state.doc, figcaptionPos))
                : undefined;
        }
        else {
            figureElement = manuscript_editor_1.findParentElement(prosemirror_state_1.NodeSelection.create(view.state.doc, pos));
        }
        if (!figureElement ||
            (figureElement === null || figureElement === void 0 ? void 0 : figureElement.node.type) !== manuscript_transform_1.schema.nodes.figure_element) {
            return undefined;
        }
        figureElement.node.forEach((node, pos) => {
            if (node.type === manuscript_transform_1.schema.nodes.figcaption) {
                figcaptionPos = pos;
            }
        });
        return figcaptionPos
            ? {
                node: figureElement.node,
                pos: figureElement.pos + figcaptionPos,
            }
            : undefined;
    };
    const nodeWithPos = getFigureElementWithFigcaptionPos();
    if (nodeWithPos) {
        const figure = manuscript_editor_1.getMatchingChild(nodeWithPos.node, (node) => node.type === node.type.schema.nodes.figure);
        if (isEmptyFigureNode(figure)) {
            node_attrs_1.setNodeAttrs(view.state, dispatch, figure.attrs.id, attrs);
        }
        else {
            addNewFigure(view, dispatch, attrs, nodeWithPos.pos);
        }
    }
    else {
        const transaction = view.state.tr.setSelection(nodeSelection);
        view.focus();
        dispatch(transaction);
        manuscript_editor_1.insertFileAsFigure(attachment, view.state, dispatch);
    }
};
/**
 *  Will update figure external file if it's empty,
 *  or add a new figure to the figure_element
 */
const addFigureAtFigureElementPosition = (editor, node, pos, attrs) => {
    const { view, dispatch } = editor;
    if (!view) {
        return;
    }
    let figcaptionPos = 0, figureElementPos = 0;
    node.descendants((node, nodePos) => {
        var _a;
        if (node.type === manuscript_transform_1.schema.nodes.figcaption) {
            figcaptionPos = nodePos;
            figureElementPos =
                ((_a = manuscript_editor_1.findParentElement(prosemirror_state_1.NodeSelection.create(view.state.doc, pos))) === null || _a === void 0 ? void 0 : _a.start) || 0;
        }
    });
    const figure = manuscript_editor_1.getMatchingChild(node, (node) => node.type === node.type.schema.nodes.figure);
    if (isEmptyFigureNode(figure)) {
        node_attrs_1.setNodeAttrs(view.state, dispatch, figure.attrs.id, attrs);
    }
    else {
        addNewFigure(view, dispatch, attrs, figcaptionPos + figureElementPos);
    }
};
const isEmptyFigureNode = (figure) => figure.attrs.src.trim().length < 1;
const addNewFigure = (view, dispatch, attrs, pos) => {
    const figure = view.state.schema.nodes.figure.createAndFill(Object.assign(Object.assign({}, attrs), { id: manuscript_transform_1.generateID(manuscripts_json_schema_1.ObjectTypes.Figure) }));
    const tr = view.state.tr.insert(pos, figure);
    dispatch(tr);
};
const deleteSupplementFile = (deleteModel, modelMap, attachment) => {
    const supplement = manuscript_transform_1.getModelsByType(modelMap, manuscripts_json_schema_1.ObjectTypes.Supplement).find((object) => object.href === `attachment:${attachment.id}`);
    if (supplement) {
        return deleteModel(supplement._id);
    }
};
exports.default = EditorElement;
//# sourceMappingURL=EditorElement.js.map