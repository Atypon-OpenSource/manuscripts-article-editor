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
exports.SnapshotsDropdown = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const track_changes_plugin_1 = require("@manuscripts/track-changes-plugin");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const use_dropdown_1 = require("../../hooks/use-dropdown");
const useSnapshotStore_1 = require("../../quarterback/useSnapshotStore");
const FormattedDateTime_1 = require("../FormattedDateTime");
const Dropdown_1 = require("../nav/Dropdown");
const useEditorStore_1 = require("../track-changes/useEditorStore");
const SnapshotsDropdown = () => {
    const { wrapperRef, toggleOpen, isOpen } = use_dropdown_1.useDropdown();
    const snapshotStore = useSnapshotStore_1.useSnapshotStore();
    const { snapshots, inspectedSnapshot } = snapshotStore;
    const { docToJSON, execCmd, hydrateDocFromJSON } = useEditorStore_1.useEditorStore();
    const sortedSnapshots = snapshots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const isBeingInspected = react_1.useCallback((snap) => (inspectedSnapshot === null || inspectedSnapshot === void 0 ? void 0 : inspectedSnapshot.id) === snap.id, [inspectedSnapshot]);
    function handleInspectSnapshot(snap) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!inspectedSnapshot) {
                snapshotStore.setOriginalPmDoc(docToJSON());
            }
            else if (isBeingInspected(snap)) {
                handleResumeEditing();
                return;
            }
            const resp = yield snapshotStore.inspectSnapshot(snap.id);
            if ('data' in resp) {
                hydrateDocFromJSON(resp.data.snapshot);
                execCmd(track_changes_plugin_1.trackCommands.setTrackingStatus(track_changes_plugin_1.TrackChangesStatus.viewSnapshots));
            }
        });
    }
    function handleResumeEditing() {
        snapshotStore.resumeEditing();
        const { originalPmDoc } = snapshotStore;
        if (originalPmDoc) {
            hydrateDocFromJSON(originalPmDoc);
        }
        execCmd(track_changes_plugin_1.trackCommands.setTrackingStatus(track_changes_plugin_1.TrackChangesStatus.enabled));
    }
    return (react_1.default.createElement(SnapshotContainer, null,
        react_1.default.createElement(Dropdown_1.DropdownContainer, { id: 'snapshots-dropdown', ref: wrapperRef },
            react_1.default.createElement(Dropdown_1.DropdownButtonContainer, { onClick: toggleOpen, isOpen: isOpen, className: 'dropdown-toggle' },
                react_1.default.createElement(Container, null,
                    react_1.default.createElement(AvatarContainer, null,
                        react_1.default.createElement(style_guide_1.Avatar, { size: 20 })),
                    react_1.default.createElement(InnerContainer, null,
                        react_1.default.createElement(Text, null,
                            inspectedSnapshot ? inspectedSnapshot.name : 'Current',
                            react_1.default.createElement(Dropdown_1.DropdownToggle, { className: isOpen ? 'open' : '' })),
                        inspectedSnapshot && (react_1.default.createElement(DateTime, null,
                            react_1.default.createElement(FormattedDateTime_1.FormattedDateTime, { date: Math.floor(new Date(inspectedSnapshot.createdAt).getTime() / 1000) }),
                            ' '))))),
            isOpen && (react_1.default.createElement(SnapshotsList, { top: 25, direction: 'left', minWidth: 100 },
                react_1.default.createElement(Element, { onClick: () => {
                        if (inspectedSnapshot) {
                            handleResumeEditing();
                        }
                        toggleOpen();
                    }, key: 'current' },
                    react_1.default.createElement(Container, null,
                        react_1.default.createElement(AvatarContainer, null,
                            react_1.default.createElement(style_guide_1.Avatar, { size: 20 })),
                        react_1.default.createElement(InnerContainer, null,
                            react_1.default.createElement(Text, null, 'Current')))),
                sortedSnapshots.map((snapshot) => {
                    return (react_1.default.createElement(Element, { onClick: () => {
                            handleInspectSnapshot(snapshot);
                            toggleOpen();
                        }, key: snapshot.id },
                        react_1.default.createElement(Container, null,
                            react_1.default.createElement(AvatarContainer, null,
                                react_1.default.createElement(style_guide_1.Avatar, { size: 20 })),
                            react_1.default.createElement(InnerContainer, null,
                                react_1.default.createElement(Text, null, snapshot.name),
                                react_1.default.createElement(DateTime, null,
                                    react_1.default.createElement(FormattedDateTime_1.FormattedDateTime, { date: Math.floor(new Date(snapshot.createdAt).getTime() / 1000) }),
                                    ' ')))));
                }))))));
};
exports.SnapshotsDropdown = SnapshotsDropdown;
const Container = styled_components_1.default.div `
  display: flex;
`;
const InnerContainer = styled_components_1.default.div `
  display: block;
  text-align: left;
  margin-left: 8px;
`;
const AvatarContainer = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  padding-top: ${(props) => props.theme.grid.unit}px;
`;
const SnapshotsList = styled_components_1.default(Dropdown_1.Dropdown) `
  display: block;
  overflow: auto;
  padding: ${(props) => props.theme.grid.unit * 2}px 0;
`;
const Element = styled_components_1.default(style_guide_1.SecondaryButton) `
  background: ${(props) => props.theme.colors.background.primary} !important;
  display: inline-block;
  width: 100%;
  padding: ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 6}px;
  white-space: nowrap;
  border: none;
  &:not([disabled]):hover {
    background: ${(props) => props.theme.colors.background.fifth} !important;
  }
`;
const SnapshotContainer = styled_components_1.default.div `
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 3}px;
  margin-top: ${(props) => props.theme.grid.unit * 6}px;
  align-items: center;

  .dropdown-toggle {
    border: none;
    background: transparent !important;
  }

  &:hover {
    background: ${(props) => props.theme.colors.background.fifth};
  }
`;
const Text = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.font.size.normal};
  display: flex;
  align-items: center;
`;
const DateTime = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.normal};
`;
//# sourceMappingURL=SnapshotsDropdown.js.map