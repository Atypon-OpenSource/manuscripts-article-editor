"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotsDropdown = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const use_dropdown_1 = require("../../hooks/use-dropdown");
const user_1 = require("../../lib/user");
const FormattedDateTime_1 = require("../FormattedDateTime");
const Dropdown_1 = require("../nav/Dropdown");
const SnapshotsDropdown = ({ snapshots, selectSnapshot, selectedSnapshot, selectedSnapshotURL, }) => {
    const { wrapperRef, toggleOpen, isOpen } = use_dropdown_1.useDropdown();
    return (react_1.default.createElement(SnapshotContainer, null,
        react_1.default.createElement(Dropdown_1.DropdownContainer, { id: 'snapshots-dropdown', ref: wrapperRef },
            react_1.default.createElement(Dropdown_1.DropdownButtonContainer, { onClick: toggleOpen, isOpen: isOpen, className: 'dropdown-toggle' },
                react_1.default.createElement(Container, null,
                    react_1.default.createElement(AvatarContainer, null,
                        react_1.default.createElement(style_guide_1.Avatar, { size: 20, src: user_1.avatarURL(selectedSnapshot.creator) })),
                    react_1.default.createElement(InnerContainer, null,
                        react_1.default.createElement(Text, null,
                            selectedSnapshot.name,
                            selectedSnapshot._id == snapshots[0]._id && ' (Current)',
                            react_1.default.createElement(Dropdown_1.DropdownToggle, { className: isOpen ? 'open' : '' })),
                        react_1.default.createElement(Date, null,
                            react_1.default.createElement(FormattedDateTime_1.FormattedDateTime, { date: selectedSnapshot.createdAt }),
                            ' ')))),
            isOpen && (react_1.default.createElement(SnapshotsList, { top: 25, direction: 'left', minWidth: 100 }, snapshots.map((snapshot) => {
                return (react_1.default.createElement(Element, { onClick: () => {
                        selectSnapshot(snapshot);
                        toggleOpen();
                    }, key: snapshot._id, disabled: true },
                    react_1.default.createElement(Container, null,
                        react_1.default.createElement(AvatarContainer, null,
                            react_1.default.createElement(style_guide_1.Avatar, { size: 20, src: user_1.avatarURL(snapshot.creator) })),
                        react_1.default.createElement(InnerContainer, null,
                            react_1.default.createElement(Text, null,
                                snapshot.name,
                                ' ',
                                snapshot._id == snapshots[0]._id && ' (Current)',
                                ' '),
                            react_1.default.createElement(Date, null,
                                react_1.default.createElement(FormattedDateTime_1.FormattedDateTime, { date: snapshot.createdAt }),
                                ' ')))));
            })))),
        react_1.default.createElement(ViewLink, { to: selectedSnapshotURL }, "View")));
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
  display: flex;
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
const Date = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.normal};
`;
const ViewLink = styled_components_1.default(react_router_dom_1.Link) `
  font-size: ${(props) => props.theme.font.size.medium};
  line-height: ${(props) => props.theme.font.lineHeight.large};
  color: ${(props) => props.theme.colors.text.tertiary};
  text-decoration: none;
  margin: 0 1em;
`;
//# sourceMappingURL=SnapshotsDropdown.js.map