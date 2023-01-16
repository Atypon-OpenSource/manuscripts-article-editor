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
const formik_1 = require("formik");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const RenameProjectForm_1 = require("../collaboration/RenameProjectForm");
const Messages_1 = require("../Messages");
const ModalContainerInner = styled_components_1.default(style_guide_1.ModalMain) `
  width: 100vw;
  max-width: 480px;
`;
const ModalTitle = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.xlarge};
  margin-bottom: ${(props) => props.theme.grid.unit * 4}px;
`;
const ModalBody = styled_components_1.default.div ``;
const RenameProject = ({ handleComplete, project, saveProjectTitle, }) => (react_1.default.createElement(style_guide_1.ModalContainer, null,
    react_1.default.createElement(style_guide_1.ModalHeader, null,
        react_1.default.createElement(style_guide_1.CloseButton, { onClick: handleComplete })),
    react_1.default.createElement(ModalContainerInner, null,
        react_1.default.createElement(ModalTitle, null, react_1.default.createElement(Messages_1.ProjectRenameMessage, null)),
        react_1.default.createElement(ModalBody, null, react_1.default.createElement(formik_1.Formik, { initialValues: {
                title: project.title || '',
            }, isInitialValid: true, validateOnChange: false, validateOnBlur: false, onSubmit: (values, actions) => __awaiter(void 0, void 0, void 0, function* () {
                actions.setErrors({});
                try {
                    yield saveProjectTitle(values.title);
                    actions.setSubmitting(false);
                    handleComplete();
                }
                catch (error) {
                    actions.setSubmitting(false);
                    const errors = {
                        submit: error.response && 'There was an error',
                    };
                    actions.setErrors(errors);
                }
            }), component: RenameProjectForm_1.RenameProjectForm })))));
exports.default = RenameProject;
//# sourceMappingURL=RenameProject.js.map