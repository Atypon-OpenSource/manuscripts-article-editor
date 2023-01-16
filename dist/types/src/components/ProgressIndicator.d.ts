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
import React from 'react';
export declare enum IndicatorKind {
    Author = 0,
    ContributorDetail = 1,
    Contributors = 2,
    Project = 3,
    ReferenceLibrary = 4
}
export declare enum IndicatorSize {
    Medium = 0,
    Large = 1
}
export declare const indicatorSizeDimensionsMap: Map<IndicatorSize | undefined, number>;
export interface BaseIndicatorProps {
    readonly isDeterminate?: boolean;
    readonly timeIncrement?: number;
    readonly refreshRate?: number;
    readonly symbolRotationMultiplier?: number;
    readonly crossRotationMultiplier?: number;
    readonly symbols?: IndicatorKind;
}
export interface DeterminateIndicatorProps {
    readonly progress?: number;
}
export interface SizedIndicatorProps {
    readonly size?: IndicatorSize;
}
export declare type IndicatorProps = BaseIndicatorProps & DeterminateIndicatorProps & SizedIndicatorProps;
export interface IndicatorState {
    time: number;
}
export declare class InvalidIndicatorPropsError extends Error {
    readonly props: IndicatorProps;
    constructor(message: string, props: IndicatorProps);
}
export declare class ProgressIndicator extends React.Component<IndicatorProps, IndicatorState> {
    static defaultProps: {
        progress: number;
        size: IndicatorSize;
        isDeterminate: boolean;
        timeIncrement: number;
        symbolRotationMultiplier: number;
        crossRotationMultiplier: number;
        refreshRate: number;
    };
    state: Readonly<IndicatorState>;
    private readonly canvasRef;
    private tickHandle;
    constructor(props: IndicatorProps);
    componentDidMount(): void;
    componentDidUpdate(): void;
    updateCanvas(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private tickFunction;
    private symbolDrawFunction;
}
