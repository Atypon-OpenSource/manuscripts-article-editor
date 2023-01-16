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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAllSharedData = exports.importSharedData = void 0;
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const importSharedData = (file) => Promise.resolve().then(() => __importStar(require(`@manuscripts/data/dist/shared/${file}.json`))).then((module) => module.default)
    .then((items) => new Map(items.map((item) => [item._id, item])));
exports.importSharedData = importSharedData;
const loadAllSharedData = (userTemplates, userTemplateModels) => __awaiter(void 0, void 0, void 0, function* () {
    // bundled template data
    const templatesData = yield exports.importSharedData('templates-v2');
    // manuscript templates
    const manuscriptTemplates = new Map();
    for (const item of templatesData.values()) {
        if (item.objectType === manuscripts_json_schema_1.ObjectTypes.ManuscriptTemplate) {
            manuscriptTemplates.set(item._id, item);
        }
    }
    // bundles
    const bundles = yield exports.importSharedData('bundles');
    // manuscript categories
    const manuscriptCategories = yield exports.importSharedData('manuscript-categories');
    // publishers
    const publishers = yield exports.importSharedData('publishers');
    // section categories
    const sectionCategories = yield exports.importSharedData('section-categories');
    // styles
    const styles = yield exports.importSharedData('styles');
    // keywords
    const keywords = yield exports.importSharedData('keywords');
    const researchFields = new Map();
    // const statusLabels = new Map<string, StatusLabel>()
    for (const item of keywords.values()) {
        switch (item.objectType) {
            case manuscripts_json_schema_1.ObjectTypes.ResearchField:
                researchFields.set(item._id, item);
                break;
            // case ObjectTypes.StatusLabel:
            //   statusLabels.set(item._id, item)
            //   break
        }
    }
    // contributor roles
    // const contributorRoles = await importSharedData<ContributorRole>(
    //   'contributor-roles'
    // )
    const userManuscriptTemplates = new Map();
    if (userTemplates && userTemplateModels) {
        // user manuscript templates
        for (const item of userTemplates) {
            userManuscriptTemplates.set(item._id, item);
        }
        // user template models
        for (const model of userTemplateModels) {
            switch (model.objectType) {
                case manuscripts_json_schema_1.ObjectTypes.Bundle:
                    bundles.set(model._id, model);
                    break;
                case manuscripts_json_schema_1.ObjectTypes.AuxiliaryObjectReferenceStyle:
                case manuscripts_json_schema_1.ObjectTypes.BorderStyle:
                case manuscripts_json_schema_1.ObjectTypes.CaptionStyle:
                case manuscripts_json_schema_1.ObjectTypes.Color:
                case manuscripts_json_schema_1.ObjectTypes.ColorScheme:
                case manuscripts_json_schema_1.ObjectTypes.FigureStyle:
                case manuscripts_json_schema_1.ObjectTypes.PageLayout:
                case manuscripts_json_schema_1.ObjectTypes.ParagraphStyle:
                case manuscripts_json_schema_1.ObjectTypes.TableStyle:
                    styles.set(model._id, model);
                    break;
                default:
                    if (model.objectType.endsWith('Requirement')) {
                        templatesData.set(model._id, model);
                    }
                    // TODO: anything else?
                    break;
            }
        }
    }
    return {
        bundles,
        // contributorRoles,
        manuscriptCategories,
        manuscriptTemplates,
        publishers,
        researchFields,
        sectionCategories,
        styles,
        templatesData,
        userManuscriptTemplates,
        // statusLabels,
    };
});
exports.loadAllSharedData = loadAllSharedData;
//# sourceMappingURL=shared-data.js.map