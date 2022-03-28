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
exports.Exporter = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const file_saver_1 = require("file-saver");
const react_1 = __importDefault(require("react"));
const authorization_1 = require("../../lib/authorization");
const tracking_1 = require("../../lib/tracking");
const exporter_1 = require("../../pressroom/exporter");
const ContactSupportButton_1 = require("../ContactSupportButton");
const ProgressModal_1 = require("./ProgressModal");
const SuccessModal_1 = require("./SuccessModal");
class Exporter extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            canCancel: false,
            cancelled: false,
            error: null,
            status: null,
        };
        this.handleCancel = () => {
            this.setState({
                cancelled: true,
            }, () => this.props.handleComplete(false));
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            const { getAttachment, modelMap, manuscriptID, format, project, submission, } = this.props;
            if (!getAttachment) {
                return;
            }
            try {
                this.setState({
                    canCancel: true,
                    cancelled: false,
                    status: 'Exporting manuscript…',
                    error: null,
                });
                const blob = yield exporter_1.exportProject(getAttachment, modelMap, manuscriptID, format, project, submission);
                if (this.state.cancelled) {
                    return;
                }
                tracking_1.trackEvent({
                    category: 'Manuscripts',
                    action: 'Export',
                    label: `success=true&project=${project._id}&format=${format}`,
                });
                if (format === 'literatum-eeo') {
                    const data = JSON.parse(yield blob.text());
                    if (data.queued !== 'true') {
                        throw new Error('Unexpected response');
                    }
                }
                else {
                    const manuscript = modelMap.get(manuscriptID);
                    const filename = exporter_1.generateDownloadFilename(manuscript.title || 'Untitled') +
                        exporter_1.downloadExtension(format);
                    file_saver_1.saveAs(blob, filename);
                }
                if (this.props.closeOnSuccess) {
                    this.setState({
                        status: null,
                    });
                    this.props.handleComplete(true);
                }
                else {
                    this.setState({
                        status: 'complete',
                    });
                }
            }
            catch (error) {
                console.error(error);
                if (window.Sentry) {
                    window.Sentry.captureException(error);
                }
                tracking_1.trackEvent({
                    category: 'Manuscripts',
                    action: 'Export',
                    label: `success=false&project=${project._id}&format=${format}`,
                });
                this.setState({ error });
            }
        });
    }
    render() {
        const { format } = this.props;
        const { error, status, canCancel } = this.state;
        if (error) {
            return (react_1.default.createElement(style_guide_1.Dialog, { isOpen: true, category: style_guide_1.Category.error, header: 'Export error', message: error.status === 401 ? (react_1.default.createElement(react_1.default.Fragment, null,
                    "Unable to export at this time. Please log in again.",
                    react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: authorization_1.loginAgain }, "Log in"))) : (react_1.default.createElement(react_1.default.Fragment, null,
                    "There was an error exporting the manuscript. Please",
                    ' ',
                    react_1.default.createElement(ContactSupportButton_1.ContactSupportButton, { message: `Export error: ${error.toString()}` }, "contact support"),
                    ' ',
                    "if this persists.")), actions: {
                    primary: {
                        action: this.handleCancel,
                        title: 'OK',
                    },
                } }));
        }
        if (!status) {
            return null;
        }
        if (status === 'complete') {
            if (format === 'literatum-do') {
                return (react_1.default.createElement(SuccessModal_1.SuccessModal, { status: 'Export to Literatum completed successfully', handleDone: () => {
                        this.props.handleComplete(true);
                    } }));
            }
            if (format === 'literatum-bundle') {
                return (react_1.default.createElement(SuccessModal_1.SuccessModal, { status: 'Submission to Literatum completed successfully', handleDone: () => {
                        this.props.handleComplete(true);
                    } }));
            }
            if (format === 'literatum-eeo') {
                return (react_1.default.createElement(SuccessModal_1.SuccessModal, { status: 'Submission started successfully', handleDone: () => {
                        this.props.handleComplete(true);
                    } }));
            }
        }
        return (react_1.default.createElement(ProgressModal_1.ProgressModal, { canCancel: canCancel, handleCancel: this.handleCancel, status: status }));
    }
}
exports.Exporter = Exporter;
//# sourceMappingURL=Exporter.js.map