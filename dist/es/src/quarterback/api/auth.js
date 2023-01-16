"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const methods_1 = require("./methods");
const authenticate = (payload) => methods_1.post('authenticate', payload, 'Authentication failed', methods_1.DEFAULT_HEADERS);
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map