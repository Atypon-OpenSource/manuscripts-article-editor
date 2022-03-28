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
exports.FigureInspector = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const react_1 = __importStar(require("react"));
const node_attrs_1 = require("../../lib/node-attrs");
const InspectorSection_1 = require("../InspectorSection");
const LicenseInput_1 = require("../projects/LicenseInput");
const URLInput_1 = require("../projects/URLInput");
const ManuscriptStyleInspector_1 = require("./ManuscriptStyleInspector");
const isImageUrl = (url) => url.endsWith('.jpg') || url.endsWith('.png');
const FigureInspector = ({ figure, node, saveFigure, state, dispatch }) => {
    const attribution = figure.attribution || manuscript_transform_1.buildAttribution();
    const handleLicenseChange = react_1.useCallback((licenseID) => {
        const data = Object.assign(Object.assign({}, attribution), { licenseID });
        saveFigure(Object.assign(Object.assign({}, figure), { attribution: data }));
    }, [saveFigure, figure, attribution]);
    return (react_1.default.createElement(InspectorSection_1.InspectorSection, { title: 'Figure' },
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
            react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Embed URL"),
            react_1.default.createElement(URLInput_1.URLInput, { value: node.attrs.embedURL, handleChange: (embedURL) => {
                    if (embedURL && isImageUrl(embedURL)) {
                        // TODO: save the image attachment
                        node_attrs_1.setNodeAttrs(state, dispatch, figure._id, {
                            src: embedURL,
                            embedURL: undefined,
                        });
                    }
                    else {
                        node_attrs_1.setNodeAttrs(state, dispatch, figure._id, { embedURL });
                    }
                } })),
        react_1.default.createElement(InspectorSection_1.Subheading, null, "Attribution"),
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
            react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "License"),
            react_1.default.createElement(LicenseInput_1.LicenseInput, { value: attribution.licenseID, handleChange: handleLicenseChange }))));
};
exports.FigureInspector = FigureInspector;
//# sourceMappingURL=FigureInspector.js.map