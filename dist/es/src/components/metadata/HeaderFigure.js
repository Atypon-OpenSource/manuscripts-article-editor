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
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
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
exports.HeaderFigure = void 0;
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const react_1 = __importStar(require("react"));
const react_dropzone_1 = __importDefault(require("react-dropzone"));
const styled_components_1 = __importDefault(require("styled-components"));
const store_1 = require("../../store");
const HeaderFigure = () => {
    const [loaded, setLoaded] = react_1.useState();
    const [src, setSrc] = react_1.useState();
    const [{ getAttachment, putAttachment, saveModel, manuscript }] = store_1.useStore((store) => {
        return {
            manuscript: store.manuscript,
            saveModel: store.saveModel,
            getAttachment: store.getAttachment,
            putAttachment: store.putAttachment,
        };
    });
    react_1.useEffect(() => {
        setLoaded(false);
        setSrc(undefined);
        if (manuscript.headerFigure && getAttachment) {
            getAttachment(manuscript.headerFigure, 'image')
                .then((blob) => {
                if (blob) {
                    const url = window.URL.createObjectURL(blob);
                    setSrc(url);
                }
            })
                .finally(() => {
                setLoaded(true);
            })
                .catch((error) => {
                console.error(error);
            });
        }
        else {
            setLoaded(true);
        }
    }, [getAttachment, manuscript.headerFigure]);
    const handleDrop = react_1.useCallback((acceptedFiles) => {
        const figureID = manuscript.headerFigure;
        if (figureID && putAttachment) {
            const [file] = acceptedFiles;
            if (!file) {
                return;
            }
            putAttachment(figureID, {
                id: 'image',
                data: file,
                type: file.type,
            })
                .then(() => __awaiter(void 0, void 0, void 0, function* () {
                // set the contentType on the Figure object
                yield saveModel({
                    _id: figureID,
                    objectType: manuscripts_json_schema_1.ObjectTypes.Figure,
                    contentType: file.type,
                });
                const url = window.URL.createObjectURL(file);
                setSrc(url);
            }))
                .catch((error) => {
                console.error(error);
            });
        }
    }, [manuscript.headerFigure, putAttachment, saveModel]);
    if (!manuscript.headerFigure || !loaded) {
        return null;
    }
    if (!src) {
        return (react_1.default.createElement(react_dropzone_1.default, { onDrop: handleDrop, accept: '.jpg,.jpeg,.png,.gif,.webp', multiple: false }, ({ isDragActive, isDragAccept, getInputProps, getRootProps }) => (react_1.default.createElement(StyledDropArea, Object.assign({}, getRootProps()),
            react_1.default.createElement("input", Object.assign({}, getInputProps())),
            react_1.default.createElement("div", null,
                "Drag an image here or click to browse\u2026",
                isDragActive && react_1.default.createElement("div", null, "Drop here"),
                isDragAccept && react_1.default.createElement("div", null, "Accept here"))))));
    }
    return (react_1.default.createElement(FigureContainer, null, src && react_1.default.createElement("img", { alt: 'Header figure', src: src })));
};
exports.HeaderFigure = HeaderFigure;
const FigureContainer = styled_components_1.default.figure `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 0 24px 0;

  img {
    width: 100%;
    object-fit: contain;
  }
`;
const StyledDropArea = styled_components_1.default.div `
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 2px dashed #ddd;
  margin-bottom: 16px;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;
//# sourceMappingURL=HeaderFigure.js.map