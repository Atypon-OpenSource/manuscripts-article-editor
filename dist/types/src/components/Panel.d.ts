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
import { ResizerDirection, ResizerSide } from '@manuscripts/resizer';
import React from 'react';
export interface ResizerButtonInnerProps {
    isCollapsed: boolean;
    isVisible: boolean;
}
export declare const ResizerButton: import("styled-components").StyledComponent<"button", import("styled-components").DefaultTheme, {
    type: "button" | "submit" | "reset";
} & {
    danger?: boolean | undefined;
    disabled?: boolean | undefined;
    mini?: boolean | undefined;
} & {
    defaultColor?: boolean | undefined;
    size?: number | undefined;
    iconColor?: string | undefined;
} & {
    defaultColor: boolean;
} & ResizerButtonInnerProps, "type" | "defaultColor">;
interface PanelProps {
    name: string;
    minSize?: number;
    direction: ResizerDirection;
    side: ResizerSide;
    hideWhen?: string;
    forceOpen?: boolean;
    resizerButton?: React.ComponentType<ResizerButtonInnerProps>;
}
interface PanelState {
    originalSize: number | null;
    size: number | null;
    collapsed: boolean;
    hidden: boolean;
}
declare class Panel extends React.Component<PanelProps, PanelState> {
    state: PanelState;
    private hideWhenQuery?;
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: PanelProps): void;
    componentWillUnmount(): void;
    render(): JSX.Element | null;
    private buildStyle;
    private handleHideWhenChange;
    private handleResize;
    private handleResizeEnd;
    private handleResizeButton;
    private updateState;
}
export default Panel;
