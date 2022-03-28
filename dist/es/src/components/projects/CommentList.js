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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentList = void 0;
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const Pattern = __importStar(require("./CommentListPatterns"));
const HighlightedText_1 = require("./HighlightedText");
exports.CommentList = react_1.default.memo(({ comments, deleteModel, doc, getCurrentUser, saveModel, selected, createKeyword, getCollaboratorById, getKeyword, listCollaborators, listKeywords, commentTarget, setCommentTarget, state, dispatch, setCommentFilter, commentFilter, }) => {
    const [newComment, setNewComment] = react_1.useState();
    const currentUser = react_1.useMemo(() => getCurrentUser(), [getCurrentUser]);
    react_1.useEffect(() => {
        if (commentTarget && !newComment) {
            const newComment = manuscript_transform_1.buildComment(commentTarget);
            const contribution = manuscript_transform_1.buildContribution(currentUser._id);
            newComment.contributions = [contribution];
            const highlight = manuscript_editor_1.getHighlightTarget(newComment, state);
            if (highlight) {
                newComment.originalText = manuscript_editor_1.getHighlightText(highlight, state);
            }
            setNewComment(newComment);
        }
    }, [commentTarget, getCurrentUser, doc, newComment, state, currentUser]);
    const items = react_1.useMemo(() => {
        const combinedComments = [...comments];
        if (newComment) {
            combinedComments.push(newComment);
        }
        const commentsTreeMap = style_guide_1.buildCommentTree(doc, combinedComments);
        return Array.from(commentsTreeMap.entries());
    }, [comments, newComment, doc]);
    const saveComment = react_1.useCallback((comment) => {
        return saveModel(comment).then((comment) => {
            if (newComment && newComment._id === comment._id) {
                setCommentTarget(undefined);
            }
            return comment;
        });
    }, [newComment, setCommentTarget, saveModel]);
    const deleteComment = react_1.useCallback((id, target) => {
        return deleteModel(id)
            .catch((error) => {
            console.error(error);
        })
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            if (target && target.startsWith('MPHighlight:')) {
                yield deleteModel(target);
            }
        }))
            .catch((error) => {
            console.error(error);
        })
            .finally(() => {
            if (target && target.startsWith('MPHighlight:')) {
                manuscript_editor_1.deleteHighlightMarkers(target, state, dispatch);
            }
            if (newComment && newComment._id === id) {
                setCommentTarget(undefined);
            }
        });
    }, [deleteModel, newComment, setCommentTarget, state, dispatch]);
    const scrollIntoHighlight = (comment) => {
        const el = document.querySelector(`[data-reference-id="${comment.target}"]`);
        if (el) {
            el.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest',
            });
        }
    };
    const isNew = react_1.useCallback((comment) => {
        return newComment ? newComment._id === comment._id : false;
    }, [newComment]);
    const getHighlightTextColor = react_1.useCallback((comment) => {
        let highlight = null;
        try {
            const target = manuscript_editor_1.getHighlightTarget(comment, state);
            highlight = target && manuscript_editor_1.getHighlightText(target, state);
        }
        catch (e) {
            highlight = null;
        }
        return highlight ? '#ffe08b' : '#f9020287';
    }, [state]);
    const can = style_guide_1.usePermissions();
    if (!items.length) {
        return react_1.default.createElement(Pattern.EmptyCommentsListPlaceholder, null);
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Pattern.SeeResolvedCheckbox, { isEmpty: !items.length, commentFilter: commentFilter, setCommentFilter: setCommentFilter }),
        react_1.default.createElement(Pattern.Container, null, items.map(([target, commentData]) => {
            // TODO: move this into a child component?
            const isSelected = (selected &&
                (selected.node.attrs.id === target ||
                    selected.node.attrs.rid === target)) ||
                false;
            const selectedNoteData = commentFilter === Pattern.CommentFilter.ALL
                ? commentData
                : commentData.filter((note) => !note.comment.resolved);
            return (react_1.default.createElement(style_guide_1.CommentTarget, { key: target, isSelected: isSelected }, selectedNoteData.map(({ comment, children }) => (react_1.default.createElement(Pattern.Thread, { key: comment._id },
                react_1.default.createElement(style_guide_1.NoteBodyContainer, { isSelected: isSelected, isNew: isNew(comment) },
                    react_1.default.createElement(style_guide_1.CommentWrapper, { comment: comment, createKeyword: createKeyword, deleteComment: deleteComment, getCollaborator: getCollaboratorById, getKeyword: getKeyword, listCollaborators: listCollaborators, listKeywords: listKeywords, saveComment: saveComment, scrollIntoHighlight: scrollIntoHighlight, handleCreateReply: setCommentTarget, can: can, currentUserId: currentUser._id, handleSetResolved: () => __awaiter(void 0, void 0, void 0, function* () {
                            return yield saveModel(Object.assign(Object.assign({}, comment), { resolved: !comment.resolved }));
                        }), isNew: isNew(comment) },
                        react_1.default.createElement(HighlightedText_1.HighlightedText, { comment: comment, getHighlightTextColor: getHighlightTextColor, onClick: scrollIntoHighlight }))),
                children.map((comment) => (react_1.default.createElement(Pattern.Reply, { key: comment._id },
                    react_1.default.createElement(style_guide_1.ReplyBodyContainer, null,
                        react_1.default.createElement(style_guide_1.CommentWrapper, { comment: comment, createKeyword: createKeyword, deleteComment: deleteComment, getCollaborator: getCollaboratorById, getKeyword: getKeyword, isReply: true, listCollaborators: listCollaborators, listKeywords: listKeywords, saveComment: saveComment, handleCreateReply: setCommentTarget, can: can, currentUserId: currentUser._id, isNew: isNew(comment) }))))))))));
        }))));
});
//# sourceMappingURL=CommentList.js.map