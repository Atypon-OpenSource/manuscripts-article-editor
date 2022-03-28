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
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const create_manuscript_1 = require("../../lib/create-manuscript");
const shared_data_1 = require("../../lib/shared-data");
const templates_1 = require("../../lib/templates");
const update_manuscript_template_1 = require("../../lib/update-manuscript-template");
const store_1 = require("../../store");
// import { importManuscript } from '../projects/ImportManuscript'
const PseudoProjectPage_1 = require("./PseudoProjectPage");
const TemplateLoadingModal_1 = require("./TemplateLoadingModal");
const TemplateSelectorModal_1 = require("./TemplateSelectorModal");
const TemplateSelector = ({ handleComplete, projectID, user, manuscript, switchTemplate, modelMap, }) => {
    const [{ saveNewManuscript, updateTemplate }] = store_1.useStore((store) => ({
        saveNewManuscript: store.saveNewManuscript,
        updateTemplate: store.updateManuscriptTemplate,
    }));
    const [data, setData] = react_1.useState();
    const history = react_router_dom_1.useHistory();
    const handleCancellation = react_1.useCallback(() => {
        handleComplete(true);
    }, [handleComplete]);
    const [{ userTemplates, userTemplateModels }, setUserData] = react_1.useState({});
    const [getUserTemplates] = store_1.useStore((store) => store.getUserTemplates);
    react_1.useEffect(() => {
        if (getUserTemplates) {
            getUserTemplates()
                .then(({ userTemplateModels, userTemplates }) => {
                setUserData({ userTemplateModels, userTemplates });
            })
                .catch((e) => console.log(e));
        }
    }, [getUserTemplates]);
    react_1.useEffect(() => {
        if (userTemplates && userTemplateModels) {
            shared_data_1.loadAllSharedData(userTemplates, userTemplateModels)
                .then(setData)
                .catch((error) => {
                // TODO: display error message
                console.error(error);
            });
        }
    }, [userTemplates, userTemplateModels]);
    // const importManuscriptModels = useMemo(
    //   () => importManuscript(db, history, user, handleComplete, projectID),
    //   [db, history, user, handleComplete, projectID]
    // )
    const categories = react_1.useMemo(() => (data ? templates_1.buildCategories(data.manuscriptCategories) : undefined), [data]);
    const researchFields = react_1.useMemo(() => (data ? templates_1.buildResearchFields(data.researchFields) : undefined), [data]);
    const items = react_1.useMemo(() => (data ? templates_1.buildItems(data) : undefined), [data]);
    // TODO: refactor most of this to a separate module
    const createEmpty = react_1.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!data) {
            throw new Error('Data not loaded');
        }
        yield create_manuscript_1.createManuscript({
            analyticsTemplateName: '(empty)',
            bundleID: manuscript_transform_1.DEFAULT_BUNDLE,
            data,
            history,
            projectID,
            user,
            saveNewManuscript,
        });
        handleComplete();
    }), [data, projectID, user, saveNewManuscript, history, handleComplete]);
    // TODO: refactor most of this to a separate module
    const selectTemplate = react_1.useCallback((item) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (!data) {
            throw new Error('Data not loaded');
        }
        // merge the templates
        const template = item.template
            ? templates_1.createMergedTemplate(item.template, data.manuscriptTemplates)
            : undefined;
        switchTemplate && manuscript && projectID && modelMap
            ? yield update_manuscript_template_1.updateManuscriptTemplate({
                bundleID: templates_1.chooseBundleID(item),
                data,
                projectID,
                previousManuscript: manuscript,
                prototype: (_a = item.template) === null || _a === void 0 ? void 0 : _a._id,
                template,
                modelMap,
                history,
                updateManuscriptTemplate: updateTemplate,
            })
            : yield create_manuscript_1.createManuscript({
                addContent: true,
                analyticsTemplateName: item.title,
                bundleID: templates_1.chooseBundleID(item),
                data,
                history,
                projectID,
                prototype: (_b = item.template) === null || _b === void 0 ? void 0 : _b._id,
                template,
                user,
                saveNewManuscript,
            });
        handleComplete();
    }), [
        data,
        projectID,
        user,
        history,
        handleComplete,
        switchTemplate,
        manuscript,
        modelMap,
        saveNewManuscript,
        updateTemplate,
    ]);
    if (!data || !categories || !researchFields || !items) {
        return (react_1.default.createElement(TemplateLoadingModal_1.TemplateLoadingModal, { handleCancel: handleCancellation, status: 'Thinking…' }));
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        !projectID && react_1.default.createElement(PseudoProjectPage_1.PseudoProjectPage, null),
        react_1.default.createElement(TemplateSelectorModal_1.TemplateSelectorModal, { categories: categories, createEmpty: createEmpty, handleComplete: handleCancellation, 
            // importManuscript={importManuscriptModels}
            items: items, researchFields: researchFields, selectTemplate: selectTemplate, switchTemplate: switchTemplate })));
};
exports.default = TemplateSelector;
//# sourceMappingURL=TemplateSelector.js.map