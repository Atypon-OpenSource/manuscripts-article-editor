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
const HorizontalEllipsis_1 = __importDefault(require("@manuscripts/assets/react/HorizontalEllipsis"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const ModalProvider_1 = require("../ModalProvider");
const Dropdown_1 = require("../nav/Dropdown");
const DeleteConfirmationDialog_1 = require("./DeleteConfirmationDialog");
const ProjectContextMenu_1 = __importDefault(require("./ProjectContextMenu"));
const RenameProject_1 = __importDefault(require("./RenameProject"));
const ContextMenuIconButton = styled_components_1.default(style_guide_1.IconButton) `
  height: unset;
  width: unset;

  &:focus {
    outline: none;
  }
`;
class ProjectContextMenuButton extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isOpen: false,
            isRenameOpen: false,
        };
        this.nodeRef = react_1.default.createRef();
        this.toggleOpen = () => {
            this.setOpen(!this.state.isOpen);
        };
        this.setOpen = (isOpen) => {
            this.setState({ isOpen });
            this.updateListener(isOpen);
        };
        this.handleClickOutside = (event) => {
            if (this.nodeRef.current &&
                !this.nodeRef.current.contains(event.target)) {
                this.setOpen(false);
            }
        };
        this.updateListener = (isOpen) => {
            if (isOpen) {
                document.addEventListener('mousedown', this.handleClickOutside);
            }
            else {
                document.removeEventListener('mousedown', this.handleClickOutside);
            }
        };
        this.deleteProject = () => __awaiter(this, void 0, void 0, function* () {
            yield this.props.deleteProject();
            // TODO: delete project models and collection
            this.props.history.push('/projects');
        });
        this.renameProject = () => this.setState({
            isRenameOpen: true,
        });
    }
    componentWillUnmount() {
        this.setOpen(false);
    }
    render() {
        const { isOpen, isRenameOpen } = this.state;
        const { closeModal, project } = this.props;
        return (react_1.default.createElement(Dropdown_1.DropdownContainer, { ref: this.nodeRef, onClick: (event) => event.stopPropagation() },
            react_1.default.createElement(ContextMenuIconButton, { onClick: this.toggleOpen },
                react_1.default.createElement(HorizontalEllipsis_1.default, null)),
            react_1.default.createElement(DeleteConfirmationDialog_1.DeleteConfirmationDialog, { handleDelete: this.deleteProject }, ({ handleRequestDelete }) => isOpen ? (react_1.default.createElement(Dropdown_1.Dropdown, { direction: 'right', top: 24 },
                react_1.default.createElement(ProjectContextMenu_1.default, { project: project, deleteProject: handleRequestDelete, renameProject: this.renameProject, closeModal: closeModal }))) : null),
            isRenameOpen &&
                this.props.addModal('rename-project', ({ handleClose }) => (react_1.default.createElement(RenameProject_1.default, { project: this.props.project, saveProjectTitle: this.props.saveProjectTitle, handleComplete: () => {
                        handleClose();
                        this.setState({
                            isRenameOpen: false,
                        });
                    } })))));
    }
}
exports.default = ModalProvider_1.withModal(react_router_dom_1.withRouter(ProjectContextMenuButton));
//# sourceMappingURL=ProjectContextMenuButton.js.map