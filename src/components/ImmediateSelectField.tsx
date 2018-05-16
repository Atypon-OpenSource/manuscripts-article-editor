import { FieldProps } from 'formik'
import React from 'react'
import Select, { Option, ReactSelectProps } from 'react-select'

export const ImmediateSelectField: React.SFC<ReactSelectProps & FieldProps> = ({
  options,
  field,
  form,
}) => (
  <Select
    options={options}
    name={field.name}
    value={options ? options.find(option => option.value === field.value) : ''}
    onChange={(option: Option) => {
      form.setFieldValue(field.name, option.value)
      window.requestAnimationFrame(() => {
        form.submitForm()
      })
    }}
    onBlur={field.onBlur}
  />
)
