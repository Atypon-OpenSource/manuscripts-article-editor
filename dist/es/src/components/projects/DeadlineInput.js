"use strict";
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
exports.DeadlineInput = void 0;
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
require("react-modern-calendar-datepicker/lib/DatePicker.css");
const AttentionOrange_1 = __importDefault(require("@manuscripts/assets/react/AttentionOrange"));
const AttentionRed_1 = __importDefault(require("@manuscripts/assets/react/AttentionRed"));
const style_guide_1 = require("@manuscripts/style-guide");
const date_fns_1 = require("date-fns");
const react_1 = __importDefault(require("react"));
const react_modern_calendar_datepicker_1 = __importDefault(require("react-modern-calendar-datepicker"));
const react_tooltip_1 = __importDefault(require("react-tooltip"));
const styled_components_1 = __importStar(require("styled-components"));
const store_1 = require("../../store");
const DateInput = styled_components_1.default(style_guide_1.TextField).attrs({
    type: 'search',
}) `
  -webkit-appearance: none;
  padding: 8px;
  border-radius: 8px;
  font-size: 1em;

  color: ${(props) => props.overdue
    ? props.theme.colors.text.error
    : props.dueSoon
        ? props.theme.colors.text.warning
        : props.theme.colors.text.primary};

  &:focus::placeholder {
    color: transparent;
  }
`;
const IconWrapper = styled_components_1.default.div `
  position: absolute;
  top: 0;
  bottom: 0;
  right: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .tooltip {
    border-radius: 6px;
  }
`;
const todayStyles = styled_components_1.css `
  .Calendar__day.-today {
    border: 1px solid #bce7f6 !important;
    background: #f2fbfc !important;
  }

  .Calendar__day.-today::after {
    opacity: 0.5 !important;
  }
`;
const CalendarContainer = styled_components_1.default.div `
  width: 100%;

  .DatePicker {
    width: 100%;
    z-index: 10;
  }

  .Calendar__weekDay {
    color: #e6e6e;
    font-size: 14px;
  }

  .Calendar__day:not(.-blank):not(.-selected):hover {
    background: #f2fbfc !important;
  }

  .Calendar__day.-today:hover::after {
    opacity: 0.5 !important;
  }

  ${(props) => !props.selected && todayStyles};

  .selected-day {
    color: #353535 !important;
    border: 1px solid #bce7f6 !important;
  }

  .DatePicker__calendarContainer {
    position: absolute;
    top: unset;
    left: unset !important;
    right: 0 !important;
    transform: unset !important;
  }
`;
const DeadlineInput = ({ target, isOverdue, isDueSoon }) => {
    const [saveModel] = store_1.useStore((store) => store.saveModel);
    const renderCustomInput = ({ ref }) => (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(DateInput, { ref: ref, placeholder: 'Empty', value: target.deadline ? formatDate(target.deadline) : '', onChange: (event) => __awaiter(void 0, void 0, void 0, function* () {
                const searchText = event.currentTarget.value;
                if (!searchText) {
                    yield saveModel(Object.assign(Object.assign({}, target), { deadline: undefined }));
                }
            }), overdue: isOverdue, dueSoon: isDueSoon }),
        isOverdue && (react_1.default.createElement(IconWrapper, null,
            react_1.default.createElement("div", { "data-tip": true, "data-for": 'Overdue' },
                react_1.default.createElement(AttentionRed_1.default, { width: 20, height: 20 })),
            react_1.default.createElement(react_tooltip_1.default, { id: 'Overdue', place: "bottom", effect: "solid", offset: { top: 4 }, className: "tooltip" }, "Overdue"))),
        isDueSoon && (react_1.default.createElement(IconWrapper, null,
            react_1.default.createElement("div", { "data-tip": true, "data-for": 'Due-Soon' },
                react_1.default.createElement(AttentionOrange_1.default, { width: 20, height: 20 })),
            react_1.default.createElement(react_tooltip_1.default, { id: 'Due-Soon', place: "bottom", effect: "solid", offset: { top: 4 }, className: "tooltip" }, "Due Soon")))));
    return (react_1.default.createElement(CalendarContainer, { selected: target.deadline ? true : false },
        react_1.default.createElement(react_modern_calendar_datepicker_1.default, { value: target.deadline ? day(target.deadline) : null, renderInput: renderCustomInput, onChange: (date) => __awaiter(void 0, void 0, void 0, function* () {
                yield saveModel(Object.assign(Object.assign({}, target), { deadline: date ? timeStamp(date) / 1000 : undefined }));
            }), calendarPopperPosition: 'bottom', colorPrimary: "#f2fbfc", calendarSelectedDayClassName: 'selected-day', calendarClassName: 'responsive-calendar' })));
};
exports.DeadlineInput = DeadlineInput;
const formatDate = (ms) => date_fns_1.format(new Date(ms * 1000), 'iiii d LLLL');
const timeStamp = (date) => {
    return Date.parse(`${date.year}-${date.month < 10 ? `0${date.month}` : date.month}-${date.day < 10 ? `0${date.day}` : date.day}`);
};
const day = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
    };
};
//# sourceMappingURL=DeadlineInput.js.map