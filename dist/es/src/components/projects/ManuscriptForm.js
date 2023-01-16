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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const formik_1 = require("formik");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const ImmediateSelectField_1 = require("../ImmediateSelectField");
const Loading_1 = require("../Loading");
const StyledForm = styled_components_1.default(formik_1.Form) `
  padding: 20px;
`;
const Label = styled_components_1.default.label `
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;
const LabelText = styled_components_1.default.div `
  margin-bottom: 5px;
`;
class ManuscriptForm extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            styles: [],
            locales: [],
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            const { default: bundles } = yield Promise.resolve().then(() => __importStar(require('@manuscripts/data/dist/shared/bundles.json')));
            const { default: localesMetadata } = yield Promise.resolve().then(() => __importStar(require('@manuscripts/data/dist/csl/locales/metadata.json')));
            const languageNames = localesMetadata['language-names'];
            this.setState({
                styles: bundles
                    .filter((bundle) => bundle.csl && bundle.csl.cslIdentifier && bundle.csl.title)
                    .map((bundle) => ({
                    value: bundle._id,
                    label: bundle.csl.title,
                })),
                locales: Object.entries(languageNames).map(([value, languageNames]) => ({
                    value,
                    label: languageNames[0],
                })),
            });
        });
    }
    render() {
        const { manuscript, saveManuscript } = this.props;
        const { styles, locales } = this.state;
        if (!styles || !locales) {
            return react_1.default.createElement(Loading_1.Loading, null, "Loading citation styles\u2026");
        }
        return (react_1.default.createElement(formik_1.Formik, { initialValues: {
                bundle: manuscript.bundle || manuscript_transform_1.DEFAULT_BUNDLE,
                primaryLanguageCode: manuscript.primaryLanguageCode || 'en-GB',
            }, onSubmit: saveManuscript, enableReinitialize: true },
            react_1.default.createElement(StyledForm, null,
                react_1.default.createElement(Label, null,
                    react_1.default.createElement(LabelText, null, "Citation Style"),
                    react_1.default.createElement(formik_1.Field, { name: 'bundle', component: ImmediateSelectField_1.ImmediateSelectField, options: styles })),
                react_1.default.createElement(Label, null,
                    react_1.default.createElement(LabelText, null, "Locale"),
                    react_1.default.createElement(formik_1.Field, { name: 'primaryLanguageCode', component: ImmediateSelectField_1.ImmediateSelectField, options: locales })))));
    }
}
exports.default = ManuscriptForm;
//# sourceMappingURL=ManuscriptForm.js.map