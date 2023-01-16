"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.avatarURL = void 0;
const config_1 = __importDefault(require("../config"));
const data_1 = require("../lib/data");
const avatarURL = (profile) => {
    return [
        config_1.default.gateway.url,
        config_1.default.buckets.projects,
        profile._id,
        data_1.PROFILE_IMAGE_ATTACHMENT,
    ].join('/');
};
exports.avatarURL = avatarURL;
//# sourceMappingURL=avatar-url.js.map