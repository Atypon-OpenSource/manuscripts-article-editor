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
exports.useAuthStore = void 0;
const randomcolor_1 = __importDefault(require("randomcolor"));
const zustand_1 = __importDefault(require("zustand"));
const middleware_1 = require("zustand/middleware");
const authApi = __importStar(require("./api/auth"));
const ANONYMOUS_TRACK_USER = {
    id: 'anon',
    name: 'Anonymous',
    color: '#897172',
};
exports.useAuthStore = zustand_1.default(middleware_1.persist(middleware_1.combine({
    user: ANONYMOUS_TRACK_USER,
    jwt: undefined,
}, (set, get) => ({
    setUser(id, name) {
        set({
            user: {
                id: id || ANONYMOUS_TRACK_USER.id,
                name: name || ANONYMOUS_TRACK_USER.name,
                color: randomcolor_1.default({
                    luminosity: 'dark',
                }),
            },
            jwt: undefined,
        });
        console.log(`set user ${name} with id ${id}`);
    },
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, jwt } = get();
            if (!user) {
                return false;
            }
            else if (jwt) {
                // @TODO check expiration
                return true;
            }
            const resp = yield authApi.authenticate({
                user,
                token: 'a', // Should be a token retrieved from manuscripts-api
            });
            if ('data' in resp) {
                set({ jwt: resp.data.jwt });
            }
            return 'data' in resp;
        });
    },
    logout() {
        set({ user: ANONYMOUS_TRACK_USER, jwt: undefined });
    },
})), {
    name: 'quarterback-auth-store',
}));
//# sourceMappingURL=useAuthStore.js.map