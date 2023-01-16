"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSnapshot = exports.updateSnapshot = exports.saveSnapshot = exports.getSnapshot = exports.listSnapshotLabels = void 0;
const methods_1 = require("./methods");
const listSnapshotLabels = (docId) => methods_1.get(`doc/${docId}/snapshot/labels`, 'Fetching snapshots failed');
exports.listSnapshotLabels = listSnapshotLabels;
const getSnapshot = (snapshotId) => methods_1.get(`snapshot/${snapshotId}`, 'Fetching a snapshot failed');
exports.getSnapshot = getSnapshot;
const saveSnapshot = (payload) => methods_1.post('snapshot', payload, 'Saving snapshot failed');
exports.saveSnapshot = saveSnapshot;
const updateSnapshot = (snapId, payload) => methods_1.put(`snapshot/${snapId}`, payload, 'Updating snapshot failed');
exports.updateSnapshot = updateSnapshot;
const deleteSnapshot = (snapId) => methods_1.del(`snapshot/${snapId}`, 'Deleting snapshot failed');
exports.deleteSnapshot = deleteSnapshot;
//# sourceMappingURL=snapshot.js.map