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
exports.BibliographyImportButton = void 0;
const AttentionRed_1 = __importDefault(require("@manuscripts/assets/react/AttentionRed"));
const Check_1 = __importDefault(require("@manuscripts/assets/react/Check"));
const library_1 = require("@manuscripts/library");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const style_guide_1 = require("@manuscripts/style-guide");
const path_parse_1 = __importDefault(require("path-parse"));
const react_1 = __importStar(require("react"));
const importers_1 = require("../../pressroom/importers");
const ContactSupportButton_1 = require("../ContactSupportButton");
const NotificationProvider_1 = require("../NotificationProvider");
const Notifications_1 = require("../Notifications");
const Messages_1 = require("./Messages");
const CITATION_IMPORT_NOTIFICATION_ID = 'citation-import';
const createCitationImportErrorNotification = (title) => ({ removeNotification }) => (react_1.default.createElement(Notifications_1.NotificationPrompt, null,
    react_1.default.createElement(Notifications_1.NotificationHead, null,
        react_1.default.createElement(AttentionRed_1.default, null),
        react_1.default.createElement(Notifications_1.NotificationMessage, null,
            react_1.default.createElement(Notifications_1.NotificationTitle, null, title))),
    react_1.default.createElement(Notifications_1.NotificationActions, null,
        react_1.default.createElement(style_guide_1.SecondaryButton, { onClick: removeNotification }, "Dismiss"))));
const createCitationImportSuccessNotification = (count) => ({ removeNotification }) => (react_1.default.createElement(Notifications_1.NotificationPrompt, null,
    react_1.default.createElement(Notifications_1.NotificationHead, null,
        react_1.default.createElement(Check_1.default, { color: 'green' }),
        react_1.default.createElement(Notifications_1.NotificationMessage, null,
            react_1.default.createElement(Notifications_1.NotificationTitle, null,
                react_1.default.createElement(Messages_1.CitationImportSuccessMessage, { count: count })))),
    react_1.default.createElement(Notifications_1.NotificationActions, null,
        react_1.default.createElement(style_guide_1.SecondaryButton, { onClick: removeNotification }, "Dismiss"))));
exports.BibliographyImportButton = react_1.default.memo(({ importItems, component: Component }) => {
    const { showNotification } = react_1.useContext(NotificationProvider_1.NotificationContext);
    const [importing, setImporting] = react_1.useState(false);
    const handleImport = react_1.useCallback(() => {
        setImporting(true);
        importers_1.openFilePicker(['.bib', '.bibtex', '.ris'])
            .then(([file]) => __awaiter(void 0, void 0, void 0, function* () {
            if (!file) {
                return;
            }
            const text = yield window
                .fetch(URL.createObjectURL(file))
                .then((response) => response.text());
            if (!text) {
                showNotification(CITATION_IMPORT_NOTIFICATION_ID, createCitationImportErrorNotification('No bibliography items were found in this file'));
                return;
            }
            const { ext } = path_parse_1.default(file.name);
            const items = yield library_1.parseBibliography(text, ext);
            if (!items || !items.length) {
                showNotification(CITATION_IMPORT_NOTIFICATION_ID, createCitationImportErrorNotification('No bibliography items were found in this file'));
                return;
            }
            const bibliographyItems = items.map(manuscript_transform_1.buildBibliographyItem);
            const newItems = yield importItems(bibliographyItems);
            showNotification(CITATION_IMPORT_NOTIFICATION_ID, createCitationImportSuccessNotification(newItems.length));
        }))
            .finally(() => {
            setImporting(false);
        })
            .catch(() => {
            showNotification(CITATION_IMPORT_NOTIFICATION_ID, createCitationImportErrorNotification(react_1.default.createElement(react_1.default.Fragment, null,
                "There was an error importing the file. Please",
                ' ',
                react_1.default.createElement(ContactSupportButton_1.ContactSupportButton, null, "contact support"),
                " if this persists.")));
        });
    }, [importItems, showNotification]);
    return react_1.default.createElement(Component, { importItems: handleImport, importing: importing });
});
//# sourceMappingURL=BibliographyImportButton.js.map