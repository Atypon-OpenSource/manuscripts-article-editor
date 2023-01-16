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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAffiliationContainer = exports.bibliographyItemTypeOptions = exports.buildInitialValues = exports.FormFields = exports.FlexForm = exports.FormField = exports.LabelContainer = void 0;
const AddAuthor_1 = __importDefault(require("@manuscripts/assets/react/AddAuthor"));
const AnnotationRemove_1 = __importDefault(require("@manuscripts/assets/react/AnnotationRemove"));
const ArrowDownBlue_1 = __importDefault(require("@manuscripts/assets/react/ArrowDownBlue"));
const library_1 = require("@manuscripts/library");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const style_guide_1 = require("@manuscripts/style-guide");
const title_editor_1 = require("@manuscripts/title-editor");
const formik_1 = require("formik");
const react_1 = __importStar(require("react"));
const react_tooltip_1 = __importDefault(require("react-tooltip"));
const styled_components_1 = __importDefault(require("styled-components"));
const DeleteIcon_1 = require("../projects/lean-workflow/icons/DeleteIcon");
const LinkIcon_1 = require("../projects/lean-workflow/icons/LinkIcon");
const SelectField_1 = require("../SelectField");
exports.LabelContainer = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.grid.unit}px;
`;
const Label = styled_components_1.default.label `
  font-family: ${(props) => props.theme.font.family.sans};
  font-size: ${(props) => props.theme.font.size.medium};
  display: flex;
  color: ${(props) => props.theme.colors.text.secondary};
`;
const FieldLabel = styled_components_1.default.label `
  font-family: ${(props) => props.theme.font.family.sans};
  font-size: ${(props) => props.theme.font.size.medium};
  color: ${(props) => props.theme.colors.text.muted};
  padding-right: ${(props) => props.theme.grid.unit * 3}px;
`;
const NameFieldContainer = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.colors.background.primary};
  :not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.colors.text.muted};
  }
`;
const NameField = styled_components_1.default.input `
  font-size: ${(props) => props.theme.font.size.normal};
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 4}px;
  box-sizing: border-box;
  border: none;
  background-color: transparent;
  width: 50%;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.text.muted};
  }

  &:hover::placeholder {
    color: ${(props) => props.theme.colors.text.secondary};
  }
`;
const StyledTitleField = styled_components_1.default(title_editor_1.TitleField) `
  & .ProseMirror {
    font-family: ${(props) => props.theme.font.family.sans};
    font-size: ${(props) => props.theme.font.size.medium};
    line-height: 1.25;
    color: ${(props) => props.theme.colors.text.primary};
    border-radius: ${(props) => props.theme.grid.radius.small};
    border: 1px solid ${(props) => props.theme.colors.text.muted};
    padding: ${(props) => props.theme.grid.unit * 2}px
      ${(props) => props.theme.grid.unit * 3}px;
    min-height: ${(props) => props.theme.grid.unit * 21}px;
    &:focus {
      outline: none;
      border-color: ${(props) => props.theme.colors.border.field.hover};
      background-color: ${(props) => props.theme.colors.background.fifth};
    }
  }

  &:hover {
    & .ProseMirror {
      background-color: ${(props) => props.theme.colors.background.fifth};
    }
  }
`;
const FormTextField = styled_components_1.default(style_guide_1.TextField) `
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 3}px;
`;
const ContainerTextField = styled_components_1.default(FormTextField) `
  min-height: ${(props) => props.theme.grid.unit * 15}px;
`;
const YearField = styled_components_1.default(formik_1.Field) `
  font-family: ${(props) => props.theme.font.family.sans};
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 3}px;
  font-size: ${(props) => props.theme.font.size.medium};
  color: ${(props) => props.theme.colors.text.primary};
  border-radius: ${(props) => props.theme.grid.radius.small};
  border: solid 1px ${(props) => props.theme.colors.text.muted};
`;
const Button = styled_components_1.default(style_guide_1.IconButton).attrs({
    defaultColor: true,
    size: 24,
}) `
  circle,
  use {
    fill: ${(props) => props.theme.colors.brand.default};
  }

  path {
    mask: none;
  }
`;
const Actions = styled_components_1.default.div `
  flex-shrink: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.grid.unit * 8}px;

  .tooltip {
    max-width: ${(props) => props.theme.grid.unit * 39}px;
    padding: ${(props) => props.theme.grid.unit * 2}px;
    border-radius: 6px;
  }
`;
exports.FormField = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 3}px;
  padding-left: ${(props) => props.theme.grid.unit * 8}px;
`;
exports.FlexForm = styled_components_1.default(formik_1.Form) `
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
exports.FormFields = styled_components_1.default.div `
  flex: 1;
  overflow-y: auto;
`;
const AuthorDropDown = ({ author, index, remove, handleChange }) => {
    const [isOpen, setIsOpen] = react_1.useState(!!author['isNew']);
    const fullName = [author.given, author.family].join(' ').trim();
    const title = fullName.length > 0 ? fullName : 'Edit author name';
    return (react_1.default.createElement(Section, { key: author._id },
        react_1.default.createElement(Title, null,
            react_1.default.createElement(ToggleButton, { type: "button", onClick: () => setIsOpen(!isOpen), isOpen: isOpen },
                react_1.default.createElement(DropdownIndicator, null,
                    react_1.default.createElement(ArrowDownBlue_1.default, null)),
                title),
            react_1.default.createElement(RemoveButton, { type: "button", "aria-label": "Delete this affiliation", onClick: () => remove(index) },
                react_1.default.createElement(AnnotationRemove_1.default, null))),
        isOpen && (react_1.default.createElement(AuthorForm, null,
            react_1.default.createElement(formik_1.Field, { name: `author.${index}.given`, value: author.given, onChange: handleChange }, ({ field }) => (react_1.default.createElement(NameFieldContainer, null,
                react_1.default.createElement(NameField, Object.assign({}, field, { id: field.name, placeholder: 'Given', autoFocus: true })),
                react_1.default.createElement(FieldLabel, { htmlFor: field.name }, "Given")))),
            react_1.default.createElement(formik_1.Field, { name: `author.${index}.family`, value: author.family, onChange: handleChange }, ({ field }) => (react_1.default.createElement(NameFieldContainer, null,
                react_1.default.createElement(NameField, Object.assign({}, field, { id: field.name, placeholder: 'Family', autoFocus: true })),
                react_1.default.createElement(FieldLabel, { htmlFor: field.name }, "Family"))))))));
};
const buildInitialValues = (item) => ({
    _id: item._id,
    title: item.title,
    author: item.author,
    keywordIDs: item.keywordIDs,
    DOI: item.DOI,
    issued: item.issued,
    type: item.type,
    'container-title': item['container-title'],
    URL: item.URL,
    issue: item.issue ? String(item.issue) : undefined,
    volume: item.volume ? String(item.volume) : undefined,
    page: item.page ? String(item.page) : undefined,
});
exports.buildInitialValues = buildInitialValues;
exports.bibliographyItemTypeOptions = Array.from(library_1.bibliographyItemTypes.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
const ReferenceForm = ({ item, formMikRef, disableDelete, deleteCallback, handleCancel, saveCallback, }) => {
    const formRef = react_1.useRef(null);
    react_1.useEffect(() => {
        if (formRef.current) {
            formRef.current.scrollTop = 0;
        }
    }, [item]);
    const [showDeleteDialog, setShowDeleteDialog] = react_1.useState(false);
    const deleteClickCallback = react_1.useCallback(() => setShowDeleteDialog(true), []);
    return (react_1.default.createElement(formik_1.Formik, { initialValues: exports.buildInitialValues(item), onSubmit: saveCallback, innerRef: formMikRef, enableReinitialize: true }, ({ values, setFieldValue, handleChange }) => {
        return (react_1.default.createElement(exports.FlexForm, null,
            react_1.default.createElement(style_guide_1.Dialog, { isOpen: showDeleteDialog, category: style_guide_1.Category.confirmation, header: "Delete Reference", message: "Are you sure you want to delete this reference from the list?", actions: {
                    secondary: {
                        action: () => {
                            deleteCallback();
                            setShowDeleteDialog(false);
                        },
                        title: 'Delete',
                    },
                    primary: {
                        action: () => setShowDeleteDialog(false),
                        title: 'Cancel',
                    },
                } }),
            react_1.default.createElement(Actions, null,
                react_1.default.createElement(style_guide_1.ButtonGroup, null,
                    react_1.default.createElement(style_guide_1.IconButton, { defaultColor: true, as: "a", href: `https://doi.org/${values.DOI}`, target: '_blank' },
                        react_1.default.createElement(LinkIcon_1.LinkIcon, null)),
                    react_1.default.createElement("div", { "data-tip": true, "data-for": 'delete-button' },
                        react_1.default.createElement(DeleteButton, { defaultColor: true, disabled: disableDelete, onClick: deleteClickCallback },
                            react_1.default.createElement(DeleteIcon_1.DeleteIcon, null)),
                        react_1.default.createElement(react_tooltip_1.default, { disable: !disableDelete, id: 'delete-button', place: "bottom", effect: "solid", offset: { top: 15 }, className: "tooltip" }, "Unable to delete because the item is used in the document"))),
                react_1.default.createElement(style_guide_1.ButtonGroup, null,
                    react_1.default.createElement(style_guide_1.SecondaryButton, { onClick: handleCancel }, "Cancel"),
                    react_1.default.createElement(style_guide_1.PrimaryButton, { type: "submit" }, "Save"))),
            react_1.default.createElement(exports.FormFields, { ref: formRef },
                react_1.default.createElement(exports.FormField, null,
                    react_1.default.createElement(exports.LabelContainer, null,
                        react_1.default.createElement(Label, { htmlFor: 'citation-item-type' }, "Type")),
                    react_1.default.createElement(formik_1.Field, { id: 'citation-item-type', name: 'type', component: SelectField_1.SelectField, options: exports.bibliographyItemTypeOptions })),
                react_1.default.createElement(exports.FormField, null,
                    react_1.default.createElement(exports.LabelContainer, null,
                        react_1.default.createElement(Label, null, "Title")),
                    react_1.default.createElement(StyledTitleField, { value: values.title || '', handleChange: (data) => setFieldValue('title', data), autoFocus: !values.title })),
                react_1.default.createElement(formik_1.FieldArray, { name: 'author', render: ({ push, remove }) => (react_1.default.createElement(exports.FormField, null,
                        react_1.default.createElement(exports.LabelContainer, null,
                            react_1.default.createElement(Label, null, "Authors"),
                            react_1.default.createElement(Button, { onClick: () => push(manuscript_transform_1.buildBibliographicName({
                                    given: '',
                                    family: '',
                                    isNew: true,
                                })) },
                                react_1.default.createElement(AddAuthor_1.default, { height: 17, width: 17 }))),
                        react_1.default.createElement("div", null, values.author &&
                            values.author.map((author, index) => (react_1.default.createElement(AuthorDropDown, { key: index, index: index, author: author, remove: remove, handleChange: handleChange })))))) }),
                react_1.default.createElement(exports.FormField, null,
                    react_1.default.createElement(exports.LabelContainer, null,
                        react_1.default.createElement(Label, { htmlFor: "issued['date-parts'][0][0]" }, "Year")),
                    react_1.default.createElement(YearField, { name: "issued['date-parts'][0][0]", type: 'number', step: 1, onChange: (event) => {
                            const { value } = event.target;
                            if (value) {
                                if (values.issued) {
                                    // NOTE: this assumes that "issued" is already a complete object
                                    setFieldValue("issued['date-parts'][0][0]", Number(value));
                                }
                                else {
                                    setFieldValue('issued', manuscript_transform_1.buildBibliographicDate({
                                        'date-parts': [[Number(value)]],
                                    }));
                                }
                            }
                            else {
                                // NOTE: not undefined due to https://github.com/jaredpalmer/formik/issues/2180
                                setFieldValue('issued', '');
                            }
                        } })),
                react_1.default.createElement(exports.FormField, null,
                    react_1.default.createElement(exports.LabelContainer, null,
                        react_1.default.createElement(Label, { htmlFor: 'container-title' }, "Container Title")),
                    react_1.default.createElement(formik_1.Field, { name: 'container-title' }, (props) => (react_1.default.createElement(ContainerTextField, Object.assign({ id: 'container-title' }, props.field))))),
                react_1.default.createElement(exports.FormField, null,
                    react_1.default.createElement(exports.LabelContainer, null,
                        react_1.default.createElement(Label, { htmlFor: 'volume' }, "Volume")),
                    react_1.default.createElement(formik_1.Field, { name: 'volume' }, (props) => (react_1.default.createElement(FormTextField, Object.assign({ id: 'volume' }, props.field))))),
                react_1.default.createElement(exports.FormField, null,
                    react_1.default.createElement(exports.LabelContainer, null,
                        react_1.default.createElement(Label, { htmlFor: 'issue' }, "Issue")),
                    react_1.default.createElement(formik_1.Field, { name: 'issue' }, (props) => (react_1.default.createElement(FormTextField, Object.assign({ id: 'issue' }, props.field))))),
                react_1.default.createElement(exports.FormField, null,
                    react_1.default.createElement(exports.LabelContainer, null,
                        react_1.default.createElement(Label, { htmlFor: 'page' }, "Page")),
                    react_1.default.createElement(formik_1.Field, { name: 'page' }, (props) => (react_1.default.createElement(FormTextField, Object.assign({ id: 'page' }, props.field))))),
                react_1.default.createElement(exports.FormField, null,
                    react_1.default.createElement(exports.LabelContainer, null,
                        react_1.default.createElement(Label, { htmlFor: 'url' }, "URL")),
                    react_1.default.createElement(formik_1.Field, { name: 'URL' }, (props) => (react_1.default.createElement(FormTextField, Object.assign({ type: 'url', id: 'url' }, props.field))))),
                react_1.default.createElement(exports.FormField, null,
                    react_1.default.createElement(exports.LabelContainer, null,
                        react_1.default.createElement(Label, { htmlFor: 'doi' }, "DOI")),
                    react_1.default.createElement(formik_1.Field, { name: 'DOI' }, (props) => (react_1.default.createElement(FormTextField, Object.assign({ id: 'doi', pattern: '(https://doi.org/)?10..+' }, props.field))))),
                react_1.default.createElement(exports.FormField, null,
                    react_1.default.createElement(exports.LabelContainer, null,
                        react_1.default.createElement(Label, { htmlFor: 'supplement' }, "Supplement")),
                    react_1.default.createElement(formik_1.Field, { name: 'Supplement' }, (props) => (react_1.default.createElement(FormTextField, Object.assign({ type: 'supplement', id: 'supplement' }, props.field))))))));
    }));
};
exports.default = ReferenceForm;
const DeleteButton = styled_components_1.default(style_guide_1.IconButton) `
  background-color: ${(props) => props.theme.colors.background.primary} !important;
  border-color: ${(props) => props.theme.colors.background.primary} !important;
  .icon_element {
    fill: ${(props) => (props.disabled && '#c9c9c9') || '#F35143'} !important;
  }
`;
const Section = styled_components_1.default.section `
  border: 1px solid ${(props) => props.theme.colors.border.field.default};
  border-radius: ${(props) => props.theme.grid.radius.default};
  background: ${(props) => props.theme.colors.background.primary};
  margin-bottom: ${(props) => props.theme.grid.unit * 3}px;
  overflow: hidden;
`;
const AuthorForm = styled_components_1.default(Section) `
  margin: ${(props) => props.theme.grid.unit * 3}px;
`;
const Title = styled_components_1.default.h4 `
  margin: 0;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  padding-right: 0.5rem;
  background: ${(props) => props.isInvalid ? props.theme.colors.background.warning : 'transparent'};
  color: ${(props) => props.isInvalid ? props.theme.colors.text.warning : 'inherit'};
`;
const DropdownIndicator = styled_components_1.default(ArrowDownBlue_1.default) `
  border: 0;
  border-radius: 50%;
  margin-right: 0.6em;
  min-width: 20px;
`;
const ToggleButton = styled_components_1.default.button `
  flex-grow: 1;
  display: flex;
  align-items: center;
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  font-family: ${(props) => props.theme.font.family.sans};
  font-size: 1rem;
  padding: 0.6em 0.5em;

  outline: none;

  &:focus {
    color: ${(props) => props.theme.colors.button.primary.border.hover};
  }

  svg {
    transform: ${(props) => (props.isOpen ? 'rotateX(180deg)' : 'initial')};
  }
`;
const RemoveButton = styled_components_1.default.button `
  border: none;
  background: transparent;
  padding: 0;

  outline: none;

  &:focus path {
    fill: ${(props) => props.theme.colors.button.primary.color.hover};
  }

  svg {
    width: 2rem;
    height: 2rem;
  }
`;
exports.AddAffiliationContainer = styled_components_1.default.div `
  padding-right: 0.71rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  circle,
  use {
    fill: ${(props) => props.theme.colors.brand.default};
  }

  path {
    mask: none;
  }
`;
//# sourceMappingURL=ReferenceForm.js.map