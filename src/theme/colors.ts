import { Palette } from './types'

const white = '#fff'
// const black = '#000'

// greys
const manuscriptsGrey = '#353535'
const dustyGrey = '#949494'
const altoGrey = '#d8d8d8'
const mercuryGrey = '#e2e2e2'
// const seashellGrey = '#f1f1f1'
const darkGrey = '#585858'
const lightGrey = '#d6d6d6'
const towerGrey = '#adbec6'

// blues
const jellyBeanBlue = '#2a6f9d'
const manuscriptsBlue = '#7fb5d5'
// const linkWaterBlue = '#d9e0f3'
// const iceBlue = '#d8edf8'
const powderBlue = '#e0eef9'
const aliceBlue = '#f1f8ff'
const lightBlue = '#e2e8ee'
const mayaBlue = '#65a3ff'
const aquaHaze = '#edf2f5'

// reds
const punchRed = '#dc5030'
// const sungloRed = '#e26969'
// const eunryRed = '#d2a1a1'
const mandysRed = '#f5c1b7'
const chablisRed = '#fff1f0'
const darkCoral = '#cd593c'

// oranges
const zestOrange = '#e28327'
const wheatYellow = '#f7d7b2'
const butteryYellow = '#fffceb'

// yellows
// const brightSunYellow = '#fdcd47'
// const huskYellow = '#b6a651'
const salomieYellow = '#ffe08b'

// greens
const killarneyGreen = '#3a773a'
const deYorkGreen = '#80be86'
// const pineGladeGreen = '#a8cd95'
const springGreen = '#b2c0ac'
const peppermintGreen = '#dff0d7'

export const colors: Palette = {
  global: {
    background: {
      default: white,
      error: chablisRed,
    },
    text: {
      primary: manuscriptsGrey,
      secondary: dustyGrey,
      link: manuscriptsBlue,
      error: darkCoral,
    },
  },
  button: {
    primary: manuscriptsBlue,
    secondary: dustyGrey,
    danger: punchRed,
  },
  sidebar: {
    background: {
      default: aliceBlue,
      selected: powderBlue,
    },
    text: {
      primary: manuscriptsGrey,
      secondary: dustyGrey,
      link: manuscriptsBlue,
    },
    dropLine: mayaBlue,
    label: manuscriptsBlue,
    border: dustyGrey,
  },
  menu: {
    text: dustyGrey,
    icon: {
      default: manuscriptsBlue,
      selected: jellyBeanBlue,
    },
    button: manuscriptsBlue,
  },
  popper: {
    background: white,
    text: {
      primary: manuscriptsGrey,
      secondary: dustyGrey,
    },
    separator: mercuryGrey,
    border: lightGrey,
  },
  dropdown: {
    background: {
      default: white,
      hovered: manuscriptsBlue,
    },
    separator: dustyGrey,
    text: {
      primary: manuscriptsGrey,
      secondary: dustyGrey,
      hovered: white,
    },
    button: {
      primary: manuscriptsBlue,
      secondary: dustyGrey,
    },
    notification: {
      default: deYorkGreen,
      hovered: white,
    },
    border: lightGrey,
  },
  iconBar: {
    background: {
      default: manuscriptsBlue,
      selected: white,
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
    placeholder: dustyGrey,
    background: {
      hovered: powderBlue,
    },
    border: {
      default: 'transparent',
      hovered: manuscriptsBlue,
    },
  },
  radioButton: {
    enabled: {
      checked: manuscriptsBlue,
      unchecked: white,
      hovered: powderBlue,
    },
    disabled: {
      checked: dustyGrey,
      unchecked: mercuryGrey,
    },
    hint: dustyGrey,
    border: dustyGrey,
  },
  dialog: {
    text: dustyGrey,
    background: white,
    icon: butteryYellow,
    shadow: altoGrey,
  },
  modal: {
    overlay: aquaHaze,
    border: lightGrey,
    shadow: altoGrey,
  },
  icon: {
    primary: manuscriptsBlue,
  },
  label: {
    primary: lightBlue,
    success: deYorkGreen,
    text: manuscriptsGrey,
  },
  alertMessage: {
    success: {
      background: peppermintGreen,
      text: killarneyGreen,
      border: springGreen,
      dismiss: springGreen,
    },
    error: {
      background: chablisRed,
      text: punchRed,
      border: mandysRed,
      dismiss: mandysRed,
    },
    info: {
      background: powderBlue,
      text: jellyBeanBlue,
      border: manuscriptsBlue,
      dismiss: towerGrey,
    },
    warning: {
      background: butteryYellow,
      text: zestOrange,
      border: wheatYellow,
      dismiss: wheatYellow,
    },
  },
  comment: {
    date: dustyGrey,
    border: {
      default: aquaHaze,
      selected: salomieYellow,
    },
  },
  profile: {
    avatar: darkGrey, // dustyGrey
    date: dustyGrey,
  },
  acceptInvitation: {
    icon: butteryYellow,
  },
  metadata: {
    border: mercuryGrey,
  },
  updates: {
    back: darkGrey,
  },
  invitation: {
    background: {
      hovered: aliceBlue,
    },
    border: {
      hovered: aquaHaze,
    },
  },
  authors: {
    add: {
      hovered: salomieYellow,
    },
    searchIcon: manuscriptsBlue,
  },
  projects: {
    background: {
      hovered: aliceBlue,
    },
    border: {
      hovered: aquaHaze,
    },
  },
  reload: {
    icon: butteryYellow,
  },
  shareURI: {
    textField: {
      border: altoGrey,
    },
    button: {
      border: altoGrey,
    },
  },
  citationSearch: {
    status: {
      fill: {
        default: 'transparent',
        selected: manuscriptsBlue,
      },
    },
    placeholder: altoGrey,
    more: manuscriptsBlue,
  },
  authorName: {
    default: manuscriptsGrey,
    placeholder: dustyGrey,
  },
  templateSelector: {
    item: {
      actions: {
        background: aliceBlue,
      },
      container: {
        background: {
          default: 'transparent',
          selected: aliceBlue,
          hovered: aliceBlue,
        },
      },
    },
    search: {
      icon: {
        searching: powderBlue,
      },
    },
    topicsList: {
      border: lightGrey,
      background: white,
      text: manuscriptsGrey,
      hovered: aliceBlue,
      separator: dustyGrey,
    },
  },
  collaborators: {
    actionButton: salomieYellow,
    addButton: salomieYellow,
    searchIcon: powderBlue,
  },
  editor: {
    placeholder: {
      default: '#bbb',
      hovered: dustyGrey,
    },
  },
}
