/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as colors from './colors'
import { createGlobalStyle } from './styled-components'
import { Theme } from './types'

const fontFamily =
  '"Barlow", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: ${fontFamily};
  }
`

export const theme: Theme = {
  colors: {
    global: {
      background: {
        default: colors.white,
        error: colors.chablisRed,
      },
      text: {
        primary: colors.manuscriptsGrey,
        secondary: colors.dustyGrey,
        link: colors.manuscriptsBlue,
        error: colors.darkCoral,
      },
    },
    button: {
      primary: colors.manuscriptsBlue,
      secondary: colors.dustyGrey,
      danger: colors.punchRed,
    },
    sidebar: {
      background: {
        default: colors.aliceBlue,
        selected: colors.powderBlue,
      },
      text: {
        primary: colors.manuscriptsGrey,
        secondary: colors.dustyGrey,
        link: colors.manuscriptsBlue,
      },
      dropLine: colors.mayaBlue,
      label: colors.manuscriptsBlue,
      border: colors.dustyGrey,
    },
    menu: {
      text: colors.dustyGrey,
      icon: {
        default: colors.manuscriptsBlue,
        selected: colors.jellyBeanBlue,
      },
      button: colors.manuscriptsBlue,
    },
    popper: {
      background: colors.white,
      text: {
        primary: colors.manuscriptsGrey,
        secondary: colors.dustyGrey,
      },
      separator: colors.mercuryGrey,
      border: colors.lightGrey,
    },
    dropdown: {
      background: {
        default: colors.white,
        hovered: colors.manuscriptsBlue,
      },
      separator: colors.dustyGrey,
      text: {
        primary: colors.manuscriptsGrey,
        secondary: colors.dustyGrey,
        hovered: colors.white,
      },
      button: {
        primary: colors.manuscriptsBlue,
        secondary: colors.dustyGrey,
      },
      notification: {
        default: colors.deYorkGreen,
        hovered: colors.white,
      },
      border: colors.lightGrey,
    },
    iconBar: {
      background: {
        default: colors.manuscriptsBlue,
        selected: colors.white,
      },
    },
    textField: {
      placeholder: {
        default: '#aaa',
        hovered: '#777',
      },
      border: {
        default: '#aaa',
        error: '#d47666',
      },
    },
    title: {
      placeholder: colors.dustyGrey,
      background: {
        hovered: colors.powderBlue,
      },
      border: {
        default: 'transparent',
        hovered: colors.manuscriptsBlue,
      },
    },
    radioButton: {
      enabled: {
        checked: colors.manuscriptsBlue,
        unchecked: colors.white,
        hovered: colors.powderBlue,
      },
      disabled: {
        checked: colors.dustyGrey,
        unchecked: colors.mercuryGrey,
      },
      hint: colors.dustyGrey,
      border: colors.dustyGrey,
    },
    dialog: {
      text: colors.dustyGrey,
      background: colors.white,
      icon: colors.butteryYellow,
      shadow: colors.altoGrey,
    },
    modal: {
      overlay: colors.aquaHaze,
      border: colors.lightGrey,
      shadow: colors.altoGrey,
      background: colors.white,
    },
    icon: {
      primary: colors.manuscriptsBlue,
    },
    label: {
      primary: colors.lightBlue,
      success: colors.deYorkGreen,
      text: colors.manuscriptsGrey,
    },
    alertMessage: {
      success: {
        background: colors.peppermintGreen,
        text: colors.killarneyGreen,
        border: colors.springGreen,
        dismiss: colors.springGreen,
      },
      error: {
        background: colors.chablisRed,
        text: colors.punchRed,
        border: colors.mandysRed,
        dismiss: colors.mandysRed,
      },
      info: {
        background: colors.powderBlue,
        text: colors.jellyBeanBlue,
        border: colors.manuscriptsBlue,
        dismiss: colors.towerGrey,
      },
      warning: {
        background: colors.butteryYellow,
        text: colors.zestOrange,
        border: colors.wheatYellow,
        dismiss: colors.wheatYellow,
      },
    },
    comment: {
      date: colors.dustyGrey,
      border: {
        default: colors.aquaHaze,
        selected: colors.salomieYellow,
      },
    },
    profile: {
      avatar: colors.darkGrey, // dustyGrey
      date: colors.dustyGrey,
    },
    acceptInvitation: {
      icon: colors.butteryYellow,
    },
    metadata: {
      border: colors.mercuryGrey,
    },
    updates: {
      back: colors.darkGrey,
    },
    invitation: {
      background: {
        hovered: colors.aliceBlue,
      },
      border: {
        hovered: colors.aquaHaze,
      },
    },
    authors: {
      add: {
        hovered: colors.salomieYellow,
      },
      searchIcon: colors.manuscriptsBlue,
    },
    projects: {
      background: {
        hovered: colors.aliceBlue,
      },
      border: {
        hovered: colors.aquaHaze,
      },
    },
    reload: {
      icon: colors.butteryYellow,
    },
    shareURI: {
      textField: {
        border: colors.altoGrey,
      },
      button: {
        border: colors.altoGrey,
      },
    },
    citationSearch: {
      status: {
        fill: {
          default: 'transparent',
          selected: colors.manuscriptsBlue,
        },
      },
      placeholder: colors.altoGrey,
      more: colors.manuscriptsBlue,
    },
    authorName: {
      default: colors.manuscriptsGrey,
      placeholder: colors.dustyGrey,
    },
    templateSelector: {
      item: {
        actions: {
          background: colors.aliceBlue,
        },
        container: {
          background: {
            default: 'transparent',
            selected: colors.aliceBlue,
            hovered: colors.aliceBlue,
          },
        },
      },
      search: {
        icon: {
          searching: colors.powderBlue,
        },
      },
      topicsList: {
        border: colors.lightGrey,
        background: colors.white,
        text: colors.manuscriptsGrey,
        hovered: colors.aliceBlue,
        separator: colors.dustyGrey,
      },
    },
    collaborators: {
      actionButton: colors.salomieYellow,
      addButton: colors.salomieYellow,
      searchIcon: colors.powderBlue,
    },
    editor: {
      placeholder: {
        default: '#bbb',
        hovered: colors.dustyGrey,
      },
    },
  },
  fontFamily,
  radius: 8,
  spacing: 4,
}
