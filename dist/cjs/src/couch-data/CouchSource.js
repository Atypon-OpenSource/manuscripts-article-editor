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
const AllData_1 = __importDefault(require("./AllData"));
class CouchSource {
    constructor() {
        this.build = (state, next) => __awaiter(this, void 0, void 0, function* () {
            if (state.manuscriptID && state.projectID) {
                this.rxDBDataBridge = new AllData_1.default({
                    projectID: state.projectID,
                    manuscriptID: state.manuscriptID,
                    userID: state.userID || '',
                });
            }
            yield this.rxDBDataBridge.init();
            this.ready = true;
            const data = yield this.rxDBDataBridge.getData();
            next(Object.assign({}, data));
        });
        this.afterAction = (state, setState) => {
            var _a;
            if (state.manuscriptID !== this.rxDBDataBridge.manuscriptID ||
                state.projectID !== this.rxDBDataBridge.projectID ||
                state.userID !== this.rxDBDataBridge.userID) {
                if (state.userID) {
                    (_a = this.rxDBDataBridge
                        .reload(state.manuscriptID, state.projectID, state.userID)) === null || _a === void 0 ? void 0 : _a.then(() => {
                        setState((state) => {
                            return Object.assign(Object.assign({}, state), this.rxDBDataBridge.getData());
                        });
                    });
                }
                else {
                    // ...
                }
            }
        };
        this.updateStore = (setState) => {
            this.unsubscribeFromData = this.rxDBDataBridge.onUpdate((couchDataState) => {
                setState((state) => {
                    return Object.assign(Object.assign({}, state), couchDataState);
                });
            });
        };
        // listen = (unsubscribe: () => void) => {
        //   this.storeUnsubscribe = unsubscribe
        //   // feed updates from the store
        //   return (setState: stateSetter) => {}
        // }
    }
}
exports.default = CouchSource;
//# sourceMappingURL=CouchSource.js.map