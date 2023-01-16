"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Time = exports.AvatarContainer = exports.SuggestionSnippet = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const track_changes_plugin_1 = require("@manuscripts/track-changes-plugin");
const react_1 = __importDefault(require("react"));
const react_tooltip_1 = __importDefault(require("react-tooltip"));
const styled_components_1 = __importDefault(require("styled-components"));
const roles_1 = require("../../../lib/roles");
const store_1 = require("../../../store");
const FormattedDateTime_1 = require("../../FormattedDateTime");
const SuggestionSnippet = ({ suggestion }) => {
    const [project] = store_1.useStore((store) => store.project);
    const [collaboratorsById] = store_1.useStore((store) => store.collaboratorsById || new Map());
    const { dataTracked } = suggestion;
    const userID = dataTracked.status === track_changes_plugin_1.CHANGE_STATUS.pending
        ? dataTracked.authorID
        : dataTracked.reviewedByID;
    const userProfile = collaboratorsById.get(userID);
    const timestamp = dataTracked.updatedAt / 1000;
    const changeTitle = (c) => {
        if (track_changes_plugin_1.ChangeSet.isTextChange(c)) {
            return c.text;
        }
        else if (track_changes_plugin_1.ChangeSet.isNodeChange(c)) {
            return `${c.nodeType.charAt(0).toUpperCase()}${c.nodeType.slice(1)} ${c.dataTracked.operation}`;
        }
        else if (track_changes_plugin_1.ChangeSet.isNodeAttrChange(c)) {
            return `${c.nodeType.charAt(0).toUpperCase()}${c.nodeType.slice(1)} ${c.dataTracked.operation}`;
        }
        return 'Unknown change!';
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(SnippetText, { isRejected: dataTracked.status === track_changes_plugin_1.CHANGE_STATUS.rejected }, dataTracked.operation === track_changes_plugin_1.CHANGE_OPERATION.delete ? (react_1.default.createElement("del", null, changeTitle(suggestion))) : (changeTitle(suggestion))),
        userProfile ? (react_1.default.createElement(exports.AvatarContainer, { key: suggestion.id },
            react_1.default.createElement("div", { "data-tip": true, "data-for": suggestion.id },
                react_1.default.createElement(style_guide_1.Avatar, { size: 22 })),
            react_1.default.createElement(react_tooltip_1.default, { id: suggestion.id, place: "bottom", effect: "solid", offset: { top: 4 }, className: "tooltip" },
                react_1.default.createElement(TooltipHeader, null, dataTracked.status === track_changes_plugin_1.CHANGE_STATUS.pending
                    ? 'Created by'
                    : dataTracked.status === track_changes_plugin_1.CHANGE_STATUS.accepted
                        ? 'Approved by'
                        : 'Rejected by'),
                react_1.default.createElement(Name, null, userProfile.bibliographicName.given +
                    ' ' +
                    userProfile.bibliographicName.family),
                roles_1.getUserRole(project, userProfile.userID),
                react_1.default.createElement(DateTime, null,
                    FormattedDateTime_1.FormattedDateTime({
                        date: timestamp,
                        options: { year: 'numeric', month: 'numeric', day: 'numeric' },
                    }),
                    ",",
                    ' ',
                    FormattedDateTime_1.FormattedDateTime({
                        date: timestamp,
                        options: { hour: 'numeric', minute: 'numeric' },
                    }))))) : null,
        react_1.default.createElement(exports.Time, null,
            ' ',
            FormattedDateTime_1.FormattedDateTime({
                date: timestamp,
                options: { hour: 'numeric', minute: 'numeric' },
            }))));
};
exports.SuggestionSnippet = SuggestionSnippet;
const Text = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.normal};
`;
const SnippetText = styled_components_1.default(Text) `
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: ${(props) => props.theme.grid.unit}px;
  color: ${(props) => props.theme.colors.text.primary};
  opacity: ${(props) => (props.isRejected ? 0.5 : 1)};
`;
const TooltipHeader = styled_components_1.default(Text) `
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
`;
const Name = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.normal};
  line-height: ${(props) => props.theme.font.lineHeight.normal};
  font-weight: 700;
`;
const DateTime = styled_components_1.default(Text) `
  font-weight: 700;
  margin-top: ${(props) => props.theme.grid.unit * 2}px;
`;
exports.AvatarContainer = styled_components_1.default.div `
  margin-right: ${(props) => props.theme.grid.unit}px;
  position: relative;
  visibility: hidden;
  .tooltip {
    border-radius: 6px;
    padding: ${(props) => props.theme.grid.unit * 4}px;
  }

  & img {
    border: 1px solid transparent;
  }

  &:hover {
    & img {
      border: 1px solid #bce7f6;
    }
  }
`;
exports.Time = styled_components_1.default.span `
  visibility: hidden;
`;
//# sourceMappingURL=SuggestionSnippet.js.map