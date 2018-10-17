import { FieldProps } from 'formik'
import React from 'react'
import { Creatable as CreatableSelect } from 'react-select'
import { OptionsType } from 'react-select/lib/types'
import { AffiliationMap } from '../../lib/authors'
import { Affiliation } from '../../types/models'
import { submitEvent } from '../Form'

interface ActionMeta {
  action: string
}

interface OptionType {
  label: string
  value: string
}

interface Props {
  affiliations: AffiliationMap
  createAffiliation: (institution: string) => Promise<Affiliation>
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
      value: affiliation._id,
      label: affiliation.institution || '',
    }))}
    value={(field.value || []).map((item: Affiliation) => ({
      value: item._id,
      label: item.institution,
    }))}
    styles={{
      control: base => ({
        ...base,
        backgroundColor: '#fff',
      }),
    }}
  />
)
