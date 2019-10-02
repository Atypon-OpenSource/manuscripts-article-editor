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

import { Theme } from '@manuscripts/style-guide'
import * as colors from './colors'
import { createGlobalStyle } from './styled-components'

const fontFamily = '"Lato", sans-serif'

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.colors.background.primary};
    color: ${props => props.theme.colors.text.primary};
    font-family: ${props => props.theme.font.family.sans};
    margin: 0;
  }
`

export const theme: Theme = {
  name: 'Manuscripts',
  colors: {
    background: {
      primary: colors.white,
      secondary: colors.seashellGrey,
      tertiary: colors.alabasterGrey,
      fifth: colors.blue,
      dark: 'rgba(0,0,0,0.5)',
      error: colors.chablisRed,
      info: colors.powderBlue,
      success: colors.peppermintGreen,
      warning: colors.butteryYellow,
    },
    border: {
      error: colors.mandysRed,
      info: colors.manuscriptsBlue,
      success: colors.springGreen,
      warning: colors.wheatYellow,
      primary: colors.dustyGrey,
      secondary: colors.mercuryGrey,
      tertiary: 'rgba(0, 0, 0, 0.1)',
      field: {
        active: colors.manuscriptsBlue,
        default: colors.warmGrey,
        hover: colors.manuscriptsBlue,
      },
    },
    brand: {
      dark: colors.jellyBeanBlue,
      medium: colors.manuscriptsBlueDark,
      default: colors.manuscriptsBlue,
      light: colors.iceBlue,
      xlight: colors.linkWaterBlue,
      secondary: colors.manuscriptsYellow,
    },
    button: {
      default: {
        background: {
          active: 'transparent',
          default: 'transparent',
          hover: colors.seashellGrey,
        },
        border: {
          active: 'transparent',
          default: 'transparent',
          hover: colors.seashellGrey,
        },
        color: {
          active: colors.manuscriptsBlue,
          default: colors.manuscriptsGrey,
          hover: colors.manuscriptsGrey,
        },
      },
      primary: {
        background: {
          active: colors.manuscriptsBlueDark,
          default: colors.manuscriptsBlue,
          hover: 'transparent',
        },
        border: {
          active: colors.manuscriptsBlueDark,
          default: colors.manuscriptsBlue,
          hover: colors.manuscriptsBlueDark,
        },
        color: {
          active: colors.white,
          default: colors.white,
          hover: colors.manuscriptsBlueDark,
        },
      },
      secondary: {
        background: {
          active: 'transparent',
          default: 'transparent',
          hover: 'transparent',
        },
        border: {
          active: colors.mercuryGrey,
          default: colors.mercuryGrey,
          hover: colors.mercuryGrey,
        },
        color: {
          active: colors.manuscriptsBlue,
          default: colors.manuscriptsGrey,
          hover: colors.manuscriptsBlue,
        },
      },
      error: {
        background: {
          active: colors.punchRed,
          default: colors.punchRed,
          hover: 'transparent',
        },
        border: {
          active: colors.punchRed,
          default: colors.punchRed,
          hover: colors.punchRed,
        },
        color: {
          active: colors.white,
          default: colors.white,
          hover: colors.punchRed,
        },
      },
    },
    text: {
      primary: colors.manuscriptsGrey,
      secondary: colors.dustyGrey,
      tertiary: colors.scorpionGrey,
      muted: colors.altoGrey,
      onDark: colors.white,
      onLight: colors.manuscriptsGrey,
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
}
