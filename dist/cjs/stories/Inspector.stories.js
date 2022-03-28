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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@reach/tabs/styles.css");
const project_dump_json_1 = __importDefault(require("@manuscripts/examples/data/project-dump.json"));
const tabs_1 = require("@reach/tabs");
const addon_actions_1 = require("@storybook/addon-actions");
const react_1 = require("@storybook/react");
const react_2 = __importDefault(require("react"));
const Inspector_1 = require("../src/components/Inspector");
const History_1 = require("../src/components/inspector/History");
const ManageTargetInspector_1 = require("../src/components/inspector/ManageTargetInspector");
const ManuscriptStyleInspector_1 = require("../src/components/inspector/ManuscriptStyleInspector");
const ParagraphStyles_1 = require("../src/components/inspector/ParagraphStyles");
const SectionInspector_1 = require("../src/components/inspector/SectionInspector");
const SectionStyles_1 = require("../src/components/inspector/SectionStyles");
const StatisticsInspector_1 = require("../src/components/inspector/StatisticsInspector");
const ManuscriptInspector_1 = require("../src/components/projects/ManuscriptInspector");
const use_snapshot_manager_1 = require("../src/hooks/use-snapshot-manager");
const colors_1 = require("../src/lib/colors");
const styles_1 = require("../src/lib/styles");
const util_1 = require("../src/pressroom/__tests__/util");
const store_1 = require("../src/store");
const doc_1 = require("./data/doc");
const people_1 = require("./data/people");
const projects_1 = require("./data/projects");
const snapshots_1 = require("./data/snapshots");
const status_labels_1 = require("./data/status-labels");
const tags_1 = require("./data/tags");
const manuscript = {
    _id: 'MPManuscript:1',
    containerID: 'MPProject:1',
    objectType: 'MPManuscript',
    createdAt: 0,
    updatedAt: 0,
};
const section = {
    _id: 'MPSection:1',
    containerID: 'MPProject:1',
    manuscriptID: 'MPManuscript:1',
    objectType: 'MPSection',
    title: 'Acetic acid activates distinct taste pathways in <i>Drosophila</i> to elicit opposing, state-dependent feeding responses',
    createdAt: 0,
    updatedAt: 0,
    sessionID: '1',
    priority: 1,
    path: ['MPSection:1'],
};
const bundle = {
    _id: 'MPBundle:1',
    containerID: 'MPProject:1',
    objectType: 'MPBundle',
    csl: {
        title: 'Nature',
    },
    createdAt: 0,
    updatedAt: 0,
};
const modelMap = util_1.buildModelMap(project_dump_json_1.default);
const { colors, colorScheme } = colors_1.buildColors(modelMap);
const bodyTextParagraphStyles = styles_1.findBodyTextParagraphStyles(modelMap);
const defaultParagraphStyle = bodyTextParagraphStyles.find((style) => style.kind === 'body');
const state = {};
const view = {
    dispatch: addon_actions_1.action('dispatch'),
    state: state,
};
react_1.storiesOf('Inspector', module).add('tabs', () => (react_2.default.createElement("div", { style: { width: 500 } },
    react_2.default.createElement(tabs_1.Tabs, null,
        react_2.default.createElement(Inspector_1.InspectorTabList, null,
            react_2.default.createElement(Inspector_1.InspectorTab, null, "Tab 1"),
            react_2.default.createElement(Inspector_1.InspectorTab, null, "Tab 2"),
            react_2.default.createElement(Inspector_1.InspectorTab, null, "Tab 3")),
        react_2.default.createElement(tabs_1.TabPanels, null,
            react_2.default.createElement(tabs_1.TabPanel, null, "Panel 1"),
            react_2.default.createElement(tabs_1.TabPanel, null, "Panel 2"),
            react_2.default.createElement(tabs_1.TabPanel, null, "Panel 3"))))));
const storeState = {
    manuscript,
    modelMap,
    saveManuscript: addon_actions_1.action('save manuscript'),
    saveModel: addon_actions_1.action('save'),
    deleteModel: addon_actions_1.action('delete'),
    listCollaborators: () => people_1.people,
    statusLabels: status_labels_1.statusLabels,
    tags: tags_1.tags,
    project: projects_1.project,
};
react_1.storiesOf('Inspector/Manuscript Inspector', module).add('without requirements', () => {
    const store = new store_1.GenericStore(undefined, undefined, Object.assign({}, storeState));
    return (react_2.default.createElement(store_1.GenericStoreProvider, { store: store },
        react_2.default.createElement("div", { style: { width: 500 } },
            react_2.default.createElement(ManuscriptInspector_1.ManuscriptInspector, { state: view.state, dispatch: view.dispatch, openTemplateSelector: addon_actions_1.action('open template selector '), getTemplate: addon_actions_1.action('get the template'), getManuscriptCountRequirements: addon_actions_1.action('get the manuscript count requirements') }))));
});
react_1.storiesOf('Inspector/Section Inspector', module).add('without requirements', () => {
    const store = new store_1.GenericStore(undefined, undefined, Object.assign({}, storeState));
    return (react_2.default.createElement(store_1.GenericStoreProvider, { store: store },
        react_2.default.createElement("div", { style: { width: 500 } },
            react_2.default.createElement(SectionInspector_1.SectionInspector, { section: section, state: view.state, dispatch: view.dispatch, dispatchNodeAttrs: addon_actions_1.action('dispatch node attributes'), getSectionCountRequirements: addon_actions_1.action('get the section count requirements') }))));
});
react_1.storiesOf('Inspector/Manuscript Style Inspector', module)
    .add('without bundle', () => (react_2.default.createElement("div", { style: { width: 500 } },
    react_2.default.createElement(ManuscriptStyleInspector_1.ManuscriptStyleInspector, { bundle: undefined, openCitationStyleSelector: addon_actions_1.action('open citation style inspector') }))))
    .add('with bundle', () => (react_2.default.createElement("div", { style: { width: 500 } },
    react_2.default.createElement(ManuscriptStyleInspector_1.ManuscriptStyleInspector, { bundle: bundle, openCitationStyleSelector: addon_actions_1.action('open citation style inspector') }))));
const manuscriptNode = doc_1.doc;
const sectionNode = doc_1.doc.child(0);
react_1.storiesOf('Inspector/Statistics Inspector', module)
    .add('without section', () => (react_2.default.createElement("div", { style: { width: 500 } },
    react_2.default.createElement(StatisticsInspector_1.StatisticsInspector, { manuscriptNode: manuscriptNode }))))
    .add('with section', () => (react_2.default.createElement("div", { style: { width: 500 } },
    react_2.default.createElement(StatisticsInspector_1.StatisticsInspector, { manuscriptNode: manuscriptNode, sectionNode: sectionNode }))));
react_1.storiesOf('Inspector/Paragraph Styles', module).add('with bundle', () => (react_2.default.createElement("div", { style: { width: 500 } },
    react_2.default.createElement(ParagraphStyles_1.ParagraphStyles, { bodyTextParagraphStyles: bodyTextParagraphStyles, colors: colors, colorScheme: colorScheme, defaultParagraphStyle: defaultParagraphStyle, deleteParagraphStyle: addon_actions_1.action('delete paragraph style'), duplicateParagraphStyle: addon_actions_1.action('duplicate paragraph style'), error: undefined, paragraphStyle: defaultParagraphStyle, renameParagraphStyle: addon_actions_1.action('rename paragraph style'), saveDebouncedParagraphStyle: addon_actions_1.action('save debounced paragraph style'), saveModel: addon_actions_1.action('save model'), saveParagraphStyle: addon_actions_1.action('save paragraph style'), setElementParagraphStyle: addon_actions_1.action('set element paragraph style'), setError: addon_actions_1.action('set error') }))));
react_1.storiesOf('Inspector/Section Styles', module).add('with bundle', () => (react_2.default.createElement("div", { style: { width: 500 } },
    react_2.default.createElement(SectionStyles_1.SectionStyles, { colors: colors, colorScheme: colorScheme, error: undefined, paragraphStyle: defaultParagraphStyle, saveDebouncedParagraphStyle: addon_actions_1.action('save debounced paragraph style'), saveModel: addon_actions_1.action('save model'), saveParagraphStyle: addon_actions_1.action('save paragraph style'), setError: addon_actions_1.action('set error'), title: 'Section Heading Styles' }))));
react_1.storiesOf('Inspector/History', module).add('basic', () => (react_2.default.createElement(History_1.HistoryPanel, { project: projects_1.project, manuscriptID: "MANUSCRIPT", snapshotsList: snapshots_1.snapshots, isCreateFormOpen: true, requestTakeSnapshot: addon_actions_1.action('take snapshot'), submitName: addon_actions_1.action('take current name and finalize snapshot'), textFieldValue: "", handleTextFieldChange: addon_actions_1.action('update text field value'), currentUserId: people_1.people[0]._id })));
react_1.storiesOf('Inspector/History', module).add('while saving', () => (react_2.default.createElement(History_1.HistoryPanel, { project: projects_1.project, manuscriptID: "MANUSCRIPT", snapshotsList: snapshots_1.snapshots, isCreateFormOpen: true, requestTakeSnapshot: addon_actions_1.action('take snapshot'), submitName: addon_actions_1.action('take current name and finalize snapshot'), textFieldValue: "", handleTextFieldChange: addon_actions_1.action('update text field value'), status: use_snapshot_manager_1.SaveSnapshotStatus.Submitting, currentUserId: people_1.people[0]._id })));
react_1.storiesOf('Inspector/History', module).add('error while saving', () => (react_2.default.createElement(History_1.HistoryPanel, { project: projects_1.project, manuscriptID: "MANUSCRIPT", snapshotsList: snapshots_1.snapshots, isCreateFormOpen: true, requestTakeSnapshot: addon_actions_1.action('take snapshot'), submitName: addon_actions_1.action('take current name and finalize snapshot'), textFieldValue: "", handleTextFieldChange: addon_actions_1.action('update text field value'), status: use_snapshot_manager_1.SaveSnapshotStatus.Error, currentUserId: people_1.people[0]._id })));
react_1.storiesOf('Inspector/History', module).add('read only', () => (react_2.default.createElement(History_1.HistoryPanel, { project: projects_1.project, manuscriptID: "MANUSCRIPT", snapshotsList: snapshots_1.snapshots, currentUserId: people_1.people[0]._id })));
react_1.storiesOf('Inspector', module).add('Manage Section', () => {
    const store = new store_1.GenericStore(undefined, undefined, Object.assign({}, storeState));
    return (react_2.default.createElement(store_1.GenericStoreProvider, { store: store },
        react_2.default.createElement(ManageTargetInspector_1.ManageTargetInspector, { target: Object.assign(Object.assign({}, section), { assignees: ['user-1'], deadline: 1593982800, keywordIDs: ['tag-1', 'tag-2'] }) })));
});
//# sourceMappingURL=Inspector.stories.js.map