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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const react_1 = __importDefault(require("react"));
const StatusIcons_1 = __importStar(require("./StatusIcons"));
const StatusInputStyling_1 = require("./StatusInputStyling");
const StatusInputTipDropdown = ({ isOverdue, isDueSoon, selectedLabelPriority, sortedLabels, target, }) => {
    const getLocalDay = (ms) => date_fns_1.format(new Date(ms * 1000), 'iiii d LLLL');
    return (react_1.default.createElement(react_1.default.Fragment, null, sortedLabels.map((label) => typeof label.priority !== 'undefined' &&
        label.priority <= selectedLabelPriority && (react_1.default.createElement(StatusInputStyling_1.TipItem, null,
        react_1.default.createElement(StatusInputStyling_1.DndItemButton, { defaultColor: "#fff", isOverdue: label._id === target.status ? isOverdue : false, isDueSoon: label._id === target.status ? isDueSoon : false, pie: StatusIcons_1.calculateCircumference(label._id, sortedLabels) },
            StatusIcons_1.default(label._id, sortedLabels),
            label.name),
        react_1.default.createElement(StatusInputStyling_1.Details, null,
            react_1.default.createElement(StatusInputStyling_1.DateStyled, null, getLocalDay(label.updatedAt)),
            label._id === target.status && (react_1.default.createElement(react_1.default.Fragment, null,
                isDueSoon && (react_1.default.createElement(StatusInputStyling_1.Expiring, { className: "dueSoon" }, "Due Soon")),
                isOverdue && (react_1.default.createElement(StatusInputStyling_1.Expiring, { className: "overdue" }, "Overdue"))))))))));
};
exports.default = StatusInputTipDropdown;
//# sourceMappingURL=StatusInputTipDropdown.js.map