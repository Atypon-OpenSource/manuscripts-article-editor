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
exports.importFile = exports.putIntoZip = exports.openFilePicker = exports.acceptedMimeTypes = exports.acceptedFileDescription = exports.acceptedFileExtensions = exports.importProjectArchive = exports.readProjectDumpFromArchive = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const jszip_1 = __importDefault(require("jszip"));
const lodash_es_1 = require("lodash-es");
const path_parse_1 = __importDefault(require("path-parse"));
const config_1 = __importDefault(require("../config"));
const errors_1 = require("../lib/errors");
const id_1 = require("../lib/id");
const update_identifiers_1 = require("../lib/update-identifiers");
const ImporterUtils_1 = require("./ImporterUtils");
const pressroom_1 = require("./pressroom");
const readProjectDumpFromArchive = (zip) => __awaiter(void 0, void 0, void 0, function* () {
    const json = yield zip.files['index.manuscript-json'].async('text');
    return JSON.parse(json);
});
exports.readProjectDumpFromArchive = readProjectDumpFromArchive;
const attachmentKeys = {
    [manuscripts_json_schema_1.ObjectTypes.Figure]: 'image',
    [manuscripts_json_schema_1.ObjectTypes.Bundle]: 'csl',
};
const defaultAttachmentContentTypes = {
    [manuscripts_json_schema_1.ObjectTypes.Figure]: 'image/png',
    [manuscripts_json_schema_1.ObjectTypes.Bundle]: 'application/vnd.citationstyles.style+xml',
};
// load attachments from the Data folder
const loadManuscriptsAttachments = (zip, models) => __awaiter(void 0, void 0, void 0, function* () {
    for (const file of Object.values(zip.files)) {
        if (!file.dir && file.name.startsWith('Data/')) {
            const { base } = path_parse_1.default(file.name);
            const id = base.replace('_', ':');
            const model = models.find((model) => model._id === id);
            if (model) {
                const objectType = model.objectType;
                if (objectType in attachmentKeys) {
                    model.attachment = {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        id: attachmentKeys[objectType],
                        type: 
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        model.contentType || defaultAttachmentContentTypes[objectType],
                        data: yield file.async('blob'),
                    };
                }
            }
        }
    }
});
const importProjectArchive = (blob, regenerateIDs = false) => __awaiter(void 0, void 0, void 0, function* () {
    const zip = yield new jszip_1.default().loadAsync(blob);
    const { data, version } = yield exports.readProjectDumpFromArchive(zip);
    if (version !== '2.0') {
        throw new Error(`Unsupported version: ${version}`);
    }
    if (regenerateIDs) {
        const idMap = yield update_identifiers_1.updateIdentifiers(data);
        yield update_identifiers_1.updateAttachments(zip, idMap);
    }
    // TODO: validate?
    // TODO: ensure default data is added
    // TODO: add default bundle (which has no parent bundle)
    // TODO: ensure that pageLayout and bundle are set
    const models = data
        .filter((item) => item.objectType !== 'MPContentSummary')
        .filter((item) => item._id && id_1.idRe.test(item._id))
        .map((item) => ImporterUtils_1.cleanItem(item));
    yield loadManuscriptsAttachments(zip, models);
    return models;
});
exports.importProjectArchive = importProjectArchive;
const parseXMLFile = (blob) => __awaiter(void 0, void 0, void 0, function* () {
    const url = window.URL.createObjectURL(blob);
    const xml = yield fetch(url).then((response) => response.text());
    return parseXML(xml);
});
const parseXML = (xml) => {
    return new DOMParser().parseFromString(xml, 'application/xml');
};
const convertXMLDocument = (doc) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: check doc.doctype.publicId?
    switch (doc.documentElement.nodeName) {
        case 'article':
            return manuscript_transform_1.parseJATSArticle(doc);
        case 'standard':
            return manuscript_transform_1.parseSTSStandard(doc);
        default:
            throw new Error('Unsupported XML format');
    }
});
const fileTypes = [
    {
        extension: '.docx',
        mimetypes: [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        description: 'DOCX (Microsoft Word)',
    },
    {
        extension: '.doc',
        mimetypes: ['application/msword'],
        description: 'DOC (Microsoft Word)',
    },
    {
        extension: '.html',
        mimetypes: ['text/html'],
        description: 'HTML',
    },
    {
        extension: '.md',
        mimetypes: ['text/markdown', 'text/plain'],
        description: 'Markdown',
    },
    {
        extension: '.manuproj',
        mimetypes: ['application/zip'],
        description: 'Manuscripts Project Bundle',
    },
    {
        extension: '.latex',
        mimetypes: [
            'application/x-latex',
            'application/latex',
            'text/x-latex',
            'text/latex',
            'text/plain',
        ],
        description: 'LaTeX',
    },
    {
        extension: '.tex',
        mimetypes: [
            'application/x-tex',
            'application/tex',
            'text/x-tex',
            'text/tex',
            'text/plain',
        ],
        description: 'TeX',
    },
    {
        extension: '.xml',
        mimetypes: ['application/xml', 'text/xml'],
        description: 'JATS/STS XML',
    },
    {
        extension: '.zip',
        mimetypes: ['application/zip'],
        description: 'ZIP (containing Markdown or LaTeX)', // TODO: could also be XML or HTML
    },
];
const acceptedFileExtensions = () => {
    return fileTypes.map((item) => item.extension);
};
exports.acceptedFileExtensions = acceptedFileExtensions;
const acceptedFileDescription = () => {
    return fileTypes.map((item) => item.description);
};
exports.acceptedFileDescription = acceptedFileDescription;
const acceptedMimeTypes = () => {
    return lodash_es_1.flatMap(fileTypes, (item) => item.mimetypes);
};
exports.acceptedMimeTypes = acceptedMimeTypes;
const openFilePicker = (acceptedExtensions = exports.acceptedFileExtensions(), multiple = false) => new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptedExtensions.join(',');
    input.multiple = multiple;
    const handleFocus = () => {
        window.removeEventListener('focus', handleFocus);
        // This event is fired before the input's change event,
        // and before the input's FileList has been populated,
        // so a delay is needed.
        window.setTimeout(() => {
            if (!input.files || !input.files.length) {
                resolve([]);
            }
        }, 1000);
    };
    // window "focus" event, fired even if the file picker is cancelled.
    window.addEventListener('focus', handleFocus);
    input.addEventListener('change', () => {
        if (input.files && input.files.length) {
            for (const file of input.files) {
                const { ext } = path_parse_1.default(file.name);
                const extension = ext.toLowerCase();
                if (!acceptedExtensions.includes(extension)) {
                    const error = new errors_1.FileExtensionError(extension, acceptedExtensions);
                    reject(error);
                    return;
                }
            }
            resolve(Array.from(input.files));
        }
        else {
            resolve([]);
        }
    });
    input.click();
});
exports.openFilePicker = openFilePicker;
const putIntoZip = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const zip = new jszip_1.default();
    const text = yield file.text();
    zip.file(file.name, text);
    return zip.generateAsync({ type: 'blob' });
});
exports.putIntoZip = putIntoZip;
const importFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const extension = file.name.split('.').pop();
    if (!extension) {
        throw new Error('No file extension found');
    }
    // TODO: reject unsupported file extensions
    const form = new FormData();
    if (['md', 'jats', 'latex', 'tex', 'html'].includes(extension)) {
        const fileToUpload = yield exports.putIntoZip(file);
        form.append('file', fileToUpload);
        const result = yield pressroom_1.importData(form, 'zip', {});
        return exports.importProjectArchive(result);
    }
    if (extension === 'xml') {
        return parseXMLFile(file).then(convertXMLDocument);
    }
    if (extension === 'manuproj') {
        return exports.importProjectArchive(file, true);
    }
    form.append('file', file);
    const headers = {};
    let sourceFormat = extension;
    if (extension === 'docx' || extension === 'doc') {
        form.append('enrichMetadata', 'true'); // TODO: use this for all formats
        if (config_1.default.extyles.arc.secret) {
            sourceFormat = 'word-arc';
            headers['pressroom-extylesarc-secret'] = config_1.default.extyles.arc.secret;
        }
        else {
            sourceFormat = 'word';
        }
    }
    // TODO: look inside .zip files
    const result = yield pressroom_1.importData(form, sourceFormat, headers);
    return exports.importProjectArchive(result);
});
exports.importFile = importFile;
//# sourceMappingURL=importers.js.map