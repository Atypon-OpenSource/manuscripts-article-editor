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
const style_guide_1 = require("@manuscripts/style-guide");
const jszip_1 = __importDefault(require("jszip"));
const path_parse_1 = __importDefault(require("path-parse"));
const React = __importStar(require("react"));
const react_dropzone_1 = __importDefault(require("react-dropzone"));
const styled_components_1 = __importDefault(require("styled-components"));
const importers_1 = require("../pressroom/importers");
const ModalProvider_1 = require("./ModalProvider");
const Importer_1 = require("./projects/Importer");
const StyledDropArea = styled_components_1.default.div `
  flex: 1;
  display: flex;

  &:focus {
    outline: none;
  }
`;
class ImportContainer extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            rejected: null,
        };
        this.handleClick = (event) => __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const [file] = yield importers_1.openFilePicker();
            if (file) {
                this.props.addModal('importer', ({ handleClose }) => (React.createElement(Importer_1.Importer, { handleComplete: handleClose, importManuscript: this.props.importManuscript, file: file })));
            }
        });
        this.handleDrop = (acceptedFiles) => __awaiter(this, void 0, void 0, function* () {
            if (acceptedFiles.length) {
                const [acceptedFile] = acceptedFiles;
                if (acceptedFile.name.endsWith('.zip')) {
                    yield this.handleZipFile(acceptedFile);
                }
                if (!this.state.rejected) {
                    this.props.addModal('importer', ({ handleClose }) => (React.createElement(Importer_1.Importer, { handleComplete: handleClose, importManuscript: this.props.importManuscript, file: acceptedFile })));
                }
            }
        });
        this.handleCancel = () => {
            this.setState({ rejected: null });
        };
        this.handleZipFile = (file) => __awaiter(this, void 0, void 0, function* () {
            const zip = yield new jszip_1.default().loadAsync(file);
            // file extensions to look for in a ZIP archive
            const extensions = ['.md', '.tex', '.latex']; // TODO: .xml, .html
            const isAccepted = Object.keys(zip.files).some((name) => {
                const { ext } = path_parse_1.default(name);
                return extensions.includes(ext);
            });
            if (!isAccepted) {
                this.setState({ rejected: file });
            }
        });
    }
    render() {
        const rejected = this.state.rejected;
        if (rejected) {
            return (React.createElement(style_guide_1.Dialog, { isOpen: true, category: style_guide_1.Category.error, header: 'Import error', message: React.createElement("div", null,
                    React.createElement("div", null,
                        "Files you dropped in could not be imported.",
                        React.createElement("ul", null, React.createElement("li", { key: rejected.name }, rejected.name))),
                    React.createElement("div", null,
                        "The following file formats are supported:",
                        React.createElement("ul", null, importers_1.acceptedFileDescription().map((description) => (React.createElement("li", { key: description }, description)))))), actions: {
                    primary: {
                        action: this.handleCancel,
                        title: 'OK',
                    },
                } }));
        }
        return (React.createElement(react_dropzone_1.default, { onDrop: this.handleDrop, accept: [
                importers_1.acceptedMimeTypes().join(','),
                importers_1.acceptedFileExtensions().join(','),
            ].join(','), noClick: true, multiple: false }, ({ isDragActive, isDragAccept, getRootProps }) => (React.createElement(StyledDropArea, Object.assign({}, getRootProps()), this.props.render({
            handleClick: this.handleClick,
            isDragActive,
            isDragAccept,
        })))));
    }
}
exports.default = ModalProvider_1.withModal(ImportContainer);
//# sourceMappingURL=ImportContainer.js.map