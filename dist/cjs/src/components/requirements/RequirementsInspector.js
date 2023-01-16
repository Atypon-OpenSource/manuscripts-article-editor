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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirementsInspectorView = exports.RequirementsInspector = exports.buildQualityCheck = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const requirements_1 = require("@manuscripts/requirements");
const blob_to_buffer_1 = __importDefault(require("blob-to-buffer"));
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../../config"));
const store_1 = require("../../store");
const Placeholders_1 = require("../Placeholders");
const ExceptionDialog_1 = require("../projects/lean-workflow/ExceptionDialog");
const RequirementsList_1 = require("./RequirementsList");
const buildQualityCheck = (modelMap, prototypeId, manuscriptID, validationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof prototypeId === 'undefined') {
        return [];
    }
    const getData = (id) => __awaiter(void 0, void 0, void 0, function* () {
        if (modelMap.has(id)) {
            const model = modelMap.get(id);
            if (manuscript_transform_1.isFigure(model)) {
                const modelSrc = model.src;
                const blobData = yield fetch(modelSrc).then((res) => res.blob());
                const blobFile = new File([blobData], id, {
                    type: blobData.type,
                });
                return fileToBuffer(blobFile);
            }
        }
        return undefined;
    });
    const fileToBuffer = (file) => new Promise((resolve, reject) => {
        blob_to_buffer_1.default(file, (err, buffer) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(buffer);
            }
        });
    });
    const validateManuscript = requirements_1.createTemplateValidator(prototypeId);
    // TODO: remove `as AnyValidationResult[]`
    const results = (yield validateManuscript(Array.from(modelMap.values()), manuscriptID, getData, validationOptions));
    return results;
});
exports.buildQualityCheck = buildQualityCheck;
const RequirementsInspector = () => {
    const [{ modelMap, manuscript, manuscriptID }] = store_1.useStore((store) => ({
        modelMap: store.modelMap,
        manuscript: store.manuscript,
        manuscriptID: store.manuscriptID,
    }));
    const prototypeId = manuscript.prototype;
    const [result, setResult] = react_1.useState([]);
    const [error, setError] = react_1.useState();
    const [isBuilding, setIsBuilding] = react_1.useState(false);
    react_1.useEffect(() => {
        setIsBuilding(true);
        exports.buildQualityCheck(modelMap, prototypeId, manuscriptID)
            .then(setResult)
            .finally(() => {
            setIsBuilding(false);
        })
            .catch(setError);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prototypeId, manuscriptID, JSON.stringify([...modelMap.values()])]);
    return (react_1.default.createElement(exports.RequirementsInspectorView, { prototypeId: prototypeId, result: result, error: error, isBuilding: isBuilding }));
};
exports.RequirementsInspector = RequirementsInspector;
const RequirementsInspectorView = ({ error, result, isBuilding }) => {
    const [prototypeId] = store_1.useStore((store) => { var _a; return (_a = store.manuscript) === null || _a === void 0 ? void 0 : _a.prototype; });
    if (isBuilding) {
        return react_1.default.createElement(Placeholders_1.DataLoadingPlaceholder, null);
    }
    if (error) {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ErrorMessage, null,
                " ", error === null || error === void 0 ? void 0 :
                error.message),
            config_1.default.leanWorkflow.enabled && (react_1.default.createElement(ExceptionDialog_1.ExceptionDialog, { errorCode: 'QR_SERVICE_UNAVAILABLE' }))));
    }
    if (!prototypeId) {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(AlertMessage, null, "You need to select a template to display the quality report check"),
            config_1.default.leanWorkflow.enabled && (react_1.default.createElement(ExceptionDialog_1.ExceptionDialog, { errorCode: 'QR_PROFILE_NOT_FOUND' }))));
    }
    if (!result) {
        return null;
    }
    return react_1.default.createElement(RequirementsList_1.RequirementsList, { validationResult: result });
};
exports.RequirementsInspectorView = RequirementsInspectorView;
const AlertMessage = styled_components_1.default.div `
  margin: 13px 0 9px 17px;
`;
const ErrorMessage = styled_components_1.default.div `
  margin: 13px 0 9px 17px;
`;
//# sourceMappingURL=RequirementsInspector.js.map