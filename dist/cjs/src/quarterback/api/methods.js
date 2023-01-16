"use strict";
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
exports.del = exports.put = exports.post = exports.get = exports.wrappedFetch = exports.getAuthHeader = exports.DEFAULT_HEADERS = void 0;
const config_1 = __importDefault(require("../../config"));
const useAuthStore_1 = require("../useAuthStore");
const { quarterback: { url: QUARTERBACK_URL }, } = config_1.default;
exports.DEFAULT_HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};
let debouncedAuth = false;
function getAuthHeader() {
    const jwt = useAuthStore_1.useAuthStore.getState().jwt;
    if (!jwt && !debouncedAuth) {
        // To ensure that user stays authenticated incase the token expires or something weird like
        // https://jira.atypon.com/browse/LEAN-1619 happens, we'll run authenticate again each time
        // quarterback-api is called (basically doc PUTs)
        debouncedAuth = true;
        useAuthStore_1.useAuthStore.getState().authenticate();
        setTimeout(() => {
            debouncedAuth = false;
        }, 5000);
    }
    // @TODO use non-standard authorization header while istio is enabled but not in use.
    // This means it parses all Authorization headers and fails since the quarterback API issuer
    // has not been configured with istio.
    // https://jira.atypon.com/browse/LEAN-1274
    return jwt && { 'X-Authorization': `Bearer ${jwt.token}` };
}
exports.getAuthHeader = getAuthHeader;
function wrappedFetch(path, options, defaultError = 'Request failed') {
    return __awaiter(this, void 0, void 0, function* () {
        let resp;
        try {
            resp = yield fetch(`${QUARTERBACK_URL}/${path}`, options);
        }
        catch (err) {
            // Must be a connection error (?)
            console.error(err);
            return { err: 'Connection error', code: 550 };
        }
        let data;
        const contentType = resp.headers.get('Content-Type');
        if (!contentType || contentType.includes('application/json')) {
            data = yield resp.json();
        }
        else if (contentType.includes('application/octet-stream')) {
            data = yield resp.arrayBuffer();
        }
        if (!resp.ok) {
            console.error((data === null || data === void 0 ? void 0 : data.message) || defaultError);
            return {
                err: (data === null || data === void 0 ? void 0 : data.message) || defaultError,
                code: resp.status,
            };
        }
        return { data };
    });
}
exports.wrappedFetch = wrappedFetch;
function get(path, defaultError, headers = Object.assign(Object.assign({}, exports.DEFAULT_HEADERS), getAuthHeader())) {
    return wrappedFetch(path, {
        method: 'GET',
        headers,
    }, defaultError);
}
exports.get = get;
function post(path, payload, defaultError, headers = Object.assign(Object.assign({}, exports.DEFAULT_HEADERS), getAuthHeader())) {
    return wrappedFetch(path, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    }, defaultError);
}
exports.post = post;
function put(path, payload, defaultError, headers = Object.assign(Object.assign({}, exports.DEFAULT_HEADERS), getAuthHeader())) {
    return wrappedFetch(path, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
    }, defaultError);
}
exports.put = put;
function del(path, defaultError, headers = Object.assign(Object.assign({}, exports.DEFAULT_HEADERS), getAuthHeader())) {
    return wrappedFetch(path, {
        method: 'DELETE',
        headers,
    }, defaultError);
}
exports.del = del;
//# sourceMappingURL=methods.js.map