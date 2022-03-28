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
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
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
exports.PreflightDialog = void 0;
const OutlineIconManuscript_1 = __importDefault(require("@manuscripts/assets/react/OutlineIconManuscript"));
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const style_guide_1 = require("@manuscripts/style-guide");
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const hasFailedValidations = (validations) => validations.some((validation) => Object.values(validation.alerts).some((alert) => !alert.passed));
const normalizeISSN = (issn) => issn.replace(/\W/g, '');
const PreflightDialog = ({ doc, handleConfirm, handleClose, issns, targetJournals }) => {
    const [targetJournal, setTargetJournal] = react_1.useState();
    const [validations, setValidations] = react_1.useState();
    const [error, setError] = react_1.useState();
    const buildRequirementsAlerts = react_1.useContext(manuscript_editor_1.RequirementsContext);
    const buildValidations = react_1.useCallback((node) => __awaiter(void 0, void 0, void 0, function* () {
        const output = [];
        const alerts = yield buildRequirementsAlerts(node);
        // TODO: author metadata checks
        // alerts['corresponding_author'] = {
        //   passed: true,
        //   message: 'A corresponding author has been selected',
        // }
        //
        // alerts['corresponding_author_email'] = {
        //   passed: true,
        //   message: 'All corresponding authors have email addresses',
        // }
        //
        // alerts['author_affiliations'] = {
        //   passed: true,
        //   message: 'All authors have affiliations',
        // }
        if (Object.keys(alerts).length > 0) {
            output.push({ node, alerts });
        }
        for (const childNode of manuscript_editor_1.iterateChildren(node, true)) {
            if (childNode.attrs.id) {
                const alerts = yield buildRequirementsAlerts(childNode);
                if (Object.keys(alerts).length > 0) {
                    output.push({ node: childNode, alerts });
                }
            }
        }
        return output;
    }), [buildRequirementsAlerts]);
    react_1.useEffect(() => {
        const normalizedISSNs = issns.map(normalizeISSN);
        for (const targetJournal of targetJournals) {
            const normalizedTargetISSN = normalizeISSN(targetJournal.issn);
            if (normalizedISSNs.includes(normalizedTargetISSN)) {
                setTargetJournal(targetJournal);
                return;
            }
        }
        setTargetJournal(null);
    }, [issns, targetJournals]);
    react_1.useEffect(() => {
        if (targetJournal) {
            buildValidations(doc)
                .then(setValidations)
                .catch((error) => {
                setError(error);
            });
        }
    }, [targetJournal, doc, buildValidations]);
    const handleSubmit = react_1.useCallback(() => {
        if (!targetJournal) {
            return;
        }
        if (!hasFailedValidations(validations) ||
            confirm('There are failed validations, are you sure you wish to proceed?')) {
            const submission = manuscript_transform_1.buildSubmission();
            submission.journalCode = targetJournal.journalAbbreviation;
            submission.journalTitle = targetJournal.journalName;
            submission.issn = targetJournal.issn;
            handleConfirm(submission).catch((error) => {
                console.error(error);
            });
        }
    }, [handleConfirm, targetJournal, validations]);
    return (react_1.default.createElement(style_guide_1.StyledModal, { isOpen: true, shouldCloseOnOverlayClick: true, onRequestClose: handleClose },
        react_1.default.createElement(ModalBody, null,
            react_1.default.createElement(ModalTitle, null,
                "Submission",
                targetJournal && (react_1.default.createElement("span", null,
                    ' ',
                    "to ",
                    react_1.default.createElement("i", null, targetJournal.journalName)))),
            react_1.default.createElement(ModalMain, null,
                targetJournal === undefined && react_1.default.createElement("div", null, "Checking\u2026"),
                targetJournal === null && (react_1.default.createElement("div", null, "Submission to this journal is not yet available.")),
                targetJournal && (react_1.default.createElement(ManuscriptTitleContainer, null,
                    react_1.default.createElement(manuscript_editor_1.OutlineItemIcon, null,
                        react_1.default.createElement(StyledManuscriptIcon, null)),
                    react_1.default.createElement(ManuscriptTitle
                    // value={manuscript.title || 'Untitled Manuscript'}
                    , { 
                        // value={manuscript.title || 'Untitled Manuscript'}
                        value: 'Manuscript' }))),
                targetJournal && (react_1.default.createElement(react_1.default.Fragment, null, validations
                    ? validations.map((validation) => (react_1.default.createElement(manuscript_editor_1.Checks, { node: validation.node, alerts: validation.alerts, key: validation.node.attrs.id })))
                    : 'Validating…')),
                error && react_1.default.createElement("div", null, error.message)),
            targetJournal && (react_1.default.createElement(ModalFooter, null,
                react_1.default.createElement(style_guide_1.SecondaryButton, { onClick: handleClose }, "Cancel"),
                react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: handleSubmit, disabled: !validations }, "Submit to Review"))),
            targetJournal === null && (react_1.default.createElement(ModalFooter, null,
                react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: handleClose }, "OK"))),
            targetJournal === undefined && (react_1.default.createElement(ModalFooter, null,
                react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: handleClose }, "Cancel"))))));
};
exports.PreflightDialog = PreflightDialog;
const ModalBody = styled_components_1.default.div `
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: ${(props) => props.theme.grid.radius.default};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  background: ${(props) => props.theme.colors.background.primary};
`;
const ModalTitle = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.large};
  padding: ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 8}px;
`;
const ModalMain = styled_components_1.default.div `
  flex: 1;
  padding: 0 ${(props) => props.theme.grid.unit * 8}px
    ${(props) => props.theme.grid.unit * 4}px;
  max-height: 70vh;
  overflow-y: auto;
`;
const ModalFooter = styled_components_1.default(style_guide_1.ButtonGroup) `
  padding: ${(props) => props.theme.grid.unit * 4}px;
`;
const ManuscriptTitle = styled_components_1.default(title_editor_1.Title) `
  margin-left: ${(props) => props.theme.grid.unit}px;
`;
const ManuscriptTitleContainer = styled_components_1.default.div `
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.grid.unit}px;
`;
const StyledManuscriptIcon = styled_components_1.default(OutlineIconManuscript_1.default) `
  flex-shrink: 0;
  margin-right: ${(props) => props.theme.grid.unit}px;
`;
//# sourceMappingURL=PreflightDialog.js.map