"use strict";
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
exports.ManualFlowTransitioning = void 0;
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
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../../../config"));
const use_dropdown_1 = require("../../../hooks/use-dropdown");
const lean_workflow_gql_1 = require("../../../lib/lean-workflow-gql");
const roles_1 = require("../../../lib/roles");
const Loading_1 = require("../../Loading");
const Dropdown_1 = require("../../nav/Dropdown");
const inputs_1 = require("../inputs");
const ExceptionDialog_1 = require("./ExceptionDialog");
const AnnotatorIcon_1 = require("./icons/AnnotatorIcon");
const EditIcon_1 = require("./icons/EditIcon");
const ReadingIcon_1 = require("./icons/ReadingIcon");
const Editing = { label: 'Editing', icon: EditIcon_1.EditIcon };
const MapUserRole = {
    [roles_1.ProjectRole.editor]: Editing,
    [roles_1.ProjectRole.owner]: Editing,
    [roles_1.ProjectRole.writer]: Editing,
    [roles_1.ProjectRole.annotator]: { label: 'Suggesting...', icon: AnnotatorIcon_1.AnnotatorIcon },
    [roles_1.ProjectRole.viewer]: { label: 'Reading', icon: ReadingIcon_1.ReadingIcon },
};
const ManualFlowTransitioning = ({ submission, userRole, documentId, children, hasPendingSuggestions, }) => {
    var _a, _b, _c;
    const can = style_guide_1.usePermissions();
    const { submitProceedMutation, mutationError } = lean_workflow_gql_1.useProceed();
    const [confirmationDialog, toggleConfirmationDialog] = react_1.useState(false);
    const [loading, setLoading] = react_1.useState(false);
    const [showComplete, setShowComplete] = react_1.useState(false);
    const [noteValue, setNoteValue] = react_1.useState('');
    const [error, setError] = react_1.useState(undefined);
    const [selectedTransitionIndex, setSelectedTransitionIndex,] = react_1.useState();
    const continueDialogAction = react_1.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!submission || !selectedTransitionIndex) {
            return;
        }
        const { status } = submission.currentStep.type.transitions[selectedTransitionIndex];
        setLoading(true);
        return yield submitProceedMutation({
            submissionId: submission === null || submission === void 0 ? void 0 : submission.id,
            statusId: status.id,
            note: noteValue,
            update: (cache, { data }) => {
                if (data === null || data === void 0 ? void 0 : data.proceed) {
                    setShowComplete(true);
                    const cachedSubmission = cache.readQuery({
                        query: lean_workflow_gql_1.GET_SUBMISSION,
                        variables: { id: documentId, type: 'DOCUMENT_ID' },
                    });
                    if (cachedSubmission === null || cachedSubmission === void 0 ? void 0 : cachedSubmission.submission.currentStep) {
                        cache.writeQuery({
                            query: lean_workflow_gql_1.GET_SUBMISSION,
                            variables: { id: data.proceed.id },
                            data: {
                                submission: Object.assign(Object.assign({}, cachedSubmission.submission), data.proceed),
                            },
                        });
                    }
                }
                else {
                    setError('Server refused to proceed with your submission');
                }
                setLoading(false);
            },
        }).catch((error) => {
            if (!error.graphQLErrors) {
                setError('Unable to proceed with your submission.');
            }
            else {
                toggleConfirmationDialog(false);
            }
            setLoading(false);
        });
    }), [
        submitProceedMutation,
        setError,
        selectedTransitionIndex,
        submission,
        noteValue,
        documentId,
    ]);
    const onTransitionClick = react_1.useCallback((event) => {
        toggleConfirmationDialog(true);
        setSelectedTransitionIndex(event.target.value);
    }, [setSelectedTransitionIndex, toggleConfirmationDialog]);
    const onCancelClick = react_1.useCallback(() => {
        toggleConfirmationDialog(false);
        setSelectedTransitionIndex(undefined);
        setError(undefined);
    }, [toggleConfirmationDialog, setSelectedTransitionIndex, setError]);
    const onNoteChange = react_1.useCallback((event) => setNoteValue(event.target.value), [setNoteValue]);
    const onDashboardRedirectClick = react_1.useCallback(() => {
        window.location.href = config_1.default.leanWorkflow.dashboardUrl;
    }, []);
    const isAnnotator = userRole === roles_1.ProjectRole.annotator;
    const dialogMessages = react_1.useMemo(() => hasPendingSuggestions && !isAnnotator
        ? {
            header: 'The task can not be transitioned to the next step',
            message: `There are still pending suggestions in the document.         
            It is not possible to complete the task without having them approved or rejected.`,
            actions: {
                primary: {
                    action: onCancelClick,
                    title: 'Ok',
                },
            },
        }
        : showComplete
            ? {
                header: 'Content reassigned successfully',
                message: `to the ${submission.nextStep.type.label}`,
                actions: {
                    primary: {
                        action: onCancelClick,
                        title: 'Close',
                    },
                    secondary: {
                        action: onDashboardRedirectClick,
                        title: 'Go to dashboard',
                    },
                },
            }
            : {
                header: 'Are you sure?',
                message: 'You are about to complete your task. If you confirm, you will no longer be able to make any changes.',
                actions: {
                    primary: {
                        action: continueDialogAction,
                        title: 'Continue',
                    },
                    secondary: {
                        action: onCancelClick,
                        title: 'Cancel',
                    },
                },
            }, [
        showComplete,
        continueDialogAction,
        onDashboardRedirectClick,
        onCancelClick,
        submission.nextStep.type.label,
        hasPendingSuggestions,
        isAnnotator,
    ]);
    const currentStepTransition = submission === null || submission === void 0 ? void 0 : submission.currentStep.type.transitions;
    const disable = !currentStepTransition || !can.completeTask;
    const errorCode = (_c = (_b = (_a = mutationError === null || mutationError === void 0 ? void 0 : mutationError.graphQLErrors) === null || _a === void 0 ? void 0 : _a.find((error) => { var _a; return (_a = error === null || error === void 0 ? void 0 : error.extensions) === null || _a === void 0 ? void 0 : _a.code; })) === null || _b === void 0 ? void 0 : _b.extensions) === null || _c === void 0 ? void 0 : _c.code.name;
    return (react_1.default.createElement(Wrapper, null,
        (currentStepTransition && (currentStepTransition === null || currentStepTransition === void 0 ? void 0 : currentStepTransition.length) > 1 && (react_1.default.createElement(DropdownWrapper, { button: 'Complete task', disabled: disable, primary: true },
            react_1.default.createElement(TaskDropdown, null, currentStepTransition &&
                currentStepTransition.map((transition, index) => (react_1.default.createElement(Task, { key: 'task_' + transition.type.id, className: transition.status.id === 'success' ? 'happyPath' : '', value: index, onClick: onTransitionClick },
                    react_1.default.createElement("strong", null, transition.type.label),
                    transition.type.description))))))) || (react_1.default.createElement(style_guide_1.PrimaryButton, { value: 0, onClick: onTransitionClick, disabled: disable }, "Complete task")),
        (loading && (react_1.default.createElement(Loading_1.LoadingOverlay, null,
            react_1.default.createElement(Loading_1.Loading, null, "proceeding with your submission\u2026")))) || (react_1.default.createElement(style_guide_1.Dialog, { isOpen: confirmationDialog && !loading, category: style_guide_1.Category.confirmation, header: dialogMessages.header, message: dialogMessages.message, actions: dialogMessages.actions },
            (showComplete && (react_1.default.createElement(Grid, null,
                react_1.default.createElement(StepDetails, Object.assign({}, submission.currentStep.type, { icon: react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(style_guide_1.TaskStepDoneIcon, null),
                        react_1.default.createElement(Line, null)) })),
                react_1.default.createElement(StepDetails, Object.assign({}, submission.nextStep.type))))) ||
                ((!hasPendingSuggestions || isAnnotator) && (react_1.default.createElement(TextAreaWrapper, null,
                    react_1.default.createElement(inputs_1.MediumTextArea, { value: noteValue, onChange: onNoteChange, rows: 5, placeholder: 'Add any additional comment here...' })))),
            error && (react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.error, hideCloseButton: true }, error)))),
        react_1.default.createElement(DropdownWrapper, { button: react_1.default.createElement(react_1.default.Fragment, null,
                userRole && react_1.default.createElement(MapUserRole[userRole].icon),
                react_1.default.createElement("span", null, userRole && MapUserRole[userRole].label)), disabled: true }),
        react_1.default.createElement(ChildWrapper, null, children),
        errorCode && react_1.default.createElement(ExceptionDialog_1.ExceptionDialog, { errorCode: errorCode })));
};
exports.ManualFlowTransitioning = ManualFlowTransitioning;
const DropdownWrapper = ({ disabled, button, primary, children }) => {
    const { isOpen, toggleOpen, wrapperRef } = use_dropdown_1.useDropdown();
    const onDropdownButtonClick = react_1.useCallback(() => toggleOpen(), [toggleOpen]);
    return (react_1.default.createElement(Dropdown_1.DropdownContainer, { id: 'user-dropdown', ref: wrapperRef },
        react_1.default.createElement(Dropdown_1.DropdownButton, { as: (primary && style_guide_1.PrimaryButton) || undefined, disabled: disabled, isOpen: isOpen, onClick: onDropdownButtonClick }, button),
        isOpen && react_1.default.createElement(Dropdown_1.Dropdown, { direction: "left" }, children)));
};
const StepDetails = ({ icon, label, description, role }) => (react_1.default.createElement(react_1.default.Fragment, null,
    icon && react_1.default.createElement(TaskStatus, null, icon),
    react_1.default.createElement(TaskContainer, null,
        react_1.default.createElement(style_guide_1.PrimaryBoldHeading, null, label),
        react_1.default.createElement(style_guide_1.SecondarySmallText, null, description),
        react_1.default.createElement(style_guide_1.SecondarySmallText, null,
            "Actor: ",
            role.label))));
const Wrapper = styled_components_1.default.div `
  display: flex;
  padding: ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 15}px 0;
  margin-top: ${(props) => props.theme.grid.unit * 4}px;

  ${Dropdown_1.DropdownContainer} + ${Dropdown_1.DropdownContainer} {
    margin-left: ${(props) => props.theme.grid.unit * 2}px;
  }
  ${style_guide_1.PrimaryButton} + ${Dropdown_1.DropdownContainer} {
    margin-left: ${(props) => props.theme.grid.unit * 2}px;
  }
`;
const TaskDropdown = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.theme.grid.unit * 2}px 0;
`;
const Task = styled_components_1.default.button `
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.text.secondary};
  cursor: pointer;
  font: ${(props) => props.theme.font.weight.normal}
    ${(props) => props.theme.font.size.small} /
    ${(props) => props.theme.font.lineHeight.normal}
    ${(props) => props.theme.font.family.sans};
  order: 1;
  outline: none;
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 4}px;
  text-align: left;
  width: ${(props) => props.theme.grid.unit * 66}px;

  &:not([disabled]):hover,
  &:not([disabled]):focus {
    background-color: ${(props) => props.theme.colors.button.default.background.hover};
  }

  strong {
    color: ${(props) => props.theme.colors.text.primary};
    display: block;
    font-size: ${(props) => props.theme.font.size.normal};
    line-height: ${(props) => props.theme.font.lineHeight.normal};
  }

  &.happyPath {
    border-bottom: 1px solid ${(props) => props.theme.colors.border.tertiary};
    order: 0;
  }
`;
const TextAreaWrapper = styled_components_1.default.div `
  margin-top: ${(props) => props.theme.grid.unit * 4}px;
`;
const ChildWrapper = styled_components_1.default.div `
  display: inline-flex;
  margin: 0 2em;
  flex-direction: row;
  align-items: center;
`;
const Grid = styled_components_1.default.div `
  display: grid;
  grid-template-columns: max-content auto;
  gap: 0 ${(props) => props.theme.grid.unit * 2}px;
  margin-top: ${(props) => props.theme.grid.unit * 4}px;
  background: ${(props) => props.theme.colors.background.secondary};
  padding: ${(props) => props.theme.grid.unit * 6}px;
`;
const TaskStatus = styled_components_1.default.div `
  grid-column: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5px;
`;
const TaskContainer = styled_components_1.default.div `
  grid-column: 2;
  margin-bottom: 8px;
`;
const Line = styled_components_1.default.hr `
  margin: 5px 0 0 0;
  flex: 1;
  border: 1px dashed #c9c9c9;
`;
//# sourceMappingURL=ManualFlowTransitioning.js.map