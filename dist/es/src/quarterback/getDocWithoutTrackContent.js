"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocWithoutTrackContent = exports.filterUnchangedContent = void 0;
function filterUnchangedContent(node) {
    const r = [];
    node.forEach((child) => {
        var _a;
        const { attrs } = child;
        const op = (_a = attrs === null || attrs === void 0 ? void 0 : attrs.dataTracked) === null || _a === void 0 ? void 0 : _a.operation;
        if (child.isText &&
            child.marks.find((m) => m.type.name === 'tracked_insert') === undefined) {
            r.push(child.type.schema.text(child.text || '', child.marks.filter((m) => m.type.name !== 'tracked_delete')));
        }
        else if (op !== 'insert' && !child.isText) {
            r.push(child.type.create(Object.assign(Object.assign({}, attrs), { dataTracked: null }), filterUnchangedContent(child), child.marks));
        }
    });
    return r;
}
exports.filterUnchangedContent = filterUnchangedContent;
function getDocWithoutTrackContent(state) {
    const { doc } = state;
    return doc.type.create(doc.attrs, filterUnchangedContent(doc), doc.marks);
}
exports.getDocWithoutTrackContent = getDocWithoutTrackContent;
//# sourceMappingURL=getDocWithoutTrackContent.js.map