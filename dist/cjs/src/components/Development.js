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
const react_1 = __importDefault(require("react"));
const react_router_1 = require("react-router");
const styled_components_1 = __importDefault(require("styled-components"));
const Importer_1 = require("../components/projects/Importer");
const config_1 = __importDefault(require("../config"));
const developer_1 = require("../lib/developer");
const store_1 = require("../store");
const ModalHookableProvider_1 = require("./ModalHookableProvider");
const ImportManuscript_1 = require("./projects/ImportManuscript");
const DropdownAction = styled_components_1.default.div `
  padding: 10px 20px;
  display: block;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.background.fifth};
  }
`;
// const DropdownInfo = styled.div`
//   padding: 10px 20px;
//   white-space: nowrap;
// `
// const PlainLink = styled.a`
//   color: inherit;
//   text-decoration: none;
// `
const Development = () => {
    const [store] = store_1.useStore((store) => store);
    const { addModal } = ModalHookableProvider_1.useModal();
    const history = react_router_1.useHistory();
    const importerHander = ImportManuscript_1.importManuscript(history, store.saveNewManuscript, undefined, (projectID, manuscriptID) => {
        alert(`Imported successfully: projectID: ${projectID}, manuscriptID: ${manuscriptID}.`);
    });
    const openImporter = () => {
        addModal('importer', ({ handleClose }) => (react_1.default.createElement(Importer_1.Importer, { handleComplete: handleClose, importManuscript: (models, redirect = true) => importerHander(models) })));
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h2", null, "Development"),
        react_1.default.createElement("div", null,
            !store.user && config_1.default.rxdb.enabled && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(DropdownAction, { onClick: () => {
                        developer_1.createToken();
                        alert('Created token');
                    } }, "Create token"),
                react_1.default.createElement(DropdownAction, { onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                        yield developer_1.createUserProfile(store.createUser);
                        alert('Created user profile. The app will be reloaded now.');
                        window.location.assign('/');
                    }) }, "Create user profile"))),
            !store.user && !config_1.default.rxdb.enabled && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("p", null, "You need to logged in first"))),
            react_1.default.createElement("br", null),
            store.user && !store.project && (react_1.default.createElement("button", { onClick: () => openImporter() }, "Import a manuscript")))));
};
exports.default = Development;
//# sourceMappingURL=Development.js.map