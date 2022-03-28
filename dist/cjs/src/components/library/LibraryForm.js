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
const AddAuthor_1 = __importDefault(require("@manuscripts/assets/react/AddAuthor"));
const ArrowDownBlack_1 = __importDefault(require("@manuscripts/assets/react/ArrowDownBlack"));
const library_1 = require("@manuscripts/library");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const style_guide_1 = require("@manuscripts/style-guide");
const title_editor_1 = require("@manuscripts/title-editor");
const formik_1 = require("formik");
const react_1 = __importStar(require("react"));
const creatable_1 = __importDefault(require("react-select/creatable"));
const styled_components_1 = __importDefault(require("styled-components"));
const select_styles_1 = require("../../lib/select-styles");
const SelectField_1 = require("../SelectField");
const LabelContainer = styled_components_1.default.div `
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
const AuthorHeading = styled_components_1.default.button.attrs({
    type: 'button',
}) `
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 3}px;
  cursor: pointer;
  border: none;
  background: none;
  font-size: inherit;
  color: ${(props) => props.isExpanded
    ? props.theme.colors.brand.default
    : props.theme.colors.text.primary};
`;
const FieldLabel = styled_components_1.default.label `
  font-family: ${(props) => props.theme.font.family.sans};
  font-size: ${(props) => props.theme.font.size.medium};
  color: ${(props) => props.theme.colors.text.muted};
  width: 50%;
`;
const NameFieldContainer = styled_components_1.default.div `
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.text.muted};
  background-color: ${(props) => props.theme.colors.background.primary};
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
const CollapsibleAuthorContainer = ({ children, title, action }) => {
    const [expanded, setExpanded] = react_1.useState(!title);
    const toggleExpanded = react_1.useCallback(() => {
        setExpanded((value) => !value);
    }, []);
    return (react_1.default.createElement(AuthorContainer, { isExpanded: expanded },
        react_1.default.createElement(AuthorHeading, { isExpanded: expanded, onClick: toggleExpanded, tabIndex: 0 },
            react_1.default.createElement("span", null, !title ? 'Edit author name' : title),
            react_1.default.createElement(ArrowDownBlack_1.default, { style: {
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                } })),
        expanded && react_1.default.createElement(AuthorContent, null, children),
        expanded && react_1.default.createElement(AuthorActions, null, action)));
};
const AuthorContainer = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.medium};
  background-color: ${(props) => props.isExpanded ? props.theme.colors.background.secondary : 'transparent'};
  overflow: hidden;

  &:active,
  &:hover {
    background-color: ${(props) => props.theme.colors.background.secondary};
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid ${(props) => props.theme.colors.text.muted};
  }

  &:first-of-type {
    border-top-left-radius: ${(props) => props.theme.grid.radius.default};
    border-top-right-radius: ${(props) => props.theme.grid.radius.default};
  }

  &:last-of-type {
    border-bottom-left-radius: ${(props) => props.theme.grid.radius.default};
    border-bottom-right-radius: ${(props) => props.theme.grid.radius.default};
  }
`;
const AuthorContent = styled_components_1.default.div `
  border-radius: ${(props) => props.theme.grid.radius.small};
  border: 1px solid ${(props) => props.theme.colors.text.muted};
  margin: 0 ${(props) => props.theme.grid.unit * 3}px;
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
const BaseButton = styled_components_1.default.button.attrs({
    type: 'button',
}) `
  font-family: ${(props) => props.theme.font.family.sans};
  background-color: ${(props) => props.theme.colors.background.secondary};
  border: none;
  cursor: pointer;
  font-size: ${(props) => props.theme.font.size.normal};
  font-weight: ${(props) => props.theme.font.weight.medium};
  color: ${(props) => props.theme.colors.brand.default};
`;
const PlainTextButton = styled_components_1.default(style_guide_1.TertiaryButton) ``;
const Author = styled_components_1.default.div ``;
const Actions = styled_components_1.default.div `
  flex-shrink: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.grid.unit * 2}px;
  padding-left: ${(props) => props.theme.grid.unit * 8}px;
  padding-bottom: 64px; // leave space for the chat button
`;
const AuthorActions = styled_components_1.default(Actions) `
  justify-content: flex-end;
`;
const AuthorFormContainer = styled_components_1.default.div `
  border-radius: ${(props) => props.theme.grid.radius.small};
  border: solid 1px ${(props) => props.theme.colors.text.muted};
`;
const TitleLink = styled_components_1.default.a `
  align-items: center;
  border-radius: ${(props) => props.theme.grid.radius.small};
  cursor: pointer;
  display: inline-flex;
  font: ${(props) => props.theme.font.weight.normal}
    ${(props) => props.theme.font.size.medium} /
    ${(props) => props.theme.font.lineHeight.large}
    ${(props) => props.theme.font.family.sans};
  justify-content: center;
  outline: none;
  padding: 7px ${(props) => props.theme.grid.unit * 3}px;
  text-decoration: none;
  transition: border 0.1s, color 0.1s, background-color 0.1s;
  vertical-align: middle;
  white-space: nowrap;

  color: ${(props) => props.theme.colors.button.secondary.color.default};
  background-color: ${(props) => props.theme.colors.button.secondary.background.default};
  border: 1px solid
    ${(props) => props.theme.colors.button.secondary.border.default};

  &:not([disabled]):hover,
  &:not([disabled]):focus {
    color: ${(props) => props.theme.colors.button.secondary.color.hover};
    background-color: ${(props) => props.theme.colors.button.secondary.background.hover};
    border-color: ${(props) => props.theme.colors.button.secondary.border.hover};
  }
  &:not([disabled]):active {
    color: ${(props) => props.theme.colors.button.secondary.color.active};
    background-color: ${(props) => props.theme.colors.button.secondary.background.active};
    border-color: ${(props) => props.theme.colors.button.secondary.border.active};
  }
`;
const FormField = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 3}px;
  padding-left: ${(props) => props.theme.grid.unit * 8}px;
