"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.updateDocument = exports.createDocument = exports.getDocument = void 0;
const methods_1 = require("./methods");
const getDocument = (id) => methods_1.get(`doc/${id}`, 'Fetching document failed');
exports.getDocument = getDocument;
const createDocument = (payload) => methods_1.post('doc', payload, 'Creating document failed');
exports.createDocument = createDocument;
const updateDocument = (id, payload) => methods_1.put(`doc/${id}`, payload, 'Updating document failed');
exports.updateDocument = updateDocument;
const deleteDocument = (docId) => methods_1.del(`doc/${docId}`, 'Deleting document failed');
exports.deleteDocument = deleteDocument;
//# sourceMappingURL=document.js.map