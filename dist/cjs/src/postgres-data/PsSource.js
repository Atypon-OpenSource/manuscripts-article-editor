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
const Api_1 = __importDefault(require("./Api"));
const buildData_1 = __importDefault(require("./buildData"));
const buildUtilities_1 = __importDefault(require("./buildUtilities"));
class PsSource {
    constructor(attachments) {
        this.updateState = (state) => {
            console.error(new Error('Store not yet mounted').stack);
        };
        this.build = (state, next, setState) => __awaiter(this, void 0, void 0, function* () {
            if (state.userID && state.authToken) {
                this.api.setToken(state.authToken);
            }
            if (state.manuscriptID && state.projectID) {
                this.data = yield buildData_1.default(state.projectID, state.manuscriptID, this.api, this.attachments);
                this.utilities = buildUtilities_1.default(this.data, this.api, setState);
            }
            next(Object.assign(Object.assign(Object.assign({}, state), this.data), this.utilities));
        });
        this.afterAction = (state, setState) => {
            return;
        };
        this.updateStore = (setState) => {
            this.updateState = setState;
        };
        this.api = new Api_1.default();
        this.attachments = attachments;
        // import api
        // get user and all the data
        // build and provide methods such as saveModel, saveManuscript etc. (see ModelManager in couch-data)
        // conform with the store
    }
}
exports.default = PsSource;
//# sourceMappingURL=PsSource.js.map