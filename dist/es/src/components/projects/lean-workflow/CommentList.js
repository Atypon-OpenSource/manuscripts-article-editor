"use strict";
/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentList = void 0;
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const style_guide_1 = require("@manuscripts/style-guide");
const track_changes_1 = require("@manuscripts/track-changes");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const store_1 = require("../../../store");
const Pattern = __importStar(require("../CommentListPatterns"));
const HighlightedText_1 = require("../HighlightedText");
const isHighlightComment = (comment) => comment.selector && comment.selector.from !== comment.selector.to;
const cleanUpSelectedComment = () => {
    document
        .querySelectorAll(`.selected-comment`)
        .forEach((element) => element.classList.remove('selected-comment'));
};
const CommentList = ({ editor }) => {
    const [{ comments = [], commentTarget, doc, user, collaborators, collaboratorsById, keywords, modelMap, saveTrackModel, deleteTrackModel, }, dispatch,] = store_1.useStore((store) => ({
        comments: store.comments,
        doc: store.doc,
        notes: store.notes,
        user: store.user,
        collaborators: store.collaborators || new Map(),
        collaboratorsById: store.collaboratorsById,
        keywords: store.keywords,
        manuscriptID: store.manuscriptID,
        modelMap: store.modelMap,
        saveTrackModel: store.saveTrackModel,
        deleteTrackModel: store.deleteTrackModel,
        commentTarget: store.commentTarget,
    }));
    const { state, view } = editor;
    const [newComment, setNewComment] = react_1.useState();
    const createKeyword = react_1.useCallback((name) => saveTrackModel(manuscript_transform_1.buildKeyword(name)), [saveTrackModel]);
    const currentUser = react_1.useMemo(() => user, [user]);
    const [commentFilter, setCommentFilter] = react_1.useState(Pattern.CommentFilter.ALL);
    const setCommentTarget = react_1.useCallback((targetId) => dispatch({ commentTarget: targetId && manuscript_transform_1.buildComment(targetId) }), [dispatch]);
    const addComment = react_1.useCallback((comment) => dispatch({ comments: [...comments, comment] }), [comments, dispatch]);
    const updateComments = react_1.useCallback((comment) => dispatch({
        comments: comments.map((c) => (c._id === comment._id && comment) || c),
    }), [comments, dispatch]);
    const removeComment = react_1.useCallback((id) => dispatch({
        comments: comments.filter((c) => c._id !== id),
    }), [comments, dispatch]);
    react_1.useEffect(() => {
        if (commentTarget && commentTarget.target && !newComment) {
            const contribution = manuscript_transform_1.buildContribution(currentUser._id);
            commentTarget.contributions = [contribution];
            if (isHighlightComment(commentTarget)) {
                const highlight = state && manuscript_editor_1.getHighlightTarget(commentTarget, state);
                if (highlight) {
                    // newComment.originalText = getHighlightText(highlight, state)
                    commentTarget.originalText = highlight.text;
                    setNewComment(commentTarget);
                }
            }
            else {
                setNewComment(commentTarget);
            }
        }
    }, [commentTarget, doc, newComment, state, currentUser]);
    /**
     * This map holds all block elements in the editor(citation, figure, table)
     * will be used to show the header of the block comment which is the element label
     */
    const commentsLabels = react_1.useMemo(() => {
        const labelsMap = new Map();
        let graphicalAbstractFigureId = undefined;
        doc.descendants((node) => {
            if (node.type.name === 'citation') {
                labelsMap.set(node.attrs['rid'], node.attrs.contents.trim());
            }
            if (node.attrs['category'] === 'MPSectionCategory:abstract-graphical') {
                node.forEach((node) => {
                    if (node.type.name === 'figure_element') {
                        graphicalAbstractFigureId = node.attrs['id'];
                    }
                });
            }
        });
        const setLabels = (label, elements, excludedElementId) => elements
            .filter((element) => element !== excludedElementId)
            .map((element, index) => labelsMap.set(element, `${label} ${++index}`));
        const elementsOrders = manuscript_transform_1.getModelsByType(modelMap, manuscripts_json_schema_1.ObjectTypes.ElementsOrder);
        elementsOrders.map(({ elementType, elements }) => {
            if (elementType === manuscripts_json_schema_1.ObjectTypes.TableElement ||
                elementType === manuscripts_json_schema_1.ObjectTypes.FigureElement) {
                const label = (elementType === manuscripts_json_schema_1.ObjectTypes.FigureElement && 'Figure') || 'Table';
                setLabels(label, elements, graphicalAbstractFigureId);
            }
        });
        return labelsMap;
    }, [doc, modelMap]);
    const items = react_1.useMemo(() => {
        const combinedComments = [...comments];
        if (newComment) {
            combinedComments.push(newComment);
        }
        const commentsTreeMap = style_guide_1.buildCommentTree(doc, combinedComments);
        console.log(combinedComments, commentsTreeMap);
        return Array.from(commentsTreeMap.entries());
    }, [comments, newComment, doc]);
    const handleSetResolved = react_1.useCallback((comment) => __awaiter(void 0, void 0, void 0, function* () {
        const savedComment = yield saveTrackModel(Object.assign(Object.assign({}, comment), { resolved: !comment.resolved }));
        if (savedComment && savedComment._id === comment._id) {
            updateComments(savedComment);
        }
    }), [saveTrackModel, updateComments]);
    const saveComment = react_1.useCallback((comment) => {
        return saveTrackModel(comment).then((comment) => {
            if (newComment && newComment._id === comment._id) {
                setCommentTarget(undefined);
                setNewComment(undefined);
                addComment(comment);
                if ((view === null || view === void 0 ? void 0 : view.state) && !isHighlightComment(comment)) {
                    manuscript_editor_1.updateCommentAnnotationState(view === null || view === void 0 ? void 0 : view.state, view === null || view === void 0 ? void 0 : view.dispatch);
                }
            }
            else {
                updateComments(comment);
            }
            return comment;
        });
    }, [
        saveTrackModel,
        newComment,
        setCommentTarget,
        addComment,
        view === null || view === void 0 ? void 0 : view.state,
        view === null || view === void 0 ? void 0 : view.dispatch,
        updateComments,
    ]);
    const deleteComment = react_1.useCallback((id) => {
        const comment = newComment || modelMap.get(id);
        return deleteTrackModel(id)
            .then(() => {
            removeComment(id);
        })
            .finally(() => {
            var _a, _b;
            if (((_a = comment.selector) === null || _a === void 0 ? void 0 : _a.from) !== ((_b = comment.selector) === null || _b === void 0 ? void 0 : _b.to)) {
                view && manuscript_editor_1.deleteHighlightMarkers(id)(view.state, view.dispatch);
            }
            if (newComment && newComment._id === id) {
                setCommentTarget(undefined);
                setNewComment(undefined);
            }
            if ((view === null || view === void 0 ? void 0 : view.state) && !isHighlightComment(comment)) {
                manuscript_editor_1.updateCommentAnnotationState(view === null || view === void 0 ? void 0 : view.state, view === null || view === void 0 ? void 0 : view.dispatch);
            }
            cleanUpSelectedComment();
            setSelectedHighlightId(undefined);
        });
    }, [
        deleteTrackModel,
        modelMap,
        newComment,
        removeComment,
        setCommentTarget,
        view,
    ]);
    const [selectedHighlightId, setSelectedHighlightId] = react_1.useState();
    /**
     * check if the selection pointing to a highlight node
     */
    react_1.useEffect(() => {
        const numberOfChildren = state.selection.$from.parent.content.childCount;
        const nodeIndex = state.selection.$from.index();
        if (track_changes_1.isTextSelection(state.selection) && numberOfChildren > nodeIndex) {
            const nodeBeforePos = state.selection.$from.posAtIndex(nodeIndex - 1);
            const nodeAfterPos = state.selection.$from.posAtIndex(nodeIndex + 1);
            const nodeBeforeNode = state.doc.nodeAt(nodeBeforePos);
            const nodeAfterNode = state.doc.nodeAt(nodeAfterPos);
            if (nodeBeforeNode &&
                nodeAfterNode &&
                nodeBeforeNode.type === state.schema.nodes.highlight_marker &&
                nodeAfterNode.type === state.schema.nodes.highlight_marker) {
                setSelectedHighlightId(nodeAfterNode.attrs.id);
                return;
            }
        }
        setSelectedHighlightId(undefined);
    }, [state]);
    react_1.useEffect(() => {
        if (selectedHighlightId) {
            manuscript_editor_1.commentScroll(selectedHighlightId, 'inspector', true);
        }
    }, [selectedHighlightId]);
    const scrollIntoHighlight = (comment) => {
        const commentId = comment.selector ? comment._id : comment.target;
        manuscript_editor_1.commentScroll(commentId, 'editor', isHighlightComment(comment));
        setSelectedHighlightId(undefined);
    };
    const isNew = react_1.useCallback((comment) => {
        return newComment ? newComment._id === comment._id : false;
    }, [newComment]);
    const getHighlightTextColor = react_1.useCallback((comment) => {
        if (!isHighlightComment(comment)) {
            return '#ffe08b';
        }
        let highlight = null;
        try {
            const target = state && manuscript_editor_1.getHighlightTarget(comment, state);
            highlight = target; // && getHighlightText(target, state)
        }
        catch (e) {
            highlight = null;
        }
        return highlight ? '#ffe08b' : '#f9020287';
    }, [state]);
    const getHighlightComment = react_1.useCallback((comment) => {
        if (commentsLabels.has(comment.target)) {
            return Object.assign(Object.assign({}, comment), { originalText: commentsLabels.get(comment.target) });
        }
        return comment;
    }, [commentsLabels]);
    const can = style_guide_1.usePermissions();
    if (!items.length) {
        return react_1.default.createElement(Pattern.EmptyCommentsListPlaceholder, null);
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Pattern.SeeResolvedCheckbox, { isEmpty: !items.length, commentFilter: commentFilter, setCommentFilter: setCommentFilter }),
        react_1.default.createElement(Container, { className: 'comments-group' }, items.map(([target, commentData]) => {
            // TODO: move this into a child component?
            const selectedNoteData = commentFilter === Pattern.CommentFilter.ALL
                ? commentData
                : commentData.filter((note) => !note.comment.resolved);
            console.log(selectedNoteData);
            return (react_1.default.createElement(style_guide_1.CommentTarget, { key: target, isSelected: false }, selectedNoteData.map(({ comment, children }) => (react_1.default.createElement(Pattern.Thread, { key: comment._id },
                react_1.default.createElement(style_guide_1.NoteBodyContainer, { id: comment.selector ? comment._id : comment.target, isSelected: false, isNew: isNew(comment) },
                    react_1.default.createElement(style_guide_1.CommentWrapper, { comment: comment, createKeyword: createKeyword, deleteComment: deleteComment, getCollaborator: (id) => collaboratorsById === null || collaboratorsById === void 0 ? void 0 : collaboratorsById.get(id), getKeyword: (id) => keywords.get(id), listCollaborators: () => Array.from(collaborators.values()), listKeywords: keywords, saveComment: saveComment, scrollIntoHighlight: scrollIntoHighlight, handleCreateReply: setCommentTarget, can: can, currentUserId: currentUser._id, handleSetResolved: () => handleSetResolved(comment), isNew: isNew(comment) },
                        react_1.default.createElement(HighlightedText_1.HighlightedText, { comment: getHighlightComment(comment), getHighlightTextColor: getHighlightTextColor, onClick: scrollIntoHighlight }))),
                children.map((comment) => (react_1.default.createElement(style_guide_1.ReplyBodyContainer, { key: comment._id },
                    react_1.default.createElement(style_guide_1.CommentWrapper, { comment: comment, createKeyword: createKeyword, deleteComment: deleteComment, getCollaborator: (id) => collaboratorsById === null || collaboratorsById === void 0 ? void 0 : collaboratorsById.get(id), getKeyword: (key) => keywords.get(key), isReply: true, listCollaborators: () => Array.from(collaborators.values()), listKeywords: keywords, saveComment: saveComment, handleCreateReply: setCommentTarget, can: can, currentUserId: currentUser._id, isNew: isNew(comment) })))))))));
        }))));
};
exports.CommentList = CommentList;
const Container = styled_components_1.default(Pattern.Container) `
  .selected-comment {
    border: 1px solid ${(props) => props.theme.colors.border.primary};
    border-left: 4px solid ${(props) => props.theme.colors.border.primary};
    background: ${(props) => props.theme.colors.background.selected};
  }
`;
//# sourceMappingURL=CommentList.js.map