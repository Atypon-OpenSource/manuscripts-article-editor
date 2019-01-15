import {
  aliceBlue,
  aquaHaze,
  butteryYellow,
  chablisRed,
  darkCoral,
  deYorkGreen,
  dustyGrey,
  jellyBeanBlue,
  killarneyGreen,
  lightBlue,
  lightGrey,
  mandysRed,
  manuscriptsBlue,
  manuscriptsGrey,
  mayaBlue,
  mercuryGrey,
  peppermintGreen,
  powderBlue,
  punchRed,
  springGreen,
  towerGrey,
  wheatYellow,
  white,
  zestOrange,
} from './colors'

interface PrimaryColorStyle {
  primary: string
}

interface SecondaryColorStyle {
  secondary: string
}

type TextColorStyle = PrimaryColorStyle & SecondaryColorStyle

interface DefaultColorStyle {
  default: string
}

interface HoverableColorStyle {
  hovered: string
}

interface SelectableColorStyle {
  selected: string
}

interface ErrorColorStyle {
  error: string
}

interface LinkColorStyle {
  link: string
}

interface DangerColorStyle {
  danger: string
}

interface RadioButtonColorStyle {
  checked: string
  unchecked: string
}

interface AlertMessageColorStyle {
  background: string
  text: string
  border: string
  dismiss: string
}

type ButtonColorStyle = PrimaryColorStyle & SecondaryColorStyle

export interface Palette {
  global: {
    background: DefaultColorStyle & ErrorColorStyle
    text: TextColorStyle & ErrorColorStyle & LinkColorStyle
  }
  button: ButtonColorStyle & DangerColorStyle
  sidebar: {
    background: DefaultColorStyle & SelectableColorStyle
    text: TextColorStyle & LinkColorStyle
    dropLine: string
    label: string
  }
  menu: {
    text: string
    button: string
    icon: DefaultColorStyle & SelectableColorStyle
  }
  popper: {
    background: string
    text: TextColorStyle
    separator: string
    border: string
  }
  dropdown: {
    background: DefaultColorStyle & HoverableColorStyle
    separator: string
    text: TextColorStyle & HoverableColorStyle
    button: ButtonColorStyle
    notification: DefaultColorStyle & HoverableColorStyle
  }
  iconBar: {
    background: DefaultColorStyle & SelectableColorStyle
  }
  textField: {
    placeholder: DefaultColorStyle & HoverableColorStyle
    border: DefaultColorStyle & ErrorColorStyle
  }
  radioButton: {
    hint: string
    enabled: RadioButtonColorStyle & HoverableColorStyle
    disabled: RadioButtonColorStyle
  }
  dialog: {
    text: string
    background: string
  }
  modal: {
    overlay: string
  }
  icon: PrimaryColorStyle
  label: {
    primary: string
    success: string
    text: string
  }
  list: {
    background: string
    text: string
    separator: string
    hovered: string
  }
  alertMessage: {
    success: AlertMessageColorStyle
    error: AlertMessageColorStyle
    info: AlertMessageColorStyle
    warning: AlertMessageColorStyle
  }
}

export const themeColors: Palette = {
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
  },
  dialog: {
    text: dustyGrey,
    background: white,
  },
  modal: {
    overlay: aquaHaze,
  },
  icon: {
    primary: manuscriptsBlue,
  },
  label: {
    primary: lightBlue,
    success: deYorkGreen,
    text: manuscriptsGrey,
  },
  list: {
    background: white,
    text: manuscriptsGrey,
    hovered: aliceBlue,
    separator: dustyGrey,
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
}
