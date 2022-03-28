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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsList = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const use_comments_1 = require("../../../hooks/use-comments");
const Pattern = __importStar(require("../CommentListPatterns"));
const HighlightedText_1 = require("../HighlightedText");
const CommentsList = ({ createKeyword, getCollaboratorById, getKeyword, listCollaborators, listKeywords, commentController, }) => {
    const [commentFilter, setCommentFilter] = react_1.useState(Pattern.CommentFilter.UNRESOLVED);
    const can = style_guide_1.usePermissions();
    const { items, focusedItem, saveComment, deleteComment, handleCreateReply, handleRequestSelect, } = commentController;
    const getHighlightTextColor = (comment) => comment.annotationColor || 'rgb(250, 244, 150)';
    const threads = use_comments_1.topLevelComments(items, commentFilter);
    if (!items.length) {
        return react_1.default.createElement(Pattern.EmptyCommentsListPlaceholder, null);
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Pattern.SeeResolvedCheckbox, { isEmpty: !items.length, commentFilter: commentFilter, setCommentFilter: setCommentFilter }),
        react_1.default.createElement(Pattern.Container, null, threads.map(({ comment }) => {
            return (react_1.default.createElement(Pattern.Thread, { key: comment._id },
                react_1.default.createElement(style_guide_1.NoteBodyContainer, { isSelected: focusedItem === comment.target, isNew: !use_comments_1.isSavedComment(comment) },
                    react_1.default.createElement(style_guide_1.CommentWrapper, { comment: comment, createKeyword: createKeyword, deleteComment: deleteComment, getCollaborator: getCollaboratorById, getKeyword: getKeyword, listCollaborators: listCollaborators, listKeywords: listKeywords, saveComment: saveComment, handleCreateReply: handleCreateReply, isNew: !use_comments_1.isSavedComment(comment), can: can, handleRequestSelect: () => handleRequestSelect(comment.target), scrollIntoHighlight: (comment) => {
                            handleRequestSelect(comment.target);
                        }, handleSetResolved: () => {
                            saveComment(Object.assign(Object.assign({}, comment), { resolved: !comment.resolved }));
                        } },
                        react_1.default.createElement(HighlightedText_1.HighlightedText, { comment: comment, getHighlightTextColor: getHighlightTextColor }))),
                use_comments_1.repliesOf(items, comment._id).map(({ comment: reply }) => (react_1.default.createElement(style_guide_1.ReplyBodyContainer, { key: reply._id },
                    react_1.default.createElement(style_guide_1.CommentWrapper, { isReply: true, comment: reply, createKeyword: createKeyword, deleteComment: deleteComment, getCollaborator: getCollaboratorById, getKeyword: getKeyword, listCollaborators: listCollaborators, listKeywords: listKeywords, saveComment: saveComment, handleCreateReply: handleCreateReply, isNew: !use_comments_1.isSavedComment(reply), can: can }))))));
        }))));
};
exports.CommentsList = CommentsList;
//# sourceMappingURL=CommentsList.js.map