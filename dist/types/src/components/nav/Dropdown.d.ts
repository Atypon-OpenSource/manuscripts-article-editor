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
import { Title } from '@manuscripts/title-editor';
import React from 'react';
import { NavLink } from 'react-router-dom';
export declare const DropdownContainer: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const Dropdown: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {
    direction?: "left" | "right" | undefined;
    minWidth?: number | undefined;
    top?: number | undefined;
}, never>;
export declare const PlaceholderTitle: import("styled-components").StyledComponent<typeof Title, import("styled-components").DefaultTheme, {}, never>;
export declare const InvitedBy: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const DropdownLink: import("styled-components").StyledComponent<typeof NavLink, import("styled-components").DefaultTheme, {
    disabled?: boolean | undefined;
}, never>;
export declare const DropdownElement: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {
    disabled?: boolean | undefined;
}, never>;
export declare const DropdownSeparator: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
export declare const DropdownButtonText: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, {}, never>;
interface DropdownProps {
    isOpen: boolean;
}
export declare const DropdownToggle: import("styled-components").StyledComponent<React.SFC<React.SVGAttributes<SVGElement>>, import("styled-components").DefaultTheme, {}, never>;
export declare const NotificationsBadge: import("styled-components").StyledComponent<"div", import("styled-components").DefaultTheme, DropdownProps, never>;
export declare const DropdownButtonContainer: import("styled-components").StyledComponent<"button", import("styled-components").DefaultTheme, {
    type: "button" | "submit" | "reset";
} & {
    danger?: boolean | undefined;
    disabled?: boolean | undefined;
    mini?: boolean | undefined;
} & {
    selected: boolean;
} & DropdownProps, "type" | "selected">;
interface DropdownButtonProps {
    as?: React.FunctionComponent<any>;
    disabled?: boolean;
    isOpen: boolean;
    notificationsCount?: number;
    onClick?: React.MouseEventHandler;
    removeChevron?: boolean;
}
export declare const DropdownButton: React.FunctionComponent<DropdownButtonProps>;
export {};
