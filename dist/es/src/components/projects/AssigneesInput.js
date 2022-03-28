"use strict";
/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */
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
exports.AssigneesInput = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const react_select_1 = __importStar(require("react-select"));
const react_tooltip_1 = __importDefault(require("react-tooltip"));
const styled_components_1 = __importDefault(require("styled-components"));
const avatar_url_1 = require("../../lib/avatar-url");
const select_styles_1 = require("../../lib/select-styles");
const store_1 = require("../../store");
const StatusIcons_1 = require("./Status/StatusIcons");
const Name = styled_components_1.default.div `
  padding-left: ${(props) => props.theme.grid.unit}px;
`;
const AvatarContainer = styled_components_1.default.div `
  margin-right: ${(props) => props.theme.grid.unit}px;
  position: relative;

  .tooltip {
    border-radius: 6px;
  }

  & img {
    border: 1px solid transparent;
  }

  &:hover {
    & img {
      border: 1px solid #bce7f6;
    }

    .remove {
      cursor: pointer;

      svg {
        fill: #6e6e6e;
      }
    }
  }
`;
const Avatars = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
`;
const Button = styled_components_1.default.button `
  border: none;
  background: none;
  cursor: pointer;

  .tooltip {
    border-radius: 6px;
  }

  &:focus {
    outline: none;
  }
`;
const RemoveContainer = styled_components_1.default.div `
  position: absolute;
  top: -2px;
  right: -2px;
  height: 10px;
  width: 10px;
  display: flex !important;
  align-items: center;
  justify-content: center;

  svg {
    fill: none;
  }
`;
const MultiValueLabel = (props) => {
    return (react_1.default.createElement(react_select_1.components.MultiValueLabel, Object.assign({}, props),
        react_1.default.createElement(style_guide_1.Avatar, { src: avatar_url_1.avatarURL(props.data), size: 22 }),
        react_1.default.createElement(Name, null, props.data.bibliographicName.given +
            ' ' +
            props.data.bibliographicName.family)));
};
const AssigneesInput = ({ profiles, target }) => {
    const userIDs = target.assignees || [];
    const [saveModel] = store_1.useStore((store) => store.saveModel);
    const assignees = profiles.filter((profile) => userIDs.includes(profile._id));
    const [opened, setOpened] = react_1.useState(false);
    return !opened ? (react_1.default.createElement(react_1.default.Fragment, null,
        assignees.length !== 0 && (react_1.default.createElement(Avatars, null, assignees.map((user) => (react_1.default.createElement(AvatarContainer, { key: user._id },
            react_1.default.createElement("div", { "data-tip": true, "data-for": user._id },
                react_1.default.createElement(style_guide_1.Avatar, { src: avatar_url_1.avatarURL(user), size: 22 })),
            react_1.default.createElement(react_tooltip_1.default, { id: user._id, place: "bottom", effect: "solid", offset: { top: 4 }, className: "tooltip" }, user.bibliographicName.given +
                ' ' +
                user.bibliographicName.family),
            react_1.default.createElement(RemoveContainer, { onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                    return yield saveModel(Object.assign(Object.assign({}, target), { assignees: target.assignees.filter((assignee) => assignee !== user._id) }));
                }), className: "remove" },
                react_1.default.createElement(StatusIcons_1.CloseIcon, null),
                ' ')))))),
        react_1.default.createElement(Button, { onClick: () => setOpened(!opened) },
            react_1.default.createElement("div", { "data-tip": true, "data-for": "addAssigneeTip" },
                react_1.default.createElement(StatusIcons_1.PlusIcon, null)),
            react_1.default.createElement(react_tooltip_1.default, { id: "addAssigneeTip", place: "bottom", effect: "solid", offset: { top: 4 }, className: "tooltip" }, "Add or remove assignees")))) : (react_1.default.createElement(react_select_1.default, { options: profiles, value: assignees, getOptionValue: (option) => option._id, getOptionLabel: (option) => option.bibliographicName.given + ' ' + option.bibliographicName.family, onChange: (users) => __awaiter(void 0, void 0, void 0, function* () {
            yield saveModel(Object.assign(Object.assign({}, target), { assignees: users ? users.map((user) => user._id) : [] }));
        }), styles: Object.assign(Object.assign({}, select_styles_1.selectStyles), { multiValueLabel: () => ({
                backgroundColor: 'none',
                color: 'black',
                paddingRight: 2,
                alignItems: 'center',
                display: 'flex',
                wordBreak: 'break-word',
            }), multiValue: (base) => (Object.assign(Object.assign({}, base), { backgroundColor: 'none', color: 'black', alignItems: 'center', paddingRight: 4 })), multiValueRemove: () => ({
                backgroundColor: '#6e6e6e',
                color: '#fff',
                borderRadius: '50%',
                height: 14,
                width: 14,
                cursor: 'pointer',
            }), option: (base, state) => (Object.assign(Object.assign({}, base), { backgroundColor: state.isFocused ? '#F2FBFC' : 'transparent', '&:hover': {
                    backgroundColor: '#F2FBFC',
                } })) }), menuPortalTarget: document.body, onBlur: () => setOpened(!opened), autoFocus: true, noOptionsMessage: () => null, components: { MultiValueLabel } }));
};
exports.AssigneesInput = AssigneesInput;
//# sourceMappingURL=AssigneesInput.js.map