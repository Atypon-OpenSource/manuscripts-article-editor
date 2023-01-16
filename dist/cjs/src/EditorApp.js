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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_hot_loader_1 = require("react-hot-loader");
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const ModalHookableProvider_1 = require("./components/ModalHookableProvider");
const NotificationProvider_1 = require("./components/NotificationProvider");
const Page_1 = require("./components/Page");
const Placeholders_1 = require("./components/Placeholders");
const ManuscriptPageContainerLW_1 = __importDefault(require("./components/projects/lean-workflow/ManuscriptPageContainerLW"));
const config_1 = __importDefault(require("./config"));
const CouchSource_1 = __importDefault(require("./couch-data/CouchSource"));
const use_handle_snapshot_1 = require("./hooks/use-handle-snapshot");
const user_1 = require("./lib/user");
const PsSource_1 = __importDefault(require("./postgres-data/PsSource"));
const useAuthStore_1 = require("./quarterback/useAuthStore");
const useLoadDoc_1 = require("./quarterback/useLoadDoc");
const usePouchStore_1 = require("./quarterback/usePouchStore");
const store_1 = require("./store");
const Wrapper = styled_components_1.default.div `
  display: flex;
  box-sizing: border-box;
  color: rgb(53, 53, 53);
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: Lato, sans-serif;
`;
const EditorApp = ({ parentObserver, submissionId, manuscriptID, projectID, submission, fileManagement, person, authToken, }) => {
    var _a;
    const userID = user_1.getCurrentUserId();
    const [store, setStore] = react_1.useState();
    const { setUser } = useAuthStore_1.useAuthStore();
    const { init: initPouchStore } = usePouchStore_1.usePouchStore();
    react_1.useMemo(() => {
        var _a;
        const user = (_a = store === null || store === void 0 ? void 0 : store.state) === null || _a === void 0 ? void 0 : _a.user;
        if (user) {
            setUser(user._id, user.bibliographicName.given || user.userID);
        }
        else {
            setUser();
        }
    }, [(_a = store === null || store === void 0 ? void 0 : store.state) === null || _a === void 0 ? void 0 : _a.user, setUser]);
    const loadDoc = useLoadDoc_1.useLoadDoc();
    react_1.useEffect(() => {
        // implement remount for the store if component is retriggered
        const basicSource = new store_1.BasicSource(submissionId, fileManagement, projectID, manuscriptID, submission, person, userID || '', authToken || '');
        const mainSource = config_1.default.rxdb.enabled
            ? new CouchSource_1.default()
            : new PsSource_1.default(submission.attachments);
        Promise.all([
            loadDoc(manuscriptID, projectID),
            store_1.createStore([basicSource, mainSource], undefined, undefined, parentObserver),
        ])
            .then(([doc, store]) => {
            var _a;
            // if no doc found in track changes backend, the one produced from manuscripts backend will be used (store.doc)
            if (doc) {
                store.setState((s) => (Object.assign(Object.assign({}, s), { doc })));
            }
            initPouchStore({
                getModels: () => { var _a; return (_a = store.state) === null || _a === void 0 ? void 0 : _a.modelMap; },
                saveModel: (_a = store.state) === null || _a === void 0 ? void 0 : _a.saveModel,
            });
            setStore(store);
        })
            .catch((e) => {
            console.error(e);
        });
        return () => {
            parentObserver === null || parentObserver === void 0 ? void 0 : parentObserver.detach();
            store === null || store === void 0 ? void 0 : store.unmount();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submissionId, manuscriptID, projectID]);
    const handleSnapshot = use_handle_snapshot_1.useHandleSnapshot(!!store);
    react_1.useEffect(() => {
        if (handleSnapshot) {
            store === null || store === void 0 ? void 0 : store.setState((state) => (Object.assign({ handleSnapshot }, state)));
        }
    }, [handleSnapshot, store]);
    return store ? (react_1.default.createElement(store_1.GenericStoreProvider, { store: store },
        react_1.default.createElement(ModalHookableProvider_1.ModalProvider, null,
            react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
                react_1.default.createElement(NotificationProvider_1.NotificationProvider, null,
                    react_1.default.createElement(Page_1.Page, null,
                        react_1.default.createElement(Wrapper, null,
                            react_1.default.createElement(ManuscriptPageContainerLW_1.default, null)))))))) : (react_1.default.createElement(Placeholders_1.ProjectPlaceholder, null));
};
exports.default = react_hot_loader_1.hot(module)(EditorApp);
//# sourceMappingURL=EditorApp.js.map