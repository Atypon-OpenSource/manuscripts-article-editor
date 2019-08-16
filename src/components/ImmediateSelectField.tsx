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

import { FieldProps } from 'formik'
import React from 'react'
import Select from 'react-select'
import { OptionsType } from 'react-select/lib/types'

// TODO: make this a generic type
interface OptionType {
  label: string
  value: any // tslint:disable-line:no-any
}

interface Props {
  options: OptionsType<OptionType>
}

export const ImmediateSelectField: React.FunctionComponent<
  Props & FieldProps
> = ({ options, field, form }) => (
  <Select<OptionType>
    options={options}
    name={field.name}
    value={
      options ? options.find(option => option.value === field.value) : undefined
    }
    onChange={(option: OptionType) => {
      form.setFieldValue(field.name, option.value)
      window.requestAnimationFrame(() => {
        form.submitForm()
      })
    }}
    onBlur={field.onBlur}
  />
)
