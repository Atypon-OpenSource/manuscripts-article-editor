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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_beautiful_dnd_1 = require("react-beautiful-dnd");
const StatusIcons_1 = __importStar(require("./StatusIcons"));
const StatusInputStyling_1 = require("./StatusInputStyling");
const StatusDnDTask = ({ id, task, tasks, index, isDragDisabled, }) => (react_1.default.createElement(react_beautiful_dnd_1.Draggable, { key: id, draggableId: id, index: index, isDragDisabled: isDragDisabled }, (provided, snapshot) => (react_1.default.createElement(StatusInputStyling_1.DndItemButton, Object.assign({ isDragging: snapshot.isDragging, ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps, { pie: StatusIcons_1.calculateCircumference(id, tasks), style: provided.draggableProps.style }),
    StatusIcons_1.default(id, tasks),
    typeof task === 'string' ? task : task.name))));
exports.default = StatusDnDTask;
//# sourceMappingURL=StatusDnDTask.js.map