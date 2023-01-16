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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addon_actions_1 = require("@storybook/addon-actions");
const react_1 = require("@storybook/react");
const react_2 = __importDefault(require("react"));
const CommentList_1 = require("../src/components/projects/CommentList");
const CommentListPatterns_1 = require("../src/components/projects/CommentListPatterns");
const comments_1 = require("./data/comments");
const doc_1 = require("./data/doc");
const keywords_1 = require("./data/keywords");
const people_1 = require("./data/people");
const buildMap = (items) => {
    const map = new Map();
    for (const item of items) {
        map.set(item._id, item);
    }
    return map;
};
const buildCollaboratorMap = (items) => {
    const map = new Map();
    for (const item of items) {
        map.set(item.userID, item);
    }
    return map;
};
const keywordMap = buildMap(keywords_1.keywords);
const userMap = buildMap(people_1.people);
const collaboratorMap = buildCollaboratorMap(people_1.people);
const state = {};
const view = {
    dispatch: addon_actions_1.action('dispatch'),
    state: state,
};
react_1.storiesOf('Projects/Comments', module)
    .add('with comments', () => (react_2.default.createElement("div", { style: { width: 400 } },
    react_2.default.createElement(CommentList_1.CommentList, { comments: comments_1.comments, doc: doc_1.doc, getCurrentUser: () => people_1.people[0], getCollaborator: (id) => collaboratorMap.get(id), getCollaboratorById: (id) => userMap.get(id), deleteModel: addon_actions_1.action('delete model'), saveModel: addon_actions_1.action('save model'), listCollaborators: () => people_1.people, createKeyword: addon_actions_1.action('create keyword'), getKeyword: (id) => keywordMap.get(id), listKeywords: () => keywords_1.keywords, selected: null, setCommentTarget: addon_actions_1.action('set comment target'), state: view.state, dispatch: view.dispatch, setCommentFilter: addon_actions_1.action('set show resolved comment'), commentFilter: CommentListPatterns_1.CommentFilter.ALL }))))
    .add('without comments', () => (react_2.default.createElement("div", { style: { width: 400 } },
    react_2.default.createElement(CommentList_1.CommentList, { comments: [], doc: doc_1.doc, getCurrentUser: () => people_1.people[0], getCollaborator: (id) => collaboratorMap.get(id), getCollaboratorById: (id) => userMap.get(id), deleteModel: () => __awaiter(void 0, void 0, void 0, function* () { return addon_actions_1.action('delete model'); }), saveModel: () => __awaiter(void 0, void 0, void 0, function* () { return addon_actions_1.action('save model'); }), listCollaborators: () => people_1.people, createKeyword: () => __awaiter(void 0, void 0, void 0, function* () { return addon_actions_1.action('create keyword'); }), getKeyword: (id) => keywordMap.get(id), listKeywords: () => keywords_1.keywords, selected: null, setCommentTarget: addon_actions_1.action('set comment target'), state: view.state, dispatch: view.dispatch, setCommentFilter: addon_actions_1.action('set show resolved comment'), commentFilter: CommentListPatterns_1.CommentFilter.ALL }))));
//# sourceMappingURL=Comments.stories.js.map