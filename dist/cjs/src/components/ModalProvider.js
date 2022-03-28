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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalProvider = exports.withModal = exports.ModalContext = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
exports.ModalContext = react_1.default.createContext({
    addModal: () => '',
});
const withModal = (Component) => (props) => (react_1.default.createElement(exports.ModalContext.Consumer, null, (value) => react_1.default.createElement(Component, Object.assign({}, props, value))));
exports.withModal = withModal;
// eslint-disable-next-line @typescript-eslint/ban-types
class ModalProvider extends react_1.default.Component {
    // eslint-disable-next-line @typescript-eslint/ban-types
    constructor(props) {
        super(props);
        this.addModal = (id, modal) => {
            this.setState({
                modals: this.state.modals
                    .filter((item) => item.id !== id)
                    .concat({ id, modal }),
            });
        };
        this.closeModal = (id) => {
            this.setState({
                modals: this.state.modals.filter((modal) => modal.id !== id),
            });
        };
        this.renderModal = () => {
            return this.state.modals.map(({ id, modal }) => {
                const handleClose = () => this.closeModal(id);
                return (react_1.default.createElement(style_guide_1.StyledModal, { key: id, isOpen: true, onRequestClose: handleClose }, modal({ handleClose })));
            });
        };
        this.value = {
            addModal: this.addModal,
        };
        this.state = {
            modals: [],
        };
    }
    render() {
        return (react_1.default.createElement(exports.ModalContext.Provider, { value: this.value },
            this.props.children,
            this.renderModal()));
    }
}
exports.ModalProvider = ModalProvider;
//# sourceMappingURL=ModalProvider.js.map