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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportProject = exports.downloadExtension = exports.generateDownloadFilename = exports.buildProjectBundle = exports.createProjectDump = exports.removeEmptyStyles = void 0;
const library_1 = require("@manuscripts/library");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const jszip_1 = __importDefault(require("jszip"));
const config_1 = __importDefault(require("../config"));
const pressroom_1 = require("./pressroom");
const removeEmptyStyles = (model) => {
    Object.entries(model).forEach(([key, value]) => {
        if (value === '' && key.match(/Style$/)) {
            delete model[key];
        }
    });
};
exports.removeEmptyStyles = removeEmptyStyles;
const isEquation = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.Equation);
const isInlineMathFragment = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.InlineMathFragment);
// Convert TeX to MathML for Equation and InlineMathFragment
const augmentEquations = (modelMap) => __awaiter(void 0, void 0, void 0, function* () {
    for (const model of modelMap.values()) {
        if (isEquation(model) &&
            model.TeXRepresentation &&
            !model.MathMLStringRepresentation) {
            // block equation
            const mathml = yield manuscript_transform_1.convertTeXToMathML(model.TeXRepresentation, true);
            if (mathml) {
                model.MathMLStringRepresentation = mathml;
                modelMap.set(model._id, model);
            }
        }
        if (isInlineMathFragment(model) &&
            model.TeXRepresentation &&
            !model.MathMLRepresentation) {
            // inline equation
            const mathml = yield manuscript_transform_1.convertTeXToMathML(model.TeXRepresentation, false);
            if (mathml) {
                model.MathMLRepresentation = mathml;
                modelMap.set(model._id, model);
            }
        }
    }
});
const createProjectDump = (modelMap, manuscriptID) => ({
    version: '2.0',
    data: Array.from(modelMap.values())
        .filter((model) => {
        if (!manuscriptID) {
            return true;
        }
        return (model.objectType !== manuscripts_json_schema_1.ObjectTypes.Manuscript ||
            model._id === manuscriptID);
    })
        .map((data) => {
        const _a = data, { _attachments, attachment, src } = _a, model = __rest(_a, ["_attachments", "attachment", "src"]);
        exports.removeEmptyStyles(model);
        return model;
    }),
});
exports.createProjectDump = createProjectDump;
const modelHasObjectType = (model, objectType) => {
    return model.objectType === objectType;
};
const fetchAttachment = (getAttachment, model) => __awaiter(void 0, void 0, void 0, function* () {
    if (manuscript_transform_1.isUserProfile(model) && model.avatar) {
        return getAttachment(model._id, 'image');
    }
    if (manuscript_transform_1.isFigure(model)) {
        return getAttachment(model._id, 'image');
    }
    if (modelHasObjectType(model, manuscripts_json_schema_1.ObjectTypes.Bundle)) {
        return getAttachment(model._id, 'csl');
    }
    return undefined;
});
const buildAttachments = (getAttachment, modelMap) => __awaiter(void 0, void 0, void 0, function* () {
    const attachments = new Map();
    for (const [id, model] of modelMap.entries()) {
        try {
            const attachment = yield fetchAttachment(getAttachment, model);
            if (attachment) {
                attachments.set(id, attachment);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    return attachments;
});
const buildProjectBundle = (getAttachment, modelMap, manuscriptID, format) => __awaiter(void 0, void 0, void 0, function* () {
    const attachments = yield buildAttachments(getAttachment, modelMap);
    if (format === 'docx') {
        yield augmentEquations(modelMap);
    }
    const data = exports.createProjectDump(modelMap, manuscriptID);
    const zip = new jszip_1.default();
    zip.file('index.manuscript-json', JSON.stringify(data, null, 2));
    for (const model of modelMap.values()) {
        const attachment = attachments.get(model._id);
        if (attachment) {
            switch (format) {
                case 'html':
                case 'jats':
                case 'sts': {
                    // add file extension for JATS/HTML export
                    const filename = manuscript_transform_1.generateAttachmentFilename(model._id, attachment.type);
                    // TODO: change folder name?
                    zip.file('Data/' + filename, attachment);
                    break;
                }
                default: {
                    const filename = manuscript_transform_1.generateAttachmentFilename(model._id);
                    zip.file('Data/' + filename, attachment);
                    break;
                }
            }
        }
    }
    return zip;
});
exports.buildProjectBundle = buildProjectBundle;
const generateDownloadFilename = (title) => title
    .replace(/<[^>]*>/g, '') // remove markup
    .replace(/\W/g, '_') // remove non-word characters
    .replace(/_+(.)/g, (match, letter) => letter.toUpperCase()) // convert snake case to camel case
    .replace(/_+$/, '') // remove any trailing underscores
    .substr(0, 200);
exports.generateDownloadFilename = generateDownloadFilename;
const downloadExtension = (format) => {
    switch (format) {
        case 'docx':
        case 'epub':
        case 'pdf':
        case 'manuproj':
        case 'bibtex':
        case 'ris':
            return `.${format}`;
        case 'pdf-prince':
            return '.pdf';
        // case 'mods':
        //   return '.xml'
        default:
            return '.zip';
    }
};
exports.downloadExtension = downloadExtension;
const convertToHTML = (zip, modelMap, manuscriptID) => __awaiter(void 0, void 0, void 0, function* () {
    zip.remove('index.manuscript-json');
    const decoder = new manuscript_transform_1.Decoder(modelMap);
    const doc = decoder.createArticleNode(manuscriptID);
    const transformer = new manuscript_transform_1.HTMLTransformer();
    const html = yield transformer.serializeToHTML(doc.content, modelMap);
    zip.file('index.html', html);
    return zip.generateAsync({ type: 'blob' });
});
const convertToJATS = (zip, modelMap, manuscriptID) => __awaiter(void 0, void 0, void 0, function* () {
    zip.remove('index.manuscript-json');
    const decoder = new manuscript_transform_1.Decoder(modelMap);
    const doc = decoder.createArticleNode(manuscriptID);
    const transformer = new manuscript_transform_1.JATSExporter();
    const xml = yield transformer.serializeToJATS(doc.content, modelMap, manuscriptID);
    zip.file('manuscript.xml', xml);
    return zip.generateAsync({ type: 'blob' });
});
const convertToSTS = (zip, modelMap, manuscriptID) => __awaiter(void 0, void 0, void 0, function* () {
    zip.remove('index.manuscript-json');
    const decoder = new manuscript_transform_1.Decoder(modelMap, true);
    const doc = decoder.createArticleNode(manuscriptID);
    const transformer = new manuscript_transform_1.STSExporter();
    const xml = transformer.serializeToSTS(doc.content, modelMap);
    zip.file('manuscript.xml', xml);
    return zip.generateAsync({ type: 'blob' });
});
const addContainersFile = (zip, project) => __awaiter(void 0, void 0, void 0, function* () {
    const container = manuscript_transform_1.getModelData(project);
    zip.file('containers.json', JSON.stringify([container]));
});
const prepareBibliography = (modelMap) => {
    const citations = manuscript_transform_1.getModelsByType(modelMap, manuscripts_json_schema_1.ObjectTypes.Citation);
    const items = [];
    for (const citation of citations) {
        for (const citationItem of citation.embeddedCitationItems) {
            if (citationItem.bibliographyItem) {
                const item = modelMap.get(citationItem.bibliographyItem);
                if (item) {
                    items.push(item);
                }
            }
        }
    }
    return items.map(library_1.convertBibliographyItemToCSL).map(library_1.fixCSLData);
};
const exportProject = (getAttachment, modelMap, manuscriptID, format, project, submission) => __awaiter(void 0, void 0, void 0, function* () {
    // if (project) {
    //   modelMap.set(project._id, project)
    // }
    const zip = yield exports.buildProjectBundle(getAttachment, modelMap, manuscriptID, format);
    switch (format) {
        // export bibliography
        // case 'mods':
        case 'bibtex':
        case 'ris': {
            const data = prepareBibliography(modelMap);
            const form = new FormData();
            const json = JSON.stringify(data, null, 2);
            form.append('file', new Blob([json]));
            form.append('format', format);
            return pressroom_1.exportData(form, 'bibliography');
        }
        // export Manuscripts archive
        case 'manuproj':
            if (project) {
                yield addContainersFile(zip, project);
            }
            // TODO: remove invitations and annotations?
            return zip.generateAsync({ type: 'blob' });
        // export from ProseMirror
        case 'jats':
            if (!manuscriptID) {
                throw new Error('No manuscript selected');
            }
            return convertToJATS(zip, modelMap, manuscriptID);
        case 'sts':
            if (!manuscriptID) {
                throw new Error('No manuscript selected');
            }
            return convertToSTS(zip, modelMap, manuscriptID);
        case 'html':
            if (!manuscriptID) {
                throw new Error('No manuscript selected');
            }
            return convertToHTML(zip, modelMap, manuscriptID);
        // deposit magazine HTML in Literatum
        case 'literatum-do': {
            if (!manuscriptID) {
                throw new Error('No manuscript selected');
            }
            const { DOI } = modelMap.get(manuscriptID);
            if (!DOI) {
                window.alert('A DOI is required for Literatum export');
                throw new Error('A DOI is required for Literatum export');
            }
            const file = yield zip.generateAsync({ type: 'blob' });
            const form = new FormData();
            form.append('file', file, 'export.manuproj');
            form.append('manuscriptID', manuscriptID);
            form.append('doType', 'magazine');
            form.append('doi', DOI);
            form.append('deposit', 'true');
            return pressroom_1.exportData(form, 'literatum-do');
        }
        // deposit article WileyML in Literatum
        case 'literatum-bundle': {
            if (!manuscriptID) {
                throw new Error('No manuscript selected');
            }
            if (!config_1.default.submission.group_doi || !config_1.default.submission.series_code) {
                window.alert('Submission is not correctly configured in this environment');
                throw new Error('Submission environment variables must be defined');
            }
            const { DOI } = modelMap.get(manuscriptID);
            if (!DOI) {
                window.alert('A DOI is required for Literatum submission');
                throw new Error('A DOI is required for Literatum submission');
            }
            const file = yield zip.generateAsync({ type: 'blob' });
            const form = new FormData();
            form.append('file', file, 'export.manuproj');
            form.append('manuscriptID', manuscriptID);
            form.append('xmlType', 'wileyml');
            form.append('doi', DOI);
            form.append('groupDOI', config_1.default.submission.group_doi);
            form.append('seriesCode', config_1.default.submission.series_code);
            form.append('deposit', 'true');
            return pressroom_1.exportData(form, 'literatum-bundle');
        }
        // submit JATS XML to a journal for review via Literatum EEO
        case 'literatum-eeo': {
            if (!manuscriptID) {
                throw new Error('No manuscript selected');
            }
            const { DOI } = modelMap.get(manuscriptID);
            if (!DOI) {
                throw new Error('No DOI was provided');
            }
            if (!submission) {
                throw new Error('No submission was provided');
            }
            if (!submission.journalTitle) {
                throw new Error('No journal title was provided');
            }
            const notificationURL = `${config_1.default.api.url}/submissions/status/${submission._id}`;
            const file = yield zip.generateAsync({ type: 'blob' });
            const form = new FormData();
            form.append('file', file, 'export.manuproj');
            form.append('manuscriptID', manuscriptID);
            form.append('doi', DOI);
            form.append('notificationURL', notificationURL);
            form.append('journalName', submission.journalTitle);
            form.append('deposit', 'true');
            return pressroom_1.exportData(form, 'literatum-eeo');
        }
        // export to PDF via Pressroom, using Prince
        case 'pdf-prince': {
            if (!manuscriptID) {
                throw new Error('No manuscript selected');
            }
            const file = yield zip.generateAsync({ type: 'blob' });
            const form = new FormData();
            form.append('file', file, 'export.manuproj');
            form.append('engine', 'prince-html');
            const { prototype } = modelMap.get(manuscriptID);
            // TODO: add theme property to template & manuscript?
            if (prototype) {
                if (prototype.includes('-nature-')) {
                    form.append('theme', 'nature');
                }
                else if (prototype.includes('-plos-one-')) {
                    form.append('theme', 'plos-one');
                }
            }
            form.append('manuscriptID', manuscriptID);
            return pressroom_1.exportData(form, 'pdf');
        }
        // export via Pressroom
        default: {
            if (!manuscriptID) {
                throw new Error('No manuscript selected');
            }
            const file = yield zip.generateAsync({ type: 'blob' });
            const form = new FormData();
            form.append('file', file, 'export.manuproj');
            form.append('manuscriptID', manuscriptID);
            return pressroom_1.exportData(form, format);
        }
    }
});
exports.exportProject = exportProject;
//# sourceMappingURL=exporter.js.map