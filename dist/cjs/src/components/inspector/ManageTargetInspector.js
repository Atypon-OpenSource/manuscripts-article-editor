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
exports.ManageTargetInspector = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const collaborators_1 = require("../../lib/collaborators");
const date_1 = require("../../lib/date");
const store_1 = require("../../store");
const InspectorSection_1 = require("../InspectorSection");
const AssigneesInput_1 = require("../projects/AssigneesInput");
const DeadlineInput_1 = require("../projects/DeadlineInput");
const Status_1 = require("../projects/Status");
const TagsInput_1 = require("../projects/TagsInput");
const ManuscriptStyleInspector_1 = require("./ManuscriptStyleInspector");
const Label = styled_components_1.default(ManuscriptStyleInspector_1.InspectorLabel) `
  color: ${(props) => props.theme.colors.text.primary};
`;
const ManageTargetInspector = ({ target }) => {
    const title = target.objectType.replace(/MP|Element/g, '');
    const [{ project, collaboratorsProfiles }] = store_1.useStore((store) => ({
        project: store.project,
        collaboratorsProfiles: store.collaboratorsProfiles || new Map(),
    }));
    const collaborators = new Map();
    const listCollaborators = () => Array.from(collaboratorsProfiles.values());
    for (const collaborator of listCollaborators()) {
        collaborators.set(collaborator.userID, collaborator);
    }
    const projectCollaborators = collaborators_1.buildCollaborators(project, collaborators);
    const deadline = target.deadline;
    const { overdue, dueSoon } = react_1.useMemo(() => date_1.isOverdue(deadline)
        ? { overdue: true, dueSoon: false }
        : date_1.isDueSoon(deadline)
            ? { overdue: false, dueSoon: true }
            : { overdue: false, dueSoon: false }, [deadline]);
    return (react_1.default.createElement(InspectorSection_1.InspectorSection, { title: `Manage ${title}` },
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
            react_1.default.createElement(Label, null, "Assignees"),
            react_1.default.createElement(AssigneesInput_1.AssigneesInput, { profiles: projectCollaborators, target: target })),
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
            react_1.default.createElement(Label, null, "Deadline"),
            react_1.default.createElement(DeadlineInput_1.DeadlineInput, { target: target, isOverdue: overdue, isDueSoon: dueSoon })),
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
            react_1.default.createElement(Label, null, "Tags"),
            react_1.default.createElement(TagsInput_1.TagsInput, { target: target })),
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
            react_1.default.createElement(Label, null, "Status"),
            react_1.default.createElement(Status_1.StatusInput, { target: target, isOverdue: overdue, isDueSoon: dueSoon }))));
};
exports.ManageTargetInspector = ManageTargetInspector;
//# sourceMappingURL=ManageTargetInspector.js.map