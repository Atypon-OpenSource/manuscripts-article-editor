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
exports.useCommentStore = void 0;
const randomcolor_1 = __importDefault(require("randomcolor"));
const zustand_1 = __importDefault(require("zustand"));
const middleware_1 = require("zustand/middleware");
const commentApi = __importStar(require("./api/comment"));
const useAuthStore_1 = require("./useAuthStore");
const ANONYMOUS_USER = {
    name: 'Anonymous',
    color: randomcolor_1.default({
        luminosity: 'dark',
    }),
};
function computeChangeComments(commentsMap) {
    const changeMap = new Map();
    Array.from(commentsMap.values()).forEach((c) => {
        const prev = changeMap.get(c.target_id);
        if (prev) {
            changeMap.set(c.target_id, [...prev, c].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)));
        }
        else {
            changeMap.set(c.target_id, [c]);
        }
    });
    return changeMap;
}
exports.useCommentStore = zustand_1.default(middleware_1.combine({
    commentsMap: new Map(),
    changeComments: new Map(),
    userColorsMap: new Map(),
    usersMap: new Map(),
    openCommentLists: new Set(),
}, (set, get) => ({
    init() {
        set({
            commentsMap: new Map(),
            changeComments: new Map(),
            userColorsMap: new Map(),
            usersMap: new Map(),
            openCommentLists: new Set(),
        });
    },
    setUsers(collaboratorsById) {
        const { user } = useAuthStore_1.useAuthStore.getState();
        const usersMap = new Map();
        if (user) {
            usersMap.set(user.id, user);
        }
        collaboratorsById.forEach((u) => {
            // Skip current user
            if (usersMap.has(u._id)) {
                return;
            }
            const color = randomcolor_1.default({
                luminosity: 'dark',
            });
            usersMap.set(u._id, {
                id: u._id,
                name: u.bibliographicName.given || u.userID,
                color,
            });
        });
        set({ usersMap });
    },
    toggleCommentListOpen: (id) => {
        set((state) => {
            const { openCommentLists } = state;
            if (openCommentLists.has(id)) {
                openCommentLists.delete(id);
            }
            else {
                openCommentLists.add(id);
            }
            return { openCommentLists };
        });
    },
    listComments: (docId) => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield commentApi.listComments(docId);
        if ('data' in resp) {
            set((state) => {
                const { usersMap } = state;
                const commentsMap = new Map(resp.data.comments.map((c) => {
                    const user = usersMap.get(c.user_model_id) || ANONYMOUS_USER;
                    const comment = Object.assign(Object.assign({}, c), { user });
                    return [c.id, comment];
                }));
                return {
                    commentsMap,
                    changeComments: computeChangeComments(commentsMap),
                };
            });
        }
        return resp;
    }),
    createComment: (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield commentApi.createComment(payload);
        if ('data' in resp) {
            set((state) => {
                const { commentsMap } = state;
                commentsMap.set(resp.data.id, Object.assign(Object.assign({}, resp.data), { user: {
                        name: user.name,
                        color: user.color,
                    } }));
                return {
                    commentsMap,
                    changeComments: computeChangeComments(commentsMap),
                };
            });
        }
        return resp;
    }),
    updateComment: (commentId, values) => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield commentApi.updateComment(commentId, values);
        if ('data' in resp) {
            set((state) => {
                const { commentsMap } = state;
                const old = commentsMap.get(commentId);
                if (old) {
                    commentsMap.set(commentId, Object.assign(Object.assign({}, old), values));
                    return {
                        commentsMap,
                        changeComments: computeChangeComments(commentsMap),
                    };
                }
                return state;
            });
        }
        return resp;
    }),
    deleteComment: (snapId) => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield commentApi.deleteComment(snapId);
        if ('data' in resp) {
            set((state) => {
                const { commentsMap } = state;
                commentsMap.delete(snapId);
                return {
                    commentsMap,
                    changeComments: computeChangeComments(commentsMap),
                };
            });
        }
        return resp;
    }),
})));
//# sourceMappingURL=useCommentStore.js.map