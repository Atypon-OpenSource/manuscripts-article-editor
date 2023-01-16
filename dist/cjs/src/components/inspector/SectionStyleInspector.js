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
exports.SectionStyleInspector = void 0;
const lodash_es_1 = require("lodash-es");
const react_1 = __importStar(require("react"));
const colors_1 = require("../../lib/colors");
const styles_1 = require("../../lib/styles");
const SectionStyles_1 = require("./SectionStyles");
const SectionStyleInspector = ({ section, dispatchUpdate, modelMap, saveModel }) => {
    const [error, setError] = react_1.useState();
    const [paragraphStyle, setParagraphStyle] = react_1.useState();
    const depth = section.path.length;
    const sectionParagraphStyle = styles_1.chooseParagraphStyle(modelMap, `heading${depth}`);
    react_1.useEffect(() => {
        setParagraphStyle(sectionParagraphStyle);
    }, [
        setParagraphStyle,
        sectionParagraphStyle,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(sectionParagraphStyle),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSaveParagraphStyle = react_1.useCallback(lodash_es_1.debounce((paragraphStyle) => saveModel(paragraphStyle).catch((error) => {
        setError(error);
    }), 500), [saveModel]);
    if (!paragraphStyle) {
        return null;
    }
    const saveDebouncedParagraphStyle = (paragraphStyle) => {
        setParagraphStyle(paragraphStyle);
        return debouncedSaveParagraphStyle(paragraphStyle);
    };
    const saveParagraphStyle = (paragraphStyle) => {
        setParagraphStyle(paragraphStyle);
        return saveModel(paragraphStyle)
            .then(() => {
            // TODO: set meta
            dispatchUpdate(); // TODO: do this when receiving an updated paragraph style instead?
        })
            .catch((error) => {
            // TODO: restore previous paragraphStyle?
            setError(error);
        });
    };
    const titlePrefix = depth === 1 ? 'Section' : `Sub${'sub'.repeat(depth - 2)}section`;
    const { colors, colorScheme } = colors_1.buildColors(modelMap);
    return (react_1.default.createElement(SectionStyles_1.SectionStyles, { title: `${titlePrefix} Heading Styles`, colors: colors, colorScheme: colorScheme, error: error, paragraphStyle: paragraphStyle, saveModel: saveModel, saveParagraphStyle: saveParagraphStyle, saveDebouncedParagraphStyle: saveDebouncedParagraphStyle, setError: setError }));
};
exports.SectionStyleInspector = SectionStyleInspector;
//# sourceMappingURL=SectionStyleInspector.js.map