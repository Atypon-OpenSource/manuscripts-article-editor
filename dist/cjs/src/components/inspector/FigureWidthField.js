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
exports.FigureWidthField = void 0;
const lodash_es_1 = require("lodash-es");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const use_synced_data_1 = require("../../hooks/use-synced-data");
const inputs_1 = require("../projects/inputs");
const ManuscriptStyleInspector_1 = require("./ManuscriptStyleInspector");
const StyleFields_1 = require("./StyleFields");
const FigureWidthField = ({ value, defaultValue, handleChange }) => {
    const handlePercentChange = react_1.useCallback((value) => {
        handleChange(value / 100);
    }, [handleChange]);
    const [currentValue, handleLocalChange, setEditing] = use_synced_data_1.useSyncedData(Math.round(StyleFields_1.valueOrDefault(value, defaultValue) * 100), // percent
    handlePercentChange, 500);
    const handleInputChange = react_1.useCallback((event) => {
        handleLocalChange(Number(event.target.value));
    }, [handleLocalChange]);
    return (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Width"),
        react_1.default.createElement(RangeContainer, { style: { flex: 1 } },
            react_1.default.createElement(DataList, { id: 'figureWidthList' },
                react_1.default.createElement("option", { value: 10, label: '10%' }, "10%"),
                lodash_es_1.range(20, 100, 10).map((value) => (react_1.default.createElement("option", { key: value, value: value }))),
                react_1.default.createElement("option", { value: 100, label: 'Fit to margin' }, "Fit to margin"),
                react_1.default.createElement("option", { value: 200, label: 'Full page' }, "Full page")),
            react_1.default.createElement(inputs_1.StyleRange, { min: 10, max: 200, type: 'range', name: 'figure-width', list: 'figureWidthList', value: currentValue, onChange: handleInputChange, style: { width: '100%' } })),
        react_1.default.createElement(inputs_1.SmallNumberField, { value: Math.min(currentValue, 100), onChange: handleInputChange, onFocus: () => setEditing(true), onBlur: () => setEditing(false), disabled: currentValue > 100 }),
        "%"));
};
exports.FigureWidthField = FigureWidthField;
const RangeContainer = styled_components_1.default.div `
  flex: 1;
  margin-right: ${(props) => props.theme.grid.unit * 2}px;

  input[type='range']::-moz-range-track {
    background: repeating-linear-gradient(
      to right,
      #fff,
      #fff 4.5%,
      #555 4.5%,
      #555 5.5%,
      #fff 5.5%,
      #fff 10%
    );
  }
`;
const DataList = styled_components_1.default.datalist `
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #555;

  option {
    width: 58px;
    text-align: center;

    &:first-child {
      text-align: left;
    }

    &:last-child {
      text-align: right;
    }

    &:not([label]) {
      display: none;
    }
  }
`;
//# sourceMappingURL=FigureWidthField.js.map