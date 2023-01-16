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
exports.importManuscript = exports.Importer = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const config_1 = __importDefault(require("../../config"));
const bundles_1 = require("../../lib/bundles");
const errors_1 = require("../../lib/errors");
const manuscript_1 = require("../../lib/manuscript");
const tracking_1 = require("../../lib/tracking");
const importers_1 = require("../../pressroom/importers");
const ContactSupportButton_1 = require("../ContactSupportButton");
const ProgressModal_1 = require("./ProgressModal");
const progressText = (index, total) => total === 1 ? '' : ` ${index + 1} of ${total}`;
class Importer extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            canCancel: false,
            cancelled: false,
        };
        this.handleCancel = () => {
            this.setState({
                cancelled: true,
            }, this.props.handleComplete);
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setState({
                    canCancel: true,
                });
                const data = this.props.file
                    ? [this.props.file]
                    : yield importers_1.openFilePicker(importers_1.acceptedFileExtensions(), true);
                if (!data.length) {
                    this.props.handleComplete();
                    return;
                }
                const fileModels = [];
                for (const [index, file] of data.entries()) {
                    this.setState({
                        status: `Converting manuscript${progressText(index, data.length)}…`,
                    });
                    try {
                        fileModels.push(yield importers_1.importFile(file));
                    }
                    catch (error) {
                        throw new errors_1.FileImportError(error.message, file);
                    }
                }
                if (this.state.cancelled) {
                    return;
                }
                this.setState({
                    canCancel: false,
                });
                for (const [index, models] of fileModels.entries()) {
                    this.setState({
                        status: `Saving manuscript${progressText(index, data.length)}…`,
                    });
                    const isLastItem = index === fileModels.length - 1;
                    yield this.props.importManuscript(models, isLastItem);
                }
                this.setState({
                    status: undefined,
                });
                tracking_1.trackEvent({
                    category: 'Manuscripts',
                    action: 'Import',
                    label: `file=${data[0].name}`,
                });
                this.props.handleComplete();
            }
            catch (error) {
                console.error(error);
                this.setState({ error });
            }
        });
    }
    render() {
        const { error, status, canCancel } = this.state;
        if (error) {
            return (react_1.default.createElement(style_guide_1.Dialog, { isOpen: true, category: style_guide_1.Category.error, header: 'Import error', message: buildImportErrorMessage(error), actions: {
                    primary: {
                        action: this.handleCancel,
                        title: 'OK',
                    },
                } }));
        }
        if (!status) {
            return null;
        }
        return (react_1.default.createElement(ProgressModal_1.ProgressModal, { canCancel: canCancel, handleCancel: this.handleCancel, status: status }));
    }
}
exports.Importer = Importer;
const buildImportErrorMessage = (error) => {
    const contactMessage = (react_1.default.createElement("p", null,
        "Please ",
        react_1.default.createElement(ContactSupportButton_1.ContactSupportButton, null, "contact support"),
        " if this persists."));
    if (error instanceof errors_1.BulkCreateError) {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("p", null, "There was an error saving one or more items."),
            contactMessage,
            react_1.default.createElement("ul", null, error.failures.map((failure) => (react_1.default.createElement("li", { key: failure.id },
                failure.name,
                ": ",
                failure.id))))));
    }
    if (error instanceof errors_1.FileExtensionError) {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("p", null,
                "Could not import file with extension ",
                error.extension),
            react_1.default.createElement("p", null, "The following file extensions are supported:"),
            react_1.default.createElement("ul", null, error.acceptedExtensions.map((extension) => (react_1.default.createElement("li", { key: extension }, extension))))));
    }
    if (error instanceof errors_1.FileImportError) {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("p", null,
                "There was an error importing ",
                error.file.name),
            react_1.default.createElement("div", null, error.message)));
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("p", null, "There was an error importing the manuscript."),
        contactMessage));
};
const importManuscript = (models, projectID, bulkCreate, history, manuscripts, redirect) => __awaiter(void 0, void 0, void 0, function* () {
    const manuscript = models.find(manuscript_1.isManuscript);
    if (!manuscript) {
        throw new Error('No manuscript found');
    }
    // TODO: try to share this code with createManuscript
    manuscript.priority = yield manuscript_1.nextManuscriptPriority(manuscripts);
    // TODO: use the imported filename?
    if (!manuscript.pageLayout) {
        if (!models.find((model) => model._id === manuscript.bundle)) {
            const [bundle, parentBundle] = yield bundles_1.loadBundle(manuscript.bundle);
            manuscript.bundle = bundle._id;
            models.push(bundle);
            if (parentBundle) {
                models.push(parentBundle);
            }
        }
        const dependencies = yield manuscript_transform_1.loadBundledDependencies();
        const prototypedDependencies = dependencies.map(manuscript_transform_1.fromPrototype);
        models.push(...prototypedDependencies);
        const styleMap = new Map(prototypedDependencies.map((style) => [style._id, style]));
        const pageLayout = manuscript_transform_1.updatedPageLayout(styleMap, manuscript_transform_1.DEFAULT_PAGE_LAYOUT);
        manuscript.pageLayout = pageLayout._id;
        models.push(pageLayout);
        // TODO: apply a template?
    }
    // TODO: save dependencies first, then the manuscript
    // TODO: handle multiple manuscripts in a project bundle
    const items = models.map((model) => (Object.assign(Object.assign({}, model), { containerID: projectID, manuscriptID: manuscript_transform_1.isManuscriptModel(model) ? manuscript._id : undefined })));
    yield bulkCreate(items);
    if (redirect) {
        history.push(`/projects/${projectID}/manuscripts/${manuscript._id}`);
    }
    else if (config_1.default.environment === 'development') {
        alert(`projectID: ${projectID}; manuscriptID: ${manuscript._id}`);
    }
});
exports.importManuscript = importManuscript;
//# sourceMappingURL=Importer.js.map