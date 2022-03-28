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
exports.KeywordsInput = void 0;
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const react_1 = __importDefault(require("react"));
const creatable_1 = __importDefault(require("react-select/creatable"));
const select_styles_1 = require("../../lib/select-styles");
const store_1 = require("../../store");
const KeywordsInput = ({ state, dispatch }) => {
    const [{ modelMap, saveModel, manuscript, saveManuscript }] = store_1.useStore((store) => ({
        modelMap: store.modelMap,
        saveModel: store.saveModel,
        manuscript: store.manuscript,
        saveManuscript: store.saveManuscript,
    }));
    const keywordIDs = manuscript.keywordIDs || [];
    const manuscriptKeywords = keywordIDs
        .map((id) => modelMap.get(id))
        .filter(Boolean);
    const updateKeywordsElement = (manuscriptKeywords) => {
        const keywordsElements = [];
        const { tr } = state;
        tr.doc.descendants((node, pos) => {
            if (node.type === node.type.schema.nodes.keywords_element) {
                keywordsElements.push({
                    node,
                    pos,
                });
            }
        });
        if (keywordsElements.length) {
            const contents = manuscript_editor_1.buildKeywordsContents(manuscript, manuscriptKeywords);
            for (const { node, pos } of keywordsElements) {
                tr.setNodeMarkup(pos, undefined, Object.assign(Object.assign({}, node.attrs), { contents }));
            }
            dispatch(tr);
        }
    };
    return (react_1.default.createElement(creatable_1.default, { noOptionsMessage: () => null, getNewOptionData: (inputValue) => {
            const option = {
                name: `Add "${inputValue}"`,
            };
            return option;
        }, onCreateOption: (inputValue) => __awaiter(void 0, void 0, void 0, function* () {
            const keyword = manuscript_transform_1.buildManuscriptKeyword(inputValue);
            yield saveModel(keyword);
            yield saveManuscript({
                keywordIDs: [...keywordIDs, keyword._id],
            });
            updateKeywordsElement([
                ...manuscriptKeywords,
                keyword,
            ]);
        }), options: manuscriptKeywords, value: manuscriptKeywords, getOptionValue: (option) => option._id, getOptionLabel: (option) => option.name, onChange: (manuscriptKeywords) => __awaiter(void 0, void 0, void 0, function* () {
            yield saveManuscript({
                keywordIDs: manuscriptKeywords.map((item) => item._id),
            });
            updateKeywordsElement(manuscriptKeywords);
        }), styles: select_styles_1.selectStyles, menuPortalTarget: document.body }));
};
exports.KeywordsInput = KeywordsInput;
//# sourceMappingURL=KeywordsInput.js.map