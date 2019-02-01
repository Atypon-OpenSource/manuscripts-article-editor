// https://www.styled-components.com/docs/api#typescript
import React from 'react'
import * as styledComponents from 'styled-components'

export interface Theme {
  colors: Palette
  fontFamily: string
  radius: number
  spacing: number
}

export type ThemedProps<V> = styledComponents.ThemedStyledProps<
  React.HTMLProps<V>,
  Theme
>

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
    border: string
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
    border: string
  }
  iconBar: {
    background: DefaultColorStyle & SelectableColorStyle
  }
  textField: {
    placeholder: DefaultColorStyle & HoverableColorStyle
    border: DefaultColorStyle & ErrorColorStyle
  }
  title: {
    placeholder: string
    background: HoverableColorStyle
    border: DefaultColorStyle & HoverableColorStyle
  }
  radioButton: {
    hint: string
    enabled: RadioButtonColorStyle & HoverableColorStyle
    disabled: RadioButtonColorStyle
    border: string
  }
  dialog: {
    text: string
    background: string
    icon: string
    shadow: string
  }
  modal: {
    overlay: string
    border: string
    shadow: string
  }
  icon: PrimaryColorStyle
  label: {
    primary: string
    success: string
    text: string
  }
  alertMessage: {
    success: AlertMessageColorStyle
    error: AlertMessageColorStyle
    info: AlertMessageColorStyle
    warning: AlertMessageColorStyle
  }
  comment: {
    date: string
    border: DefaultColorStyle & SelectableColorStyle
  }
  profile: {
    avatar: string
    date: string
  }
  acceptInvitation: {
    icon: string
  }
  collaborators: {
    actionButton: string
    addButton: string
    searchIcon: string
  }
  metadata: {
    border: string
  }
  updates: {
    back: string
  }
  invitation: {
    background: HoverableColorStyle
    border: HoverableColorStyle
  }
  authors: {
    add: HoverableColorStyle
    searchIcon: string
  }
  projects: {
    background: HoverableColorStyle
    border: HoverableColorStyle
  }
  reload: {
    icon: string
  }
  shareURI: {
    textField: {
      border: string
    }
    button: {
      border: string
    }
  }
  citationSearch: {
    status: {
      fill: {
        default: string
        selected: string
      }
    }
    placeholder: string
    more: string
  }
  authorName: {
    default: string
    placeholder: string
  }
  templateSelector: {
    item: {
      actions: {
        background: string
      }
      container: {
        background: DefaultColorStyle &
          SelectableColorStyle &
          HoverableColorStyle
      }
    }
    search: {
      icon: {
        searching: string
      }
    }
    topicsList: {
      border: string
      background: string
      text: string
      separator: string
      hovered: string
    }
  }
  editor: {
    placeholder: DefaultColorStyle & HoverableColorStyle
  }
}