`;
const FlexForm = styled_components_1.default(formik_1.Form) `
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const FormFields = styled_components_1.default.div `
  flex: 1;
  overflow-y: auto;
`;
const buildOptions = (data) => {
    const options = [];
    for (const libraryCollection of data.values()) {
        options.push({
            value: libraryCollection._id,
            label: libraryCollection.name,
        });
    }
    return options;
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
const bibliographyItemTypeOptions = Array.from(library_1.bibliographyItemTypes.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
// TODO: a "manage library collections" page, where unused library collections can be deleted
const LibraryForm = ({ item, handleSave, handleDelete, projectID, projectLibraryCollections, projectLibraryCollectionsCollection, user, }) => {
    const formRef = react_1.useRef(null);
    react_1.useEffect(() => {
        if (formRef.current) {
            formRef.current.scrollTop = 0;
        }
    }, [item]);
    return (react_1.default.createElement(formik_1.Formik, { initialValues: buildInitialValues(item), onSubmit: handleSave, enableReinitialize: true }, ({ values, setFieldValue, handleChange }) => (react_1.default.createElement(FlexForm, null,
        react_1.default.createElement(FormFields, { ref: formRef },
            react_1.default.createElement(FormField, null,
                react_1.default.createElement(LabelContainer, null,
                    react_1.default.createElement(Label, { htmlFor: 'library-item-type' }, "Type")),
                react_1.default.createElement(formik_1.Field, { id: 'library-item-type', name: 'type', component: SelectField_1.SelectField, options: bibliographyItemTypeOptions })),
            react_1.default.createElement(FormField, null,
                react_1.default.createElement(LabelContainer, null,
                    react_1.default.createElement(Label, null, "Title")),
                react_1.default.createElement(StyledTitleField, { value: values.title || '', handleChange: (data) => setFieldValue('title', data), autoFocus: !values.title })),
            react_1.default.createElement(formik_1.FieldArray, { name: 'author', render: ({ push, remove }) => (react_1.default.createElement(FormField, null,
                    react_1.default.createElement(LabelContainer, null,
                        react_1.default.createElement(Label, null, "Authors"),
                        react_1.default.createElement(Button, { onClick: () => push(manuscript_transform_1.buildBibliographicName({
                                given: '',
                                family: '',
                            })) },
                            react_1.default.createElement(AddAuthor_1.default, { height: 17, width: 17 }))),
                    react_1.default.createElement(AuthorFormContainer, null, values.author &&
                        values.author.map((author, index) => (react_1.default.createElement(CollapsibleAuthorContainer, { key: author._id || `author.${index}`, title: [author.given, author.family].join(' ').trim(), action: react_1.default.createElement(BaseButton, { onClick: () => {
                                    if (window.confirm('Remove this author?')) {
                                        remove(index);
                                    }
                                } }, "REMOVE") },
                            react_1.default.createElement(Author, null,
                                react_1.default.createElement(formik_1.Field, { name: `author.${index}.given`, value: author.given, onChange: handleChange }, ({ field }) => (react_1.default.createElement(NameFieldContainer, null,
                                    react_1.default.createElement(NameField, Object.assign({}, field, { id: field.name, placeholder: 'Given', autoFocus: true })),
                                    react_1.default.createElement(FieldLabel, { htmlFor: field.name }, "Given")))),
                                react_1.default.createElement(formik_1.Field, { name: `author.${index}.family`, value: author.family, onChange: handleChange }, ({ field }) => (react_1.default.createElement(NameFieldContainer, null,
                                    react_1.default.createElement(NameField, Object.assign({}, field, { id: field.name, placeholder: 'Family' })),
                                    react_1.default.createElement(FieldLabel, { htmlFor: field.name }, "Family"))))))))))) }),
            react_1.default.createElement(FormField, null,
                react_1.default.createElement(LabelContainer, null,
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
            react_1.default.createElement(FormField, null,
                react_1.default.createElement(LabelContainer, null,
                    react_1.default.createElement(Label, { htmlFor: 'container-title' }, "Container Title")),
                react_1.default.createElement(formik_1.Field, { name: 'container-title' }, (props) => (react_1.default.createElement(FormTextField, Object.assign({ id: 'container-title' }, props.field))))),
            react_1.default.createElement(FormField, null,
                react_1.default.createElement(LabelContainer, null,
                    react_1.default.createElement(Label, { htmlFor: 'volume' }, "Volume")),
                react_1.default.createElement(formik_1.Field, { name: 'volume' }, (props) => (react_1.default.createElement(FormTextField, Object.assign({ id: 'volume' }, props.field))))),
            react_1.default.createElement(FormField, null,
                react_1.default.createElement(LabelContainer, null,
                    react_1.default.createElement(Label, { htmlFor: 'issue' }, "Issue")),
                react_1.default.createElement(formik_1.Field, { name: 'issue' }, (props) => (react_1.default.createElement(FormTextField, Object.assign({ id: 'issue' }, props.field))))),
            react_1.default.createElement(FormField, null,
                react_1.default.createElement(LabelContainer, null,
                    react_1.default.createElement(Label, { htmlFor: 'page' }, "Page")),
                react_1.default.createElement(formik_1.Field, { name: 'page' }, (props) => (react_1.default.createElement(FormTextField, Object.assign({ id: 'page' }, props.field))))),
            react_1.default.createElement(FormField, null,
                react_1.default.createElement(LabelContainer, null,
                    react_1.default.createElement(Label, { htmlFor: 'url' }, "URL")),
                react_1.default.createElement(formik_1.Field, { name: 'URL' }, (props) => (react_1.default.createElement(FormTextField, Object.assign({ type: 'url', id: 'url' }, props.field))))),
            react_1.default.createElement(FormField, null,
                react_1.default.createElement(LabelContainer, null,
                    react_1.default.createElement(Label, { htmlFor: 'doi' }, "DOI")),
                react_1.default.createElement(formik_1.Field, { name: 'DOI' }, (props) => (react_1.default.createElement(FormTextField, Object.assign({ id: 'doi', pattern: '(https://doi.org/)?10..+' }, props.field))))),
            react_1.default.createElement(FormField, null,
                react_1.default.createElement(LabelContainer, null,
                    react_1.default.createElement(Label, { htmlFor: 'keywordIDs' }, "Lists")),
                react_1.default.createElement(formik_1.Field, { name: 'keywordIDs' }, (props) => (react_1.default.createElement(creatable_1.default, { onChange: (newValue) => __awaiter(void 0, void 0, void 0, function* () {
                        setFieldValue(props.field.name, yield Promise.all(newValue.map((option) => __awaiter(void 0, void 0, void 0, function* () {
                            const existing = projectLibraryCollections.get(option.value);
                            if (existing) {
                                return existing._id;
                            }
                            const libraryCollection = manuscript_transform_1.buildLibraryCollection(user.userID, String(option.label));
                            yield projectLibraryCollectionsCollection.create(libraryCollection, {
                                containerID: projectID,
                            });
                            return libraryCollection._id;
                        }))));
                    }), options: buildOptions(projectLibraryCollections), value: props.field.value
                        ? props.field.value
                            .filter((id) => projectLibraryCollections.has(id))
                            .map((id) => projectLibraryCollections.get(id))
                            .map((item) => ({
                            value: item._id,
                            label: item.name,
                        }))
                        : null, styles: select_styles_1.selectStyles }))))),
        react_1.default.createElement(Actions, null,
            handleDelete && (react_1.default.createElement(PlainTextButton, { danger: true, type: 'button', onClick: () => handleDelete(item) }, "Remove")),
            react_1.default.createElement(style_guide_1.ButtonGroup, null,
                react_1.default.createElement(TitleLink, { href: `https://doi.org/${values.DOI}`, target: '_blank', rel: 'noopener noreferrer' },
                    react_1.default.createElement("span", { role: 'img', "aria-label": 'Link' }, "\uD83D\uDD17"),
                    ' ',
                    "Open"),
                react_1.default.createElement(style_guide_1.PrimaryButton, { type: "submit" }, "Save")))))));
};
exports.default = LibraryForm;
//# sourceMappingURL=LibraryForm.js.map