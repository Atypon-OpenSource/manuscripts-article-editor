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
exports.useDocStore = void 0;
const zustand_1 = __importDefault(require("zustand"));
const middleware_1 = require("zustand/middleware");
const docApi = __importStar(require("./api/document"));
exports.useDocStore = zustand_1.default(middleware_1.combine({
    currentDocument: null,
    quarterbackDoc: null,
}, (set, get) => ({
    setCurrentDocument: (manuscriptID, projectID) => {
        set({ currentDocument: { manuscriptID, projectID } });
    },
    getDocument: (manuscriptID) => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield docApi.getDocument(manuscriptID);
        if ('data' in resp) {
            set({ quarterbackDoc: resp.data });
        }
        return resp;
    }),
    createDocument: (manuscriptID, projectID) => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield docApi.createDocument({
            manuscript_model_id: manuscriptID,
            project_model_id: projectID,
            doc: {},
        });
        if ('data' in resp) {
            set({
                currentDocument: { manuscriptID, projectID },
                quarterbackDoc: resp.data,
            });
        }
        return resp;
    }),
    updateDocument: (id, doc) => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield docApi.updateDocument(id, { doc });
        if ('data' in resp) {
            set((state) => {
                const { quarterbackDoc } = state;
                if (quarterbackDoc) {
                    return {
                        quarterbackDoc: Object.assign(Object.assign({}, quarterbackDoc), { doc }),
                    };
                }
                return state;
            });
        }
        return resp;
    }),
    deleteDocument: (manuscriptId) => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield docApi.deleteDocument(manuscriptId);
        if ('data' in resp) {
            set((state) => {
                var _a;
                return ((_a = state.quarterbackDoc) === null || _a === void 0 ? void 0 : _a.manuscript_model_id) === manuscriptId
                    ? { quarterbackDoc: null }
                    : state;
            });
        }
        return resp;
    }),
})));
//# sourceMappingURL=useDocStore.js.map