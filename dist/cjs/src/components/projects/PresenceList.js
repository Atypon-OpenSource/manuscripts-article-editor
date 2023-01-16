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
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceListView = exports.PresenceList = void 0;
const react_hooks_1 = require("@apollo/react-hooks");
const style_guide_1 = require("@manuscripts/style-guide");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const user_1 = require("../../lib/user");
const ACTIVITY_UPDATES = graphql_tag_1.default `
  subscription activityUpdates($containerId: String!) {
    activityUpdates(containerId: $containerId) {
      userId
      containerId
      idle
      location {
        path
        leaf
        root
        endPos
        startPos
      }
    }
  }
`;
exports.PresenceList = react_1.default.memo(({ containerId, getCollaborator }) => {
    const [users, setUsers] = react_1.useState();
    const { data, loading, error } = react_hooks_1.useSubscription(ACTIVITY_UPDATES, {
        variables: { containerId },
    });
    react_1.useEffect(() => {
        if (data && data.activityUpdates) {
            const users = [];
            for (const presence of data.activityUpdates) {
                const profile = getCollaborator(convertUserID(presence.userId));
                if (profile) {
                    users.push({ profile, presence });
                }
            }
            setUsers(users);
        }
    }, [data, getCollaborator]);
    if (loading) {
        return null;
    }
    if (error) {
        return null;
    } // TODO
    if (!users) {
        return null;
    }
    return react_1.default.createElement(exports.PresenceListView, { users: users });
});
const convertUserID = (userID) => userID.replace('|', '_');
const profileName = (profile) => {
    const { given, family } = profile.bibliographicName;
    return [given, family].join(' ').trim();
};
const sortFalseFirst = (a, b) => (a === b ? 0 : a ? -1 : 1);
const sortStringAscending = (a, b) => {
    return a === b ? 0 : a > b ? -1 : 1;
};
// TODO: sort current user first?
const sortUsers = (a, b) => {
    return (sortFalseFirst(a.presence.idle, b.presence.idle) ||
        sortStringAscending(String(a.profile.bibliographicName.given), String(b.profile.bibliographicName.given)) ||
        sortStringAscending(String(a.profile.bibliographicName.family), String(b.profile.bibliographicName.family)));
};
const tipTitle = (user) => {
    let output = profileName(user.profile);
    if (user.presence.idle) {
        output += ' - Idle';
    }
    return output;
};
exports.PresenceListView = react_1.default.memo(({ users }) => {
    return (react_1.default.createElement(AvatarStack, null, users.sort(sortUsers).map((user) => (react_1.default.createElement(AvatarContainer, { key: user.profile._id, style: {
            filter: user.presence.idle ? 'grayscale(100%)' : 'none',
        } },
        react_1.default.createElement(style_guide_1.Tip, { placement: 'bottom', title: tipTitle(user) },
            react_1.default.createElement(style_guide_1.Avatar, { src: user.profile.avatar || user_1.avatarURL(user.profile), size: 22 })))))));
});
const AvatarStack = styled_components_1.default.div `
  display: flex;
  line-height: 1;
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
`;
const AvatarContainer = styled_components_1.default.div `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: -${(props) => props.theme.grid.unit * 2}px;
  background: ${(props) => props.theme.colors.background.primary};
  border-radius: 50%;
  border: 2px solid ${(props) => props.theme.colors.background.primary};
  box-sizing: border-box;
  z-index: 1;

  &:hover {
    z-index: 2;
  }
`;
//# sourceMappingURL=PresenceList.js.map