"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const ModalHookableProvider_1 = require("../ModalHookableProvider");
const HistoricalView_1 = require("./HistoricalView");
const useOpenHistoricalModal = (project, manuscript, user, selectSnapshot) => {
    const { addModal } = ModalHookableProvider_1.useModal();
    const viewHandler = (selectedSnapshot) => {
        if (!selectedSnapshot || !selectedSnapshot.s3Id) {
            return;
        }
        addModal('historicalView', ({ handleClose }) => {
            return (react_1.default.createElement(HistoricalModal, null,
                react_1.default.createElement(HistoricalView_1.HistoricalView, { snapshotID: selectedSnapshot.s3Id, project: project, manuscript: manuscript, user: user, handleClose: handleClose, selectSnapshot: (snapshot) => {
                        selectSnapshot(snapshot);
                    }, viewHandler: viewHandler })));
        });
    };
    return viewHandler;
};
const HistoricalModal = styled_components_1.default.div `
  position: relative;
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #fff;
`;
exports.default = useOpenHistoricalModal;
//# sourceMappingURL=HistoricalViewModal.js.map