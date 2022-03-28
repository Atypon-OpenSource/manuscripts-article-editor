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
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const react_1 = require("@storybook/react");
const react_2 = __importDefault(require("react"));
const SubmissionItem_1 = require("../src/components/inspector/SubmissionItem");
const submitting = {
    _id: 'MPSubmission:1',
    objectType: manuscripts_json_schema_1.ObjectTypes.Submission,
    journalTitle: 'Example Journal',
    journalCode: 'example',
    status: undefined,
    submittedAt: undefined,
    manuscriptID: 'MPManuscript:1',
    containerID: 'MPPRoject:1',
    sessionID: 'storybook',
    createdAt: 0,
    updatedAt: 0,
};
const success = {
    _id: 'MPSubmission:1',
    objectType: manuscripts_json_schema_1.ObjectTypes.Submission,
    journalTitle: 'Example Journal',
    journalCode: 'example',
    status: 'SUCCESS',
    submittedAt: Date.now() / 1000 - 60,
    manuscriptID: 'MPManuscript:1',
    containerID: 'MPPRoject:1',
    sessionID: 'storybook',
    createdAt: 0,
    updatedAt: 0,
};
const failure = {
    _id: 'MPSubmission:1',
    objectType: manuscripts_json_schema_1.ObjectTypes.Submission,
    journalTitle: 'Example Journal',
    journalCode: 'example',
    status: 'FAILURE',
    manuscriptID: 'MPManuscript:1',
    containerID: 'MPPRoject:1',
    sessionID: 'storybook',
    createdAt: 0,
    updatedAt: 0,
};
react_1.storiesOf('SubmissionItem', module)
    .add('Submitting', () => react_2.default.createElement(SubmissionItem_1.SubmissionItem, { submission: submitting }))
    .add('Success', () => react_2.default.createElement(SubmissionItem_1.SubmissionItem, { submission: success }))
    .add('Failure', () => react_2.default.createElement(SubmissionItem_1.SubmissionItem, { submission: failure }));
//# sourceMappingURL=SubmissionItem.stories.js.map