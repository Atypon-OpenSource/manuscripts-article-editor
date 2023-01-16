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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inspector = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const config_1 = __importDefault(require("../../config"));
const use_shared_data_1 = require("../../hooks/use-shared-data");
const roles_1 = require("../../lib/roles");
const user_1 = require("../../lib/user");
const store_1 = require("../../store");
const Inspector_1 = require("../Inspector");
const ElementStyleInspector_1 = require("../inspector/ElementStyleInspector");
const History_1 = require("../inspector/History");
const InlineStyleInspector_1 = require("../inspector/InlineStyleInspector");
const ManageTargetInspector_1 = require("../inspector/ManageTargetInspector");
const ManuscriptStyleInspector_1 = require("../inspector/ManuscriptStyleInspector");
const NodeInspector_1 = require("../inspector/NodeInspector");
const SectionInspector_1 = require("../inspector/SectionInspector");
const SectionStyleInspector_1 = require("../inspector/SectionStyleInspector");
const StatisticsInspector_1 = require("../inspector/StatisticsInspector");
const SubmissionsInspector_1 = require("../inspector/SubmissionsInspector");
const RequirementsInspector_1 = require("../requirements/RequirementsInspector");
const CommentList_1 = require("./CommentList");
const CommentListPatterns_1 = require("./CommentListPatterns");
const HeaderImageInspector_1 = require("./HeaderImageInspector");
const ManuscriptInspector_1 = require("./ManuscriptInspector");
const TABS = [
    'Content',
    'Style',
    (config_1.default.features.commenting || config_1.default.features.productionNotes) && 'Comments',
    config_1.default.features.qualityControl && 'Quality',
    config_1.default.shackles.enabled && 'History',
    config_1.default.export.to_review && 'Submissions',
].filter(Boolean);
const Inspector = ({ bundle, comments, commentTarget, createKeyword, dispatchNodeAttrs, dispatchUpdate, doc, element, getCollaborator, getCollaboratorById, getCurrentUser, getKeyword, listCollaborators, listKeywords, notes, openCitationStyleSelector, section, selected, selectedSection, setCommentTarget, submission, view, manageManuscript, openTemplateSelector, }) => {
    const [tabIndex, setTabIndex] = react_1.useState(0);
    const [commentFilter, setCommentFilter] = react_1.useState(CommentListPatterns_1.CommentFilter.UNRESOLVED);
    const [modelMap] = store_1.useStore((s) => s.modelMap);
    const [manuscript] = store_1.useStore((s) => s.manuscript);
    const [project] = store_1.useStore((s) => s.project);
    const [saveModel] = store_1.useStore((s) => s.saveModel);
    const [deleteModel] = store_1.useStore((s) => s.deleteModel);
    const { getTemplate, getManuscriptCountRequirements, getSectionCountRequirements, } = use_shared_data_1.useSharedData();
    react_1.useEffect(() => {
        if (commentTarget) {
            setTabIndex(TABS.findIndex((tab) => tab === 'Comments'));
        }
        else if (submission) {
            setTabIndex(TABS.findIndex((tab) => tab === 'Submissions'));
        }
    }, [commentTarget, submission]);
    const can = style_guide_1.usePermissions();
    return (react_1.default.createElement(Inspector_1.InspectorContainer, null,
        react_1.default.createElement(Inspector_1.InspectorTabs, { index: tabIndex, onChange: setTabIndex },
            react_1.default.createElement(Inspector_1.InspectorTabList, null, TABS.map((label, i) => (react_1.default.createElement(Inspector_1.InspectorTab, { key: i }, label)))),
            react_1.default.createElement(Inspector_1.PaddedInspectorTabPanels, null, TABS.map((label) => {
                if (label !== TABS[tabIndex]) {
                    return react_1.default.createElement(Inspector_1.InspectorTabPanel, { key: label });
                }
                switch (label) {
                    case 'Content': {
                        return (react_1.default.createElement(Inspector_1.InspectorTabPanel, { key: label },
                            react_1.default.createElement(StatisticsInspector_1.StatisticsInspector, { manuscriptNode: doc, sectionNode: selectedSection
                                    ? selectedSection.node
                                    : undefined }),
                            config_1.default.features.headerImage && react_1.default.createElement(HeaderImageInspector_1.HeaderImageInspector, null),
                            config_1.default.features.nodeInspector && selected && (react_1.default.createElement(NodeInspector_1.NodeInspector, { selected: selected, state: view.state, dispatch: view.dispatch })),
                            react_1.default.createElement(ManuscriptInspector_1.ManuscriptInspector, { key: manuscript._id, state: view.state, dispatch: view.dispatch, openTemplateSelector: openTemplateSelector, getTemplate: getTemplate, getManuscriptCountRequirements: getManuscriptCountRequirements, canWrite: roles_1.canWrite(project, user_1.getCurrentUserId()), leanWorkflow: false }),
                            (element || section) &&
                                config_1.default.features.projectManagement && (react_1.default.createElement(ManageTargetInspector_1.ManageTargetInspector, { target: manageManuscript
                                    ? manuscript
                                    : (element || section) })),
                            section && (react_1.default.createElement(SectionInspector_1.SectionInspector, { key: section._id, section: section, state: view.state, dispatch: view.dispatch, sectionNode: selectedSection
                                    ? selectedSection.node
                                    : undefined, dispatchNodeAttrs: dispatchNodeAttrs, getSectionCountRequirements: getSectionCountRequirements }))));
                    }
                    case 'Style': {
                        return (react_1.default.createElement(Inspector_1.InspectorTabPanel, { key: label },
                            react_1.default.createElement(ManuscriptStyleInspector_1.ManuscriptStyleInspector, { bundle: bundle, openCitationStyleSelector: openCitationStyleSelector }),
                            element && (react_1.default.createElement(ElementStyleInspector_1.ElementStyleInspector, { manuscript: manuscript, element: element, modelMap: modelMap, saveModel: saveModel, deleteModel: deleteModel, view: view })),
                            section && (react_1.default.createElement(SectionStyleInspector_1.SectionStyleInspector, { section: section, modelMap: modelMap, saveModel: saveModel, dispatchUpdate: dispatchUpdate })),
                            react_1.default.createElement(InlineStyleInspector_1.InlineStyleInspector, { modelMap: modelMap, saveModel: saveModel, deleteModel: deleteModel, view: view })));
                    }
                    case 'Comments': {
                        return (react_1.default.createElement(Inspector_1.InspectorTabPanel, { key: label, style: { marginTop: '16px' } },
                            config_1.default.features.commenting && (react_1.default.createElement(style_guide_1.InspectorSection, { title: 'Comments', contentStyles: { margin: '0 25px 24px 0' } },
                                react_1.default.createElement(CommentList_1.CommentList, { comments: comments || [], doc: doc, getCurrentUser: getCurrentUser, selected: selected, createKeyword: createKeyword, deleteModel: deleteModel, getCollaborator: getCollaborator, getCollaboratorById: getCollaboratorById, getKeyword: getKeyword, listCollaborators: listCollaborators, listKeywords: listKeywords, saveModel: saveModel, commentTarget: commentTarget, setCommentTarget: setCommentTarget, state: view.state, dispatch: view.dispatch, key: commentTarget, setCommentFilter: setCommentFilter, commentFilter: commentFilter }))),
                            config_1.default.features.productionNotes && (react_1.default.createElement(style_guide_1.InspectorSection, { title: 'Notes', contentStyles: { margin: '0 25px 24px 0' } },
                                react_1.default.createElement(style_guide_1.ManuscriptNoteList, { createKeyword: createKeyword, notes: notes || [], currentUserId: getCurrentUser()._id, getKeyword: getKeyword, can: can, listKeywords: listKeywords, selected: selected, getCollaboratorById: getCollaboratorById, listCollaborators: listCollaborators, saveModel: saveModel, deleteModel: deleteModel, noteSource: 'EDITOR' })))));
                    }
                    case 'Quality': {
                        return (react_1.default.createElement(Inspector_1.InspectorTabPanel, { key: "Quality" },
                            react_1.default.createElement(RequirementsInspector_1.RequirementsInspector, null)));
                    }
                    case 'History': {
                        return (react_1.default.createElement(Inspector_1.InspectorTabPanel, { key: "History" },
                            react_1.default.createElement(History_1.HistoryPanelContainer, { project: project, manuscriptID: manuscript._id, getCurrentUser: getCurrentUser })));
                    }
                    case 'Submissions': {
                        return (react_1.default.createElement(Inspector_1.InspectorTabPanel, { key: "Submissions" },
                            react_1.default.createElement(SubmissionsInspector_1.SubmissionsInspector, { modelMap: modelMap })));
                    }
                    default: {
                        return null;
                    }
                }
            })))));
};
exports.Inspector = Inspector;
//# sourceMappingURL=Inspector.js.map