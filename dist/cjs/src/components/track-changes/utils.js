"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptTrackedData = exports.trackedJoint = exports.filterNodesWithTrackingData = void 0;
const track_changes_plugin_1 = require("@manuscripts/track-changes-plugin");
const hasTrackingData = (node) => {
    var _a;
    return !!((_a = node === null || node === void 0 ? void 0 : node.attrs) === null || _a === void 0 ? void 0 : _a.dataTracked);
};
const filterNodesWithTrackingData = (node) => {
    const cleanDoc = Object.assign({}, node);
    const cleanNode = (parent) => {
        if (parent.content) {
            parent.content = parent.content.filter((child) => !hasTrackingData(child));
            parent.content.forEach((child) => cleanNode(child));
        }
    };
    cleanNode(cleanDoc);
    return cleanDoc;
};
exports.filterNodesWithTrackingData = filterNodesWithTrackingData;
const getLastChange = (changes) => {
    return [...changes].sort((a, b) => (a.createdAt < b.createdAt ? 1 : 0))[0];
};
exports.trackedJoint = ':dataTracked:';
const adaptTrackedData = (docJSONed) => {
    const cleanDoc = Object.assign({}, docJSONed);
    let counter = 0;
    function deepCloneAttrs(object) {
        counter += 1;
        if (typeof object !== 'object' || object === null) {
            return object;
        }
        console.log(counter);
        if (counter > 2000) {
            alert('Got it');
            // eslint-disable-next-line
        }
        const copy = Array.isArray(object) ? [] : {};
        for (const at in object) {
            const deeperClone = typeof object[at] !== 'object' ? object[at] : deepCloneAttrs(object[at]);
            if (Array.isArray(object)) {
                // @ts-ignore
                copy.push(deeperClone);
            }
            else {
                // @ts-ignore
                copy[at] = deeperClone;
            }
        }
        return copy;
    }
    const cleanNode = (parent) => {
        counter = 0;
        parent.attrs = deepCloneAttrs(parent.attrs);
        // Prosemirror's Node.toJSON() references attributes so they have to be cloned to avoid disaster.
        // It must be before conten check for the nodes like figures
        if (parent.content) {
            parent.content = parent.content.filter((child) => {
                var _a;
                // the type is wrong. we get JSON and not the doc
                // pass through all the nodes with no track changes at all
                if (!((_a = child === null || child === void 0 ? void 0 : child.attrs) === null || _a === void 0 ? void 0 : _a.dataTracked)) {
                    return true;
                }
                // consider this for future implementation: text changes are in general not to be regarded => meaning always to pass through
                const lastChange = getLastChange(child.attrs.dataTracked);
                // this to be able to create a modelMap with models that are relevant but were spawn out of existing and have duplicate ids
                // this will fail with new prosemirror as attributes are read only but it's ok to modify them on an inactive document
                if (lastChange.status !== track_changes_plugin_1.CHANGE_STATUS.rejected &&
                    lastChange.operation !== track_changes_plugin_1.CHANGE_OPERATION.delete) {
                    child.attrs = deepCloneAttrs(child.attrs) || {}; // @TODO: needs refactoring, in case when there is a dataTracked attribute, we deep copy attributes 2 times.
                    child.attrs.id = child.attrs.id + exports.trackedJoint + lastChange.id;
                    return true;
                }
                return false;
            });
            parent.content.forEach((child) => cleanNode(child));
        }
    };
    cleanNode(cleanDoc);
    return cleanDoc;
};
exports.adaptTrackedData = adaptTrackedData;
//# sourceMappingURL=utils.js.map