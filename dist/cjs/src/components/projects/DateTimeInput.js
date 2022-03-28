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
exports.DateTimeInput = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
// @ts-ignore
const react_datetime_picker_1 = __importDefault(require("react-datetime-picker"));
const styled_components_1 = __importDefault(require("styled-components"));
const DateTimeInput = ({ value, handleChange }) => {
    const [date, setDate] = react_1.useState(value);
    react_1.useEffect(() => {
        setDate(value);
    }, [value]);
    const saveDate = react_1.useCallback(() => {
        handleChange(date);
    }, [date, handleChange]);
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(StyledDateTimePicker, { onChange: (newValue) => {
                if (newValue) {
                    setDate(newValue.getTime());
                }
                else {
                    setDate(undefined);
                    if (value !== undefined) {
                        handleChange(undefined);
                    }
                }
            }, value: date && new Date(date), showLeadingZeros: true, maxDetail: 'minute', calendarIcon: null, disableClock: true }),
        date !== value && (react_1.default.createElement(style_guide_1.PrimaryButton, { mini: true, onClick: saveDate }, "Save"))));
};
exports.DateTimeInput = DateTimeInput;
const Container = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const StyledDateTimePicker = styled_components_1.default(react_datetime_picker_1.default) `
  height: 24px;

  .react-datetime-picker__wrapper {
    border: none;
    display: flex;
    align-items: center;
  }

  .react-datetime-picker__clear-button {
    display: none;
  }

  &:hover {
    .react-datetime-picker__clear-button {
      display: inline-flex;
    }
  }

  .react-datetime-picker__clear-button svg {
    stroke: #bbb;
  }
`;
//# sourceMappingURL=DateTimeInput.js.map