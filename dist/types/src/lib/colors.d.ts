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
import { Color, ColorScheme, Model } from '@manuscripts/manuscripts-json-schema';
import { SaveModel } from '../components/inspector/StyleFields';
export declare const DEFAULT_COLOR_SCHEME = "MPColorScheme:default";
export declare const isColor: (model: Model) => model is Color;
export declare const isColorScheme: (model: Model) => model is ColorScheme;
export declare const nextColorPriority: (colors: Color[]) => number;
export declare const buildColors: (modelMap: Map<string, Model>, colorSchemeID?: string) => {
    colors: Color[];
    colorScheme: ColorScheme | undefined;
};
export declare const addColor: (colors: Color[], saveModel: SaveModel, colorScheme?: ColorScheme | undefined) => (hex: string) => Promise<Color>;
