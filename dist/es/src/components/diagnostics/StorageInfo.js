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
exports.StorageInfo = void 0;
const pretty_bytes_1 = __importDefault(require("pretty-bytes"));
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const StorageInfo = () => {
    const [estimate, setEstimate] = react_1.useState();
    const [error, setError] = react_1.useState();
    react_1.useEffect(() => {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            navigator.storage
                .estimate()
                .then((estimate) => {
                setEstimate(estimate);
            })
                .catch((error) => {
                setError(error);
            });
        }
    });
    if (error) {
        return (react_1.default.createElement(Container, null,
            error.name,
            ": ",
            error.message));
    }
    if (estimate === undefined ||
        estimate.quota === undefined ||
        estimate.usage === undefined) {
        return null;
    }
    return (react_1.default.createElement(Container, null,
        pretty_bytes_1.default(estimate.quota - estimate.usage),
        " of local storage is available"));
};
exports.StorageInfo = StorageInfo;
const Container = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 5}px;
`;
//# sourceMappingURL=StorageInfo.js.map