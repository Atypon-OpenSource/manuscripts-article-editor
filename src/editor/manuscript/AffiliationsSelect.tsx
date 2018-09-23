import { FieldProps } from 'formik'
import React from 'react'
import { Creatable as CreatableSelect } from 'react-select'
import { OptionsType } from 'react-select/lib/types'
import { submitEvent } from '../../components/Form'
import { Affiliation } from '../../types/components'
import { AffiliationMap } from './lib/authors'

interface ActionMeta {
  action: string
}

interface OptionType {
  label: string
  value: string
}

interface Props {
  affiliations: AffiliationMap
  createAffiliation: (name: string) => Promise<Affiliation>
}

export const AffiliationsSelect: React.SFC<Props & FieldProps> = ({
  affiliations,
  createAffiliation,
  form,
  field,
}) => (
  <CreatableSelect<OptionType>
    isMulti={true}
    noOptionsMessage={() => 'Type institution name to search for it.'}
    onChange={async (
      newValue: OptionsType<OptionType>,
      actionMeta: ActionMeta
    ) => {
      form.setFieldValue(
        field.name,
        await Promise.all(
          newValue.map(async option => {
            if (actionMeta.action === 'create-option') {
              return createAffiliation(option.label)
            }

            return affiliations.get(option.value)
          })
        )
      )

      form.handleSubmit(submitEvent as React.FormEvent<HTMLFormElement>)
    }}
    options={Array.from(affiliations.values()).map(affiliation => ({
      value: affiliation.id,
      label: affiliation.name,
    }))}
    value={(field.value || []).map((item: Affiliation) => ({
      value: item.id,
      label: item.name,
    }))}
    styles={{
      control: base => ({
        ...base,
        backgroundColor: '#fff',
      }),
    }}
  />
)
