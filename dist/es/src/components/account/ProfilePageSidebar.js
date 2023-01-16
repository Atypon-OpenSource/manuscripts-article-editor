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
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const images_1 = require("../../lib/images");
const UserProfileSidebar_1 = __importDefault(require("../UserProfileSidebar"));
const AvatarFileUpload_1 = require("./AvatarFileUpload");
class ProfilePageSidebar extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            editAvatar: false,
            newAvatar: null,
            avatarZoom: 1,
            avatarError: false,
        };
        this.avatarEditorRef = react_1.default.createRef();
        this.openEditor = () => {
            this.setState({
                newAvatar: null,
                editAvatar: true,
                avatarZoom: 1,
            });
        };
        this.closeEditor = () => {
            this.setState({
                editAvatar: false,
            });
        };
        this.handleSaveAvatar = () => __awaiter(this, void 0, void 0, function* () {
            const canvasElement = this.avatarEditorRef.current.getImage();
            const blob = yield this.canvasToBlob(canvasElement);
            yield this.props.saveUserProfileAvatar(blob);
            this.closeEditor();
        });
        this.handleDeleteAvatar = () => __awaiter(this, void 0, void 0, function* () {
            yield this.props.deleteUserProfileAvatar();
            this.closeEditor();
        });
        this.canvasToBlob = (canvasElement) => new Promise((resolve, reject) => {
            canvasElement.toBlob((blob) => (blob ? resolve(blob) : reject()));
        });
        this.handleAvatarZoom = (event) => this.setState({
            avatarZoom: Number(event.currentTarget.value),
        });
        this.importAvatar = (file) => {
            if (!images_1.isImage(file)) {
                return this.setState({ avatarError: true });
            }
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const image = new Image();
                image.onload = () => {
                    const maxSize = 150;
                    let height;
                    let width;
                    if (image.width < image.height) {
                        width = maxSize;
                    }
                    else {
                        height = maxSize;
                    }
                    this.setState({
                        newAvatar: { src: fileReader.result, width, height, file },
                    });
                };
                image.src = fileReader.result;
            };
            fileReader.readAsDataURL(file);
        };
    }
    render() {
        const { userWithAvatar, handleChangePassword, handleDeleteAccount, } = this.props;
        const { editAvatar, newAvatar, avatarZoom, avatarError } = this.state;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            editAvatar ? (react_1.default.createElement(AvatarFileUpload_1.AvatarFileUpload, { newAvatar: newAvatar, avatarZoom: avatarZoom, avatarEditorRef: this.avatarEditorRef, userWithAvatar: userWithAvatar, importAvatar: this.importAvatar, handleCancel: this.closeEditor, handleSaveAvatar: this.handleSaveAvatar, handleDeleteAvatar: this.handleDeleteAvatar, handleAvatarZoom: this.handleAvatarZoom })) : (react_1.default.createElement(UserProfileSidebar_1.default, { userWithAvatar: userWithAvatar, handleChangePassword: handleChangePassword, handleDeleteAccount: handleDeleteAccount, handleEditAvatar: this.openEditor })),
            avatarError && (react_1.default.createElement(style_guide_1.Dialog, { isOpen: true, category: style_guide_1.Category.error, header: 'Add avatar failed', message: `The avatar must be an image file of one of the following types: ${images_1.ImageTypes.join(', ')}.`, actions: {
                    primary: {
                        action: () => this.setState({ avatarError: false }),
                        title: 'OK',
                    },
                } }))));
    }
}
exports.default = ProfilePageSidebar;
//# sourceMappingURL=ProfilePageSidebar.js.map