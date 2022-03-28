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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColor = exports.buildColors = exports.nextColorPriority = exports.isColorScheme = exports.isColor = exports.DEFAULT_COLOR_SCHEME = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
exports.DEFAULT_COLOR_SCHEME = 'MPColorScheme:default';
exports.isColor = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.Color);
exports.isColorScheme = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.ColorScheme);
const nextColorPriority = (colors) => Math.max(...colors.map((color) => color.priority || 0)) + 10;
exports.nextColorPriority = nextColorPriority;
const buildColors = (modelMap, colorSchemeID = exports.DEFAULT_COLOR_SCHEME) => {
    // const colorScheme = modelMap.get(colorSchemeID) as ColorScheme | undefined
    let colorScheme = manuscript_transform_1.getByPrototype(modelMap, colorSchemeID);
    if (colorSchemeID !== exports.DEFAULT_COLOR_SCHEME && !colorScheme) {
        colorScheme = manuscript_transform_1.getByPrototype(modelMap, exports.DEFAULT_COLOR_SCHEME);
    }
    const colors = [];
    if (colorScheme && colorScheme.colors) {
        for (const colorID of colorScheme.colors) {
            if (colorID) {
                // const color = modelMap.get(colorID) as Color | undefined
                const color = manuscript_transform_1.getByPrototype(modelMap, colorID);
                if (color && color.value) {
                    colors.push(color);
                }
            }
        }
        colors.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    }
    return { colors, colorScheme };
};
exports.buildColors = buildColors;
const addColor = (colors, saveModel, colorScheme) => (hex) => __awaiter(void 0, void 0, void 0, function* () {
    const color = manuscript_transform_1.buildColor(hex, exports.nextColorPriority(colors));
    yield saveModel(Object.assign(Object.assign({}, color), { prototype: color._id }));
    if (!colorScheme) {
        return color;
    }
    yield saveModel(Object.assign(Object.assign({}, colorScheme), { colors: [...(colorScheme.colors || []), color._id] }));
    return color;
});
exports.addColor = addColor;
//# sourceMappingURL=colors.js.map