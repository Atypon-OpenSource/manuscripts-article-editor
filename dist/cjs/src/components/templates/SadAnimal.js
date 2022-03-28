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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SadAnimal1_png_1 = __importDefault(require("@manuscripts/assets/png/SadAnimal1.png"));
const SadAnimal2_png_1 = __importDefault(require("@manuscripts/assets/png/SadAnimal2.png"));
const SadAnimal3_png_1 = __importDefault(require("@manuscripts/assets/png/SadAnimal3.png"));
const SadAnimal4_png_1 = __importDefault(require("@manuscripts/assets/png/SadAnimal4.png"));
const SadAnimal5_png_1 = __importDefault(require("@manuscripts/assets/png/SadAnimal5.png"));
const lodash_es_1 = require("lodash-es");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const images = {
    '😿': SadAnimal1_png_1.default,
    '🐼': SadAnimal2_png_1.default,
    '🐹': SadAnimal3_png_1.default,
    '🙀': SadAnimal4_png_1.default,
    '🐶': SadAnimal5_png_1.default,
};
const key = lodash_es_1.sample(Object.keys(images));
const Container = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SadAnimal = () => (react_1.default.createElement(Container, null,
    react_1.default.createElement("img", { src: images[key], alt: key, height: 154 })));
exports.default = SadAnimal;
//# sourceMappingURL=SadAnimal.js.map