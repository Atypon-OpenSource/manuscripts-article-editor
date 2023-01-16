"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentTab = void 0;
const react_1 = __importDefault(require("react"));
const config_1 = __importDefault(require("../../../config"));
const use_shared_data_1 = require("../../../hooks/use-shared-data");
const store_1 = require("../../../store");
const ManageTargetInspector_1 = require("../../inspector/ManageTargetInspector");
const NodeInspector_1 = require("../../inspector/NodeInspector");
const SectionInspector_1 = require("../../inspector/SectionInspector");
const StatisticsInspector_1 = require("../../inspector/StatisticsInspector");
const HeaderImageInspector_1 = require("../HeaderImageInspector");
const ManuscriptInspector_1 = require("../ManuscriptInspector");
const ContentTab = ({ selected, selectedSection, selectedElement, dispatch, hasFocus, state, }) => {
    const [{ manuscript, doc, getModel }] = store_1.useStore((store) => {
        return {
            manuscript: store.manuscript,
            doc: store.doc,
            getModel: store.getTrackModel,
            saveManuscript: store.saveManuscript,
        };
    });
    const section = selectedSection
        ? getModel(selectedSection.node.attrs.id)
        : undefined;
    const element = selectedElement
        ? getModel(selectedElement.node.attrs.id)
        : undefined;
    const { getTemplate, getManuscriptCountRequirements, getSectionCountRequirements, } = use_shared_data_1.useSharedData();
    const dispatchNodeAttrs = (id, attrs, nodispatch = false) => {
        const { tr, doc } = state;
        let transaction;
        doc.descendants((node, pos) => {
            if (node.attrs.id === id) {
                tr.setNodeMarkup(pos, undefined, Object.assign(Object.assign({}, node.attrs), attrs));
                if (nodispatch) {
                    transaction = tr;
                }
                else {
                    dispatch(tr);
                }
            }
        });
        return transaction;
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(StatisticsInspector_1.StatisticsInspector, { manuscriptNode: doc, sectionNode: selectedSection
                ? selectedSection.node
                : undefined }),
        config_1.default.features.headerImage && react_1.default.createElement(HeaderImageInspector_1.HeaderImageInspector, null),
        config_1.default.features.nodeInspector && selected && (react_1.default.createElement(NodeInspector_1.NodeInspector, { selected: selected, state: state, dispatch: dispatch })),
        react_1.default.createElement(ManuscriptInspector_1.ManuscriptInspector, { key: manuscript._id, state: state, dispatch: dispatch, getTemplate: getTemplate, getManuscriptCountRequirements: getManuscriptCountRequirements, leanWorkflow: true }),
        (element || section) && config_1.default.features.projectManagement && (react_1.default.createElement(ManageTargetInspector_1.ManageTargetInspector, { target: !hasFocus
                ? manuscript
                : (element || section) })),
        section && (react_1.default.createElement(SectionInspector_1.SectionInspector, { key: section._id, section: section, sectionNode: selectedSection
                ? selectedSection.node
                : undefined, state: state, dispatch: dispatch, dispatchNodeAttrs: dispatchNodeAttrs, getSectionCountRequirements: getSectionCountRequirements }))));
};
exports.ContentTab = ContentTab;
//# sourceMappingURL=ContentTab.js.map