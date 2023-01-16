"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.createComment = exports.listComments = void 0;
const methods_1 = require("./methods");
const listComments = (docId) => methods_1.get(`doc/${docId}/comments`, 'Fetching comments failed');
exports.listComments = listComments;
const createComment = (payload) => methods_1.post('comment', payload, 'Saving comment failed');
exports.createComment = createComment;
const updateComment = (commentId, payload) => methods_1.put(`comment/${commentId}`, payload, 'Fetching a comment failed');
exports.updateComment = updateComment;
const deleteComment = (commentId) => methods_1.del(`comment/${commentId}`, 'Deleting comment failed');
exports.deleteComment = deleteComment;
//# sourceMappingURL=comment.js.map