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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useComments = exports.useNewAnnotationEffect = exports.getHighlightColor = exports.getUnsavedComment = exports.isSavedComment = exports.repliesOf = exports.topLevelComments = exports.removeComment = exports.insertCommentReply = exports.insertCommentFromAnnotation = exports.updateComment = exports.getInitialCommentState = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const track_changes_1 = require("@manuscripts/track-changes");
const react_1 = require("react");
const CommentListPatterns_1 = require("../components/projects/CommentListPatterns");
const store_1 = require("../store");
const use_microstore_1 = require("./use-microstore");
const getInitialCommentState = (comments, annotations) => {
    return comments.map((comment) => ({
        comment,
        annotation: annotations.find((annotation) => annotation.uid === comment.target),
        saveStatus: '',
    }));
};
exports.getInitialCommentState = getInitialCommentState;
const updateComment = (id, commentData, status) => (current) => {
    return current.map((item) => {
        if (item.comment._id !== id) {
            return item;
        }
        return {
            comment: Object.assign(Object.assign({}, item.comment), commentData),
            annotation: item.annotation,
            saveStatus: status || item.saveStatus,
        };
    });
};
exports.updateComment = updateComment;
const insertCommentFromAnnotation = (annotation, doc, user) => (current) => {
    const exists = !!current.find((item) => item.comment.target === annotation.uid);
    if (exists) {
        return current;
    }
    const newComment = Object.assign(Object.assign({}, manuscript_transform_1.buildComment(annotation.uid)), { contributions: [manuscript_transform_1.buildContribution(user._id)], originalText: doc.textBetween(annotation.from, annotation.to), selector: {
            from: annotation.from,
            to: annotation.to,
        }, resolved: false });
    return current.concat({ comment: newComment, annotation, saveStatus: '' });
};
exports.insertCommentFromAnnotation = insertCommentFromAnnotation;
const insertCommentReply = (target, user) => (current) => {
    const newComment = Object.assign(Object.assign({}, manuscript_transform_1.buildComment(target)), { contributions: [manuscript_transform_1.buildContribution(user._id)], resolved: false });
    return current.concat({ comment: newComment, saveStatus: '' });
};
exports.insertCommentReply = insertCommentReply;
const removeComment = (id) => (current) => {
    return current.filter((item) => {
        if (item.comment._id === id || item.comment.target === id) {
            return false;
        }
        return true;
    });
};
exports.removeComment = removeComment;
const topLevelComments = (state, filter) => {
    return state
        .filter((item) => filter && filter === CommentListPatterns_1.CommentFilter.UNRESOLVED
        ? item.comment.selector && !item.comment.resolved
        : item.comment.selector)
        .slice()
        .sort((a, b) => {
        const bFrom = b.comment.selector.from;
        const aFrom = a.comment.selector.from;
        return aFrom - bFrom;
    });
};
exports.topLevelComments = topLevelComments;
const repliesOf = (state, parentID) => {
    return state.filter((item) => item.comment.target === parentID);
};
exports.repliesOf = repliesOf;
const isSavedComment = (comment) => {
    return !!comment.createdAt;
};
exports.isSavedComment = isSavedComment;
const getUnsavedComment = (state) => {
    const item = state.find((item) => !exports.isSavedComment(item.comment));
    return (item === null || item === void 0 ? void 0 : item.comment._id) || null;
};
exports.getUnsavedComment = getUnsavedComment;
const getHighlightColor = (state, comment) => {
    const uid = comment.target;
    const item = state.find((item) => { var _a; return ((_a = item.annotation) === null || _a === void 0 ? void 0 : _a.uid) === uid; });
    if (!item) {
        return undefined;
    }
    return item.annotation
        ? `rgb(${item.annotation.color.join(', ')})`
        : undefined;
};
exports.getHighlightColor = getHighlightColor;
const useNewAnnotationEffect = (effect, annotations) => {
    var _a;
    const [prevLastUpdated, setLastUpdated] = react_1.useState();
    const lastUpdated = ((_a = annotations[annotations.length - 1]) === null || _a === void 0 ? void 0 : _a.updatedAt) || 0;
    react_1.useEffect(() => {
        if (typeof prevLastUpdated !== 'undefined' &&
            lastUpdated > prevLastUpdated) {
            // this will run anytime there is a NEW annotation
            effect(annotations[annotations.length - 1]);
        }
        // this will get updated every time
        setLastUpdated(lastUpdated);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastUpdated, effect]);
};
exports.useNewAnnotationEffect = useNewAnnotationEffect;
const useComments = (comments, userProfile, editorState, doCommand) => {
    const { annotations } = track_changes_1.getTrackPluginState(editorState);
    const { annotation: focusedAnnotation } = track_changes_1.focusedEntities(editorState);
    const [state, dispatch] = use_microstore_1.useMicrostore(exports.getInitialCommentState(comments, annotations));
    exports.useNewAnnotationEffect((newAnnotation) => {
        dispatch(exports.insertCommentFromAnnotation(newAnnotation, editorState.doc, userProfile));
    }, annotations);
    const [{ saveModel, deleteModel }] = store_1.useStore((store) => ({
        saveModel: store.saveModel,
        deleteModel: store.deleteModel,
    }));
    const saveComment = react_1.useCallback((comment) => {
        const annotationColor = exports.getHighlightColor(state, comment);
        return saveModel(Object.assign(Object.assign({}, comment), { annotationColor })).then((comment) => {
            dispatch(exports.updateComment(comment._id, comment));
            return comment;
        });
    }, [state, saveModel, dispatch]);
    const deleteComment = react_1.useCallback((id) => {
        const item = state.find((item) => item.comment._id === id);
        if (!item) {
            return;
        }
        const { target } = item.comment;
        doCommand(track_changes_1.commands.removeAnnotation(target));
        [item, ...exports.repliesOf(state, id)].map(({ comment }) => {
            dispatch(exports.removeComment(comment._id));
            deleteModel(comment._id).catch(() => {
                // fail silently - probably the comment never existed
                return;
            });
        });
    }, [deleteModel, state, dispatch, doCommand]);
    const handleCreateReply = react_1.useCallback((id) => {
        dispatch(exports.insertCommentReply(id, userProfile));
    }, [userProfile, dispatch]);
    const handleRequestSelect = react_1.useCallback((target) => {
        doCommand(track_changes_1.commands.focusAnnotation(target));
    }, [doCommand]);
    // run this once to shim any legacy HighlightMarkers into the comment state
    react_1.useEffect(() => {
        comments.forEach((comment) => {
            if (!comment.target.startsWith('MPHighlight:')) {
                return;
            }
            const positions = manuscript_transform_1.findNodePositions(editorState, (node) => node.attrs.rid === comment.target).sort();
            let from;
            let to;
            if (positions.length > 1) {
                from = Math.min(...positions);
                to = Math.max(...positions);
            }
            else if (positions.length) {
                from = positions[0];
                to = positions[0];
            }
            else {
                return;
            }
            saveComment(Object.assign(Object.assign({}, comment), { selector: { from, to } }))
                .then((comment) => {
                const maybeInsert = false; // insertAnnotationFromComment(comment)
                if (!maybeInsert) {
                    return;
                }
                return doCommand(maybeInsert);
            })
                .catch(console.error);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return {
        items: state,
        focusedItem: focusedAnnotation,
        saveComment,
        deleteComment,
        handleCreateReply,
        handleRequestSelect,
    };
};
exports.useComments = useComments;
//# sourceMappingURL=use-comments.js.map