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
exports.RequirementsData = void 0;
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const requirements_1 = require("@manuscripts/requirements");
const lodash_es_1 = require("lodash-es");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const getDiff = (modelMap, containedModelArray) => {
    const result = new Array();
    containedModelArray.forEach((value) => {
        if (!modelMap.get(value._id)) {
            // Determine added objects
            result.push(value);
        }
        else {
            // Determine updated objects
            if (!lodash_es_1.isEqual(modelMap.get(value._id), value)) {
                result.push(value);
            }
        }
    });
    return result;
};
const RequirementsData = ({ node, modelMap, manuscriptID, bulkUpdate }) => {
    const [isShown, setIsShown] = react_1.useState(false);
    const fixItHandler = react_1.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        const manuscriptData = new Array();
        modelMap.forEach((value) => {
            manuscriptData.push(Object.assign({}, value));
        });
        const result = requirements_1.runManuscriptFixes(manuscriptData, manuscriptID, [node], {
            parser: new DOMParser(),
            serializer: new XMLSerializer(),
        });
        const changedItems = getDiff(modelMap, result);
        yield bulkUpdate(changedItems);
    }), [modelMap, bulkUpdate, manuscriptID, node]);
    const ignoreItHandler = react_1.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        modelMap.forEach((model) => {
            if (model.objectType === manuscripts_json_schema_1.ObjectTypes.RequirementsValidation) {
                const validationModel = model;
                validationModel.results.forEach((value) => {
                    if (value._id === node._id) {
                        value.ignored = true;
                    }
                });
                modelMap.set(validationModel._id, validationModel);
            }
        });
    }), [modelMap, node]);
    return (react_1.default.createElement(InspectorContainer, null,
        react_1.default.createElement(MessageContainer, { onMouseEnter: () => setIsShown(true), onMouseLeave: () => setIsShown(false) },
            react_1.default.createElement(Message, null,
                " ",
                node.message,
                " "),
            isShown && !node.passed && node.fixable && (react_1.default.createElement(ButtonsList, null,
                react_1.default.createElement(Button, { onClick: fixItHandler }, " Fix it"),
                !node.ignored && (react_1.default.createElement(Button, { onClick: ignoreItHandler }, " Ignore")))))));
};
exports.RequirementsData = RequirementsData;
const InspectorContainer = styled_components_1.default.div `
  display: flex;
  height: 52px;
`;
const MessageContainer = styled_components_1.default.div `
  font-family: Lato;
  font-size: 14px;
  color: #353535;
  padding: 4px 0 0 58px;
`;
const Message = styled_components_1.default.div `
  display: inline;
  cursor: default;
`;
const Button = styled_components_1.default.button `
  font-family: Lato;
  font-size: 14px;
  text-decoration-line: underline;
  color: #0d79d0;
  padding: 0 0 0 9px;
  cursor: pointer;
  background: #fff;
  border: none;
  outline: none;
`;
const ButtonsList = styled_components_1.default.div `
  float: right;
  padding: 22px 0 0 0;
  cursor: pointer;
`;
//# sourceMappingURL=RequirementsData.js.map