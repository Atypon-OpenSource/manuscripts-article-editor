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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inspector = void 0;
const react_1 = __importStar(require("react"));
const Inspector_1 = require("../Inspector");
const Inspector = ({ tabs, commentTarget, children }) => {
    const [tabIndex, setTabIndex] = react_1.useState(0);
    react_1.useEffect(() => {
        if (commentTarget) {
            setTabIndex(tabs.findIndex((tab) => tab === 'Comments'));
        }
        //   else if (submission) {
        //     setTabIndex(tabs.findIndex((tab) => tab === 'Submissions'))
        //   }
    }, [tabs, commentTarget]);
    const childrenAsArray = react_1.default.Children.toArray(children);
    return (react_1.default.createElement(Inspector_1.InspectorContainer, null,
        react_1.default.createElement(Inspector_1.InspectorTabs, { index: tabIndex, onChange: setTabIndex },
            react_1.default.createElement(Inspector_1.InspectorTabList, null, tabs.map((label, i) => (react_1.default.createElement(Inspector_1.InspectorTab, { key: i }, label)))),
            react_1.default.createElement(Inspector_1.PaddedInspectorTabPanels, null, tabs.map((label, i) => {
                if (i !== tabIndex) {
                    return react_1.default.createElement(Inspector_1.InspectorTabPanel, { key: label });
                }
                return (react_1.default.createElement(Inspector_1.InspectorTabPanel, { key: label }, childrenAsArray[i]));
            })))));
};
exports.Inspector = Inspector;
//# sourceMappingURL=InspectorLW.js.map