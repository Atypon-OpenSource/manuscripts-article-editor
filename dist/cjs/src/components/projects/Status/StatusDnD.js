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
const react_1 = __importStar(require("react"));
const react_beautiful_dnd_1 = require("react-beautiful-dnd");
const StatusDnDColumn_1 = __importDefault(require("./StatusDnDColumn"));
const StatusDnD = ({ tasks, newTask, saveOrder, }) => {
    const dndColumns = ['newStatus', 'orderedStatus'];
    const onDragEnd = react_1.useCallback((result) => __awaiter(void 0, void 0, void 0, function* () {
        const { destination, source } = result;
        // dropped outside a droppable list
        if (!destination) {
            return;
        }
        // dropped in same position
        if (destination.droppableId === source.droppableId &&
            destination.index === source.index) {
            return;
        }
        // push back the labels that come after the newly reordered
        const tempLabels = tasks.splice(destination.index, tasks.length);
        tempLabels.map((tempLabel) => __awaiter(void 0, void 0, void 0, function* () {
            yield saveOrder(tempLabel, tempLabel.priority ? tempLabel.priority + 1 : 0);
        }));
        yield saveOrder(newTask, destination.index + 1);
    }), [tasks, saveOrder, newTask]);
    return (react_1.default.createElement(react_beautiful_dnd_1.DragDropContext, { onDragEnd: onDragEnd }, dndColumns.map((columnId) => (react_1.default.createElement(StatusDnDColumn_1.default, { key: columnId, id: columnId, newTask: newTask, tasks: tasks })))));
};
exports.default = StatusDnD;
//# sourceMappingURL=StatusDnD.js.map