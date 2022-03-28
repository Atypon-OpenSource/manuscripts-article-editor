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
exports.NodeInspector = void 0;
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const react_1 = __importDefault(require("react"));
const store_1 = require("../../store");
const FigureInspector_1 = require("./FigureInspector");
const NodeInspector = ({ selected, state, dispatch }) => {
    const [modelMap] = store_1.useStore((store) => store.modelMap);
    const [saveModel] = store_1.useStore((store) => store.saveModel);
    switch (selected.node.type) {
        case manuscript_transform_1.schema.nodes.figure_element: {
            const figures = [];
            for (const child of manuscript_editor_1.iterateChildren(selected.node)) {
                if (child.type === manuscript_transform_1.schema.nodes.figure) {
                    figures.push(child);
                }
            }
            if (figures.length === 1) {
                const [node] = figures;
                const figure = modelMap.get(node.attrs.id);
                if (figure) {
                    return (react_1.default.createElement(FigureInspector_1.FigureInspector, { figure: figure, node: node, saveFigure: saveModel, state: state, dispatch: dispatch }));
                }
            }
            return null;
        }
        case manuscript_transform_1.schema.nodes.figure: {
            const figure = modelMap.get(selected.node.attrs.id);
            if (figure) {
                return (react_1.default.createElement(FigureInspector_1.FigureInspector, { figure: figure, node: selected.node, saveFigure: saveModel, state: state, dispatch: dispatch }));
            }
            return null;
        }
        default:
            return null;
    }
};
exports.NodeInspector = NodeInspector;
//# sourceMappingURL=NodeInspector.js.map