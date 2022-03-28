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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalsContainer = exports.useModal = exports.ModalProvider = exports.ModalContext = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
exports.ModalContext = react_1.default.createContext({
    addModal: () => '',
});
// eslint-disable-next-line @typescript-eslint/ban-types
const ModalProvider = ({ children }) => {
    const [modalsSetter, setModalsSetter] = react_1.useState();
    const addModal = (id, modal) => {
        modalsSetter && modalsSetter(id, modal);
    };
    const value = {
        addModal: addModal,
    };
    return (react_1.default.createElement(exports.ModalContext.Provider, { value: value },
        children,
        react_1.default.createElement(exports.ModalsContainer, { setModalsSetter: (modalSetter) => setModalsSetter(() => modalSetter) })));
};
exports.ModalProvider = ModalProvider;
const useModal = () => react_1.useContext(exports.ModalContext);
exports.useModal = useModal;
const ModalsContainer = ({ setModalsSetter }) => {
    const [state, setState] = react_1.useState({
        modals: [],
    });
    react_1.useEffect(() => {
        setModalsSetter((id, modal) => {
            const modals = state.modals
                .filter((item) => item.id !== id)
                .concat({ id, modal });
            setState(Object.assign(Object.assign({}, state), { modals }));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const closeModal = (id) => {
        setState({
            modals: state.modals.filter((modal) => modal.id !== id),
        });
    };
    return (react_1.default.createElement(react_1.default.Fragment, null, state.modals.map(({ id, modal }) => {
        const handleClose = () => closeModal(id);
        return (react_1.default.createElement(style_guide_1.StyledModal, { key: id, isOpen: true, onRequestClose: handleClose }, modal({ handleClose })));
    })));
};
exports.ModalsContainer = ModalsContainer;
//# sourceMappingURL=ModalHookableProvider.js.map