import { FieldProps } from 'formik'
import React from 'react'
import { Option } from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'
import { submitEvent } from '../../components/Form'
import { Affiliation } from '../../types/components'
import { AffiliationMap } from './lib/authors'

interface ActionMeta {
  action: string
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
  <CreatableSelect
    isMulti={true}
    onChange={async (newValue: [Option], actionMeta: ActionMeta) => {
      form.setFieldValue(
        field.name,
        await Promise.all(
          newValue.map(async option => {
            if (actionMeta.action === 'create-option') {
              return createAffiliation(option.label as string)
            }

            return affiliations.get(option.value as string)
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
  />
)
