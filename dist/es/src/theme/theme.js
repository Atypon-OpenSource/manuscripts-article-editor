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
Object.defineProperty(exports, "__esModule", { value: true });
exports.theme = exports.GlobalStyle = void 0;
const styled_components_1 = require("styled-components");
const colors = __importStar(require("./colors"));
const fontFamily = '"Lato", sans-serif';
exports.GlobalStyle = styled_components_1.createGlobalStyle `
  body {
    background-color: ${(props) => props.theme.colors.background.primary};
    color: ${(props) => props.theme.colors.text.primary};
    font-family: ${(props) => props.theme.font.family.sans};
    margin: 0;
    overflow-x: hidden;
  }
`;
exports.theme = {
    name: 'Manuscripts',
    colors: {
        background: {
            primary: colors.white,
            secondary: colors.alabasterGrey,
            tertiary: colors.mercuryGrey,
            fifth: colors.manuscriptsXLight2,
            dark: 'rgba(0,0,0,0.5)',
            error: colors.chablisRed,
            info: colors.manuscriptsXLight2,
            success: colors.peppermintGreen,
            warning: colors.butteryYellow,
            selected: colors.aliceBlue,
        },
        border: {
            error: colors.mandysRed,
            info: colors.manuscriptsBlue,
            success: colors.springGreen,
            warning: colors.wheatYellow,
            primary: colors.manuscriptsLight,
            secondary: colors.mercuryGrey,
            tertiary: colors.seashellGrey,
            field: {
                active: colors.manuscriptsLight,
                default: colors.mercuryGrey,
                hover: colors.manuscriptsLight,
            },
        },
        brand: {
            dark: colors.manuscriptsBlueDark,
            medium: colors.manuscriptsIcons,
            default: colors.manuscriptsBlue,
            light: colors.manuscriptsLight,
            xlight: colors.manuscriptsXLight,
            secondary: colors.manuscriptsSecondary,
        },
        button: {
            default: {
                background: {
                    active: 'transparent',
                    default: 'transparent',
                    hover: colors.manuscriptsXLight2,
                },
                border: {
                    active: 'transparent',
                    default: 'transparent',
                    hover: colors.manuscriptsXLight2,
                },
                color: {
                    active: colors.manuscriptsBlue,
                    default: colors.manuscriptsBlue,
                    hover: colors.manuscriptsBlue,
                },
            },
            primary: {
                background: {
                    active: colors.manuscriptsBlueDark,
                    default: colors.manuscriptsBlue,
                    hover: colors.manuscriptsBlueDark,
                },
                border: {
                    active: colors.manuscriptsBlueDark,
                    default: colors.manuscriptsBlue,
                    hover: colors.manuscriptsBlueDark,
                },
                color: {
                    active: colors.white,
                    default: colors.white,
                    hover: colors.white,
                },
            },
            secondary: {
                background: {
                    active: colors.white,
                    default: colors.white,
                    hover: colors.white,
                },
                border: {
                    active: colors.mercuryGrey,
                    default: colors.mercuryGrey,
                    hover: colors.mercuryGrey,
                },
                color: {
                    active: colors.manuscriptsBlue,
                    default: colors.greyDark,
                    hover: colors.manuscriptsBlue,
                },
            },
            error: {
                background: {
                    active: colors.punchRed,
                    default: colors.punchRed,
                    hover: colors.darkRed,
                },
                border: {
                    active: colors.punchRed,
                    default: colors.punchRed,
                    hover: colors.darkRed,
                },
                color: {
                    active: colors.white,
                    default: colors.white,
                    hover: colors.white,
                },
            },
        },
        text: {
            primary: colors.greyDark,
            secondary: colors.greyMuted,
            tertiary: colors.manuscriptsBlue,
            muted: colors.mercuryGrey,
            onDark: colors.white,
            onLight: colors.greyMuted,
            error: colors.punchRed,
            info: colors.jellyBeanBlue,
            success: colors.killarneyGreen,
            warning: colors.zestOrange,
        },
    },
    font: {
        family: {
            sans: fontFamily,
            serif: 'serif',
            // TODO:: this need to be removed, for the next style-guide version
            Lato: '"Lato"',
        },
        size: {
            xlarge: '20px',
            large: '18px',
            medium: '16px',
            normal: '14px',
            small: '12px',
        },
        lineHeight: {
            large: '24px',
            normal: '16px',
            small: '14px',
        },
        weight: {
            xbold: 900,
            bold: 700,
            semibold: 600,
            medium: 500,
            normal: 400,
            light: 300,
            xlight: 200,
        },
    },
    grid: {
        radius: {
            default: '8px',
            small: '4px',
            rounder: '16px',
        },
        unit: 4,
        mobile: 360,
        tablet: 768,
        smallDesktop: 1024,
        desktop: 1280,
        largeDesktop: 1920,
    },
    shadow: {
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.05)',
        dropShadow: '0 4px 9px 0 rgba(84, 83, 83, 0.3)',
    },
};
//# sourceMappingURL=theme.js.map