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

import { submitEvent } from '@manuscripts/style-guide'
import { FieldProps } from 'formik'
import { debounce } from 'lodash-es'
import React, { InputHTMLAttributes } from 'react'

interface AutoSaveInputProps {
  component: React.ComponentType<InputHTMLAttributes<HTMLInputElement>>
  saveOn: 'change' | 'blur'
  // inputProps?: Exclude<InputHTMLAttributes<HTMLInputElement>, FieldProps>
  placeholder?: string
}

class AutoSaveInput extends React.Component<FieldProps & AutoSaveInputProps> {
  // NOTE: this needs to happen in a timeout so the values are updated first
  private handleSubmit = debounce(() => {
    this.props.form.handleSubmit(submitEvent as React.FormEvent<
      HTMLFormElement
    >)
  }, 1)

  public render() {
    const { component: Component, field, placeholder } = this.props

    return (
      <Component
        {...field}
        placeholder={placeholder}
        checked={!!field.value}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
      />
    )
  }

  private handleBlur = (event: React.FormEvent<HTMLInputElement>) => {
    this.props.field.onBlur(event)

    if (this.props.saveOn === 'blur') {
      this.handleSubmit()
    }
  }

  private handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.props.field.onChange(event)

    if (this.props.saveOn === 'change') {
      this.handleSubmit()
    }
  }
}

export default AutoSaveInput
