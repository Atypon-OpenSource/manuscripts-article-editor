"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestionList = void 0;
const react_1 = __importDefault(require("react"));
const InspectorSection_1 = require("../../InspectorSection");
const Suggestion_1 = require("./Suggestion");
const SuggestionList = (props) => {
    const { changes, title, sortBy, handleAcceptChange, handleRejectChange, handleResetChange, handleAcceptPending, } = props;
    const changesByDate = (a, b) => b.dataTracked.updatedAt - a.dataTracked.updatedAt;
    const changesByContext = (a, b) => a.from - b.from;
    const sortedChanges = changes
        .slice()
        .sort(sortBy === 'Date' ? changesByDate : changesByContext);
    return (react_1.default.createElement(InspectorSection_1.InspectorSection, { title: title.concat(changes.length ? ` (${changes.length})` : ''), approveAll: handleAcceptPending }, sortedChanges.map((c, i) => (react_1.default.createElement(Suggestion_1.Suggestion, { suggestion: c, handleAccept: handleAcceptChange, handleReject: handleRejectChange, handleReset: handleResetChange, key: c.id })))));
};
exports.SuggestionList = SuggestionList;
//# sourceMappingURL=SuggestionList.js.map