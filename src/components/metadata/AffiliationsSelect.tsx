import {
  Affiliation,
  UserProfileAffiliation,
} from '@manuscripts/manuscripts-json-schema'
import { FieldProps } from 'formik'
import React from 'react'
import { Creatable as CreatableSelect } from 'react-select'
import { OptionsType } from 'react-select/lib/types'
import { submitEvent } from '../Form'

interface ActionMeta {
  action: string
}

interface OptionType {
  label: string
  value: string
  __isNew__?: boolean
}

type AffiliationType = UserProfileAffiliation | Affiliation

interface Props {
  affiliations: Map<string, AffiliationType>
  createAffiliation: (institution: string) => Promise<AffiliationType>
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
            if (actionMeta.action === 'create-option' && option.__isNew__) {
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
    value={(field.value || []).map((item: AffiliationType) => ({
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
