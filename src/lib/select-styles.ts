/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */

import { StylesConfig } from 'react-select'

import { theme } from '../theme/theme'

// Since the generic OptionType is not used within the styles, it's declared as any
// Another choice would be to make this a generic function but that might incur some extraneous
// function calls for a data that is static.
export const selectStyles: StylesConfig<any, boolean> = {
  container: (base) => ({
    ...base,
    flex: 1,
  }),
  control: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? theme.colors.background.fifth
      : theme.colors.background.primary,
    borderColor: state.isFocused
      ? theme.colors.border.field.active
      : theme.colors.border.field.default,
    '&:hover': {
      backgroundColor: theme.colors.background.fifth,
    },
    borderRadius: theme.grid.radius.default,
    boxShadow: 'none',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 10 }),
}
