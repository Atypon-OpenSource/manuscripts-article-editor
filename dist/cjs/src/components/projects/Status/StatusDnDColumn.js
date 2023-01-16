"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_beautiful_dnd_1 = require("react-beautiful-dnd");
const StatusDnDTask_1 = __importDefault(require("./StatusDnDTask"));
const StatusIcons_1 = require("./StatusIcons");
const StatusInputStyling_1 = require("./StatusInputStyling");
const StatusDnDColumn = ({ id, newTask, tasks, }) => (react_1.default.createElement(react_beautiful_dnd_1.Droppable, { droppableId: id }, (provided) => (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement("div", Object.assign({}, provided.droppableProps, { ref: provided.innerRef, className: id }),
        id === 'newStatus' ? (react_1.default.createElement(StatusDnDTask_1.default, { id: 'newTask', task: newTask, index: -1, tasks: tasks, isDragDisabled: false })) : (tasks.map((task, index) => (react_1.default.createElement(StatusDnDTask_1.default, { key: task._id, id: task._id, task: task, index: index, tasks: tasks, isDragDisabled: true })))),
        provided.placeholder),
    id === 'newStatus' && (react_1.default.createElement(StatusInputStyling_1.DndDisclaimer, null,
        react_1.default.createElement(StatusIcons_1.DndIcon, null),
        react_1.default.createElement("p", null,
            "Drag the \"",
            newTask,
            "\" status to fix position")))))));
exports.default = StatusDnDColumn;
//# sourceMappingURL=StatusDnDColumn.js.map