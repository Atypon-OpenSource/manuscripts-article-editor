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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareInvitationsRoles = exports.buildInvitations = exports.findLeastLimitingInvitation = exports.groupInvitations = exports.buildContainerInvitations = void 0;
const buildContainerInvitations = (invitations) => {
    const containerInvitations = [];
    for (const invitation of invitations) {
        const { projectID, objectType, projectTitle } = invitation, data = __rest(invitation, ["projectID", "objectType", "projectTitle"]);
        containerInvitations.push(Object.assign({ containerID: projectID, containerTitle: projectTitle, objectType: 'MPContainerInvitation' }, data));
    }
    return containerInvitations;
};
exports.buildContainerInvitations = buildContainerInvitations;
const groupInvitations = (invitations, groupBy) => {
    const groupedInvitations = {};
    invitations.forEach((invitation) => {
        const key = groupBy === 'Container'
            ? invitation.containerID
            : invitation.invitedUserEmail;
        if (!groupedInvitations[key]) {
            groupedInvitations[key] = [];
        }
        groupedInvitations[key].push(invitation);
    });
    return groupedInvitations;
};
exports.groupInvitations = groupInvitations;
const findLeastLimitingInvitation = (invitations) => {
    invitations.sort(exports.compareInvitationsRoles);
    return invitations[invitations.length - 1];
};
exports.findLeastLimitingInvitation = findLeastLimitingInvitation;
const buildInvitations = (invitations, containerInvitations) => {
    const allInvitations = [
        ...exports.buildContainerInvitations(invitations),
        ...containerInvitations,
    ].filter((invitation) => invitation.containerID.startsWith('MPProject'));
    const invitationsByInvitedUser = exports.groupInvitations(allInvitations, 'User');
    const leastLimitingInvitations = [];
    for (const invitations of Object.values(invitationsByInvitedUser)) {
        leastLimitingInvitations.push(exports.findLeastLimitingInvitation(invitations));
    }
    return leastLimitingInvitations;
};
exports.buildInvitations = buildInvitations;
const compareInvitationsRoles = (a, b) => rolePriority[a.role] - rolePriority[b.role];
exports.compareInvitationsRoles = compareInvitationsRoles;
const rolePriority = {
    Owner: 2,
    Writer: 1,
    Viewer: 0,
};
//# sourceMappingURL=invitation.js.map