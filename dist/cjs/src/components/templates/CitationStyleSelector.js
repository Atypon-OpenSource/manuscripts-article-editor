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
const library_1 = require("@manuscripts/library");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const shared_data_1 = require("../../lib/shared-data");
const ContactSupportButton_1 = require("../ContactSupportButton");
const CitationStyleSelectorModal_1 = require("./CitationStyleSelectorModal");
const TemplateLoadingModal_1 = require("./TemplateLoadingModal");
class CitationStyleSelector extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {};
        this.saveParentBundle = (bundle) => __awaiter(this, void 0, void 0, function* () {
            const { project, collection } = this.props;
            const { bundles } = this.state;
            if (!bundle.csl) {
                return;
            }
            const parentIdentifier = bundle.csl['independent-parent-URL'];
            if (!parentIdentifier) {
                return;
            }
            if (!bundles) {
                throw new Error('Missing bundles');
            }
            const parentBundle = bundles.find((bundle) => bundle.csl && bundle.csl['self-URL'] === parentIdentifier);
            if (!parentBundle) {
                throw new Error(`Missing parent bundle: ${parentIdentifier}`);
            }
            const newParentBundle = manuscript_transform_1.fromPrototype(parentBundle);
            yield collection.create(newParentBundle, {
                containerID: project._id,
            });
            yield this.attachStyle(newParentBundle);
            return newParentBundle;
        });
        this.selectBundle = (bundle) => __awaiter(this, void 0, void 0, function* () {
            const { handleComplete, project, collection } = this.props;
            const newBundle = manuscript_transform_1.fromPrototype(bundle);
            yield collection.create(newBundle, {
                containerID: project._id,
            });
            yield this.attachStyle(newBundle);
            const parentBundle = yield this.saveParentBundle(newBundle);
            handleComplete(newBundle, parentBundle);
        });
        this.attachStyle = (newBundle) => __awaiter(this, void 0, void 0, function* () {
            if (newBundle.csl && newBundle.csl.cslIdentifier) {
                const data = yield library_1.loadCitationStyle({ bundle: newBundle });
                yield this.props.collection.putAttachment(newBundle._id, {
                    id: 'csl',
                    type: 'application/vnd.citationstyles.style+xml',
                    data,
                });
            }
        });
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loadBundles().catch((loadingError) => {
                this.setState({ loadingError });
            });
        });
    }
    render() {
        const { bundles, loadingError } = this.state;
        const { handleComplete } = this.props;
        if (loadingError) {
            return (react_1.default.createElement(style_guide_1.Dialog, { isOpen: true, category: style_guide_1.Category.error, header: 'Error', message: react_1.default.createElement(react_1.default.Fragment, null,
                    "There was an error loading the citation styles. Please",
                    ' ',
                    react_1.default.createElement(ContactSupportButton_1.ContactSupportButton, null, "contact support"),
                    " if this persists."), actions: {
                    primary: {
                        action: handleComplete,
                        title: 'OK',
                    },
                } }));
        }
        if (!bundles) {
            return (react_1.default.createElement(TemplateLoadingModal_1.TemplateLoadingModal, { handleCancel: () => handleComplete(), status: 'Loading citation styles…' }));
        }
        return (react_1.default.createElement(CitationStyleSelectorModal_1.CitationStyleSelectorModal, { handleComplete: handleComplete, items: bundles, selectBundle: this.selectBundle }));
    }
    loadBundles() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const bundles = [];
            const bundlesMap = yield shared_data_1.importSharedData('bundles');
            for (const bundle of bundlesMap.values()) {
                // only include bundles with titles
                if ((_a = bundle.csl) === null || _a === void 0 ? void 0 : _a.title) {
                    bundles.push(bundle);
                }
            }
            // sort by title, alphabetically
            bundles.sort((a, b) => a.csl.title.localeCompare(b.csl.title));
            this.setState({ bundles });
        });
    }
}
exports.default = react_router_dom_1.withRouter(CitationStyleSelector);
//# sourceMappingURL=CitationStyleSelector.js.map