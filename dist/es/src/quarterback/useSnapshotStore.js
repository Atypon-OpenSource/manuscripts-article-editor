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
exports.useSnapshotStore = void 0;
const zustand_1 = __importDefault(require("zustand"));
const middleware_1 = require("zustand/middleware");
const snapApi = __importStar(require("./api/snapshot"));
const useDocStore_1 = require("./useDocStore");
exports.useSnapshotStore = zustand_1.default(middleware_1.combine({
    originalPmDoc: null,
    snapshots: [],
    snapshotsMap: new Map(),
    inspectedSnapshot: null,
}, (set, get) => ({
    init() {
        set({
            originalPmDoc: null,
            snapshots: [],
            snapshotsMap: new Map(),
            inspectedSnapshot: null,
        });
    },
    setSnapshots(snapshots) {
        set({ snapshots });
    },
    setOriginalPmDoc: (pmDoc) => {
        set({ originalPmDoc: pmDoc });
    },
    inspectSnapshot: (id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const inspected = (_a = get().snapshotsMap.get(id)) !== null && _a !== void 0 ? _a : null;
        set({ inspectedSnapshot: inspected });
        if (inspected) {
            return { data: inspected };
        }
        const resp = yield snapApi.getSnapshot(id);
        if ('data' in resp) {
            set((state) => ({
                snapshotsMap: state.snapshotsMap.set(id, resp.data),
                inspectedSnapshot: resp.data,
            }));
        }
        return resp;
    }),
    resumeEditing: () => {
        set({
            inspectedSnapshot: null,
        });
    },
    saveSnapshot: (docJson) => __awaiter(void 0, void 0, void 0, function* () {
        const { currentDocument } = useDocStore_1.useDocStore.getState();
        let resp;
        if (!currentDocument) {
            resp = { err: 'No current document', code: 400 };
        }
        else {
            resp = yield snapApi.saveSnapshot({
                docId: currentDocument.manuscriptID,
                snapshot: docJson,
                name: new Date().toLocaleString('sv'),
            });
        }
        if ('data' in resp) {
            const { data: { snapshot }, } = resp;
            set((state) => {
                const { snapshotsMap } = state;
                let { snapshots } = state;
                snapshotsMap.set(snapshot.id, snapshot);
                snapshots = [
                    ...snapshots,
                    {
                        id: snapshot.id,
                        createdAt: snapshot.createdAt,
                        name: snapshot.name,
                    },
                ];
                return {
                    snapshots,
                    snapshotsMap,
                };
            });
        }
        return resp;
    }),
    updateSnapshot: (snapId, values) => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield snapApi.updateSnapshot(snapId, values);
        if ('data' in resp) {
            set((state) => {
                let { snapshots, snapshotsMap } = state;
                const oldSnap = snapshotsMap.get(snapId);
                if (oldSnap) {
                    snapshotsMap = snapshotsMap.set(snapId, Object.assign(Object.assign({}, oldSnap), values));
                }
                snapshots = snapshots.map((s) => s.id === snapId ? Object.assign(Object.assign({}, s), values) : s);
                return {
                    snapshotsMap,
                    snapshots,
                };
            });
        }
        return resp;
    }),
    deleteSnapshot: (snapId) => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield snapApi.deleteSnapshot(snapId);
        if ('data' in resp) {
            set((state) => {
                const { snapshotsMap } = state;
                let { snapshots } = state;
                snapshotsMap.delete(snapId);
                snapshots = snapshots.filter((s) => s.id !== snapId);
                return {
                    snapshots,
                    snapshotsMap,
                };
            });
        }
        return resp;
    }),
})));
//# sourceMappingURL=useSnapshotStore.js.map