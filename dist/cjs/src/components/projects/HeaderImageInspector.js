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
exports.HeaderImageInspector = void 0;
const react_1 = __importDefault(require("react"));
const store_1 = require("../../store");
const InspectorSection_1 = require("../InspectorSection");
const CreditInput_1 = require("./CreditInput");
const DescriptionInput_1 = require("./DescriptionInput");
const ManuscriptHeaderField_1 = require("./ManuscriptHeaderField");
const HeaderImageInspector = () => {
    const [data] = store_1.useStore((store) => {
        return {
            deleteModel: store.deleteModel,
            manuscript: store.manuscript,
            modelMap: store.modelMap,
            saveManuscript: store.saveManuscript,
            saveModel: store.saveModel,
        };
    });
    const { deleteModel, manuscript, modelMap, saveManuscript, saveModel } = data;
    const headerFigure = manuscript.headerFigure
        ? modelMap.get(manuscript.headerFigure)
        : undefined;
    return (react_1.default.createElement(InspectorSection_1.InspectorSection, { title: 'Header Image' },
        react_1.default.createElement(ManuscriptHeaderField_1.ManuscriptHeaderField, { value: manuscript.headerFigure, handleChange: (headerFigure) => __awaiter(void 0, void 0, void 0, function* () {
                yield saveManuscript({ headerFigure });
            }), saveModel: saveModel, deleteModel: deleteModel }),
        headerFigure && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(InspectorSection_1.Subheading, null, "Caption"),
            react_1.default.createElement(DescriptionInput_1.DescriptionInput, { placeholder: 'Image caption…', value: headerFigure.title, handleChange: (title) => __awaiter(void 0, void 0, void 0, function* () {
                    yield saveModel(Object.assign(Object.assign({}, headerFigure), { title }));
                }) }),
            react_1.default.createElement(InspectorSection_1.Subheading, null, "Credit"),
            react_1.default.createElement(CreditInput_1.CreditInput, { value: headerFigure.credit, handleChange: (credit) => __awaiter(void 0, void 0, void 0, function* () {
                    yield saveModel(Object.assign(Object.assign({}, headerFigure), { credit }));
                }) })))));
};
exports.HeaderImageInspector = HeaderImageInspector;
//# sourceMappingURL=HeaderImageInspector.js.map