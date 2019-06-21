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

import { Palette as StyleGuidePalette } from '@manuscripts/style-guide'

export interface Theme {
  colors: Palette
  fontFamily: string
  radius: number
  spacing: number
}

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

export interface Palette extends StyleGuidePalette {
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
    background: string
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
  library: {
    sidebar: {
      background: DefaultColorStyle & SelectableColorStyle
      field: {
        label: string
        border: string
      }
    }
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
