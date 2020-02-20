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

import { InlineStyle } from '@manuscripts/manuscripts-json-schema'
import {
  PrimaryButton,
  SecondaryButton,
  TextArea,
  TextField,
} from '@manuscripts/style-guide'
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useCallback, useState } from 'react'
import { styled } from '../../theme/styled-components'
import { Subheading } from '../InspectorSection'

export const InlineStyleItem: React.FC<{
  isActive: boolean
  applyStyle: (id: string) => void
  removeStyle: (id: string) => void
  inlineStyle: InlineStyle
  saveInlineStyle: (value: Partial<InlineStyle>) => void
  deleteInlineStyle: (id: string) => Promise<string>
}> = ({
  inlineStyle,
  saveInlineStyle,
  deleteInlineStyle,
  isActive,
  applyStyle,
  removeStyle,
}) => {
  const [editing, setEditing] = useState<boolean>(!inlineStyle.title)

  const toggleEditing = useCallback(() => {
    setEditing(value => !value)
  }, [])

  return (
    <>
      <InlineStyleInfo>
        <div>
          <InlineStyleTitle>
            {inlineStyle.title || 'Untitled Style'}
          </InlineStyleTitle>
        </div>

        <div>
          {isActive ? (
            <SecondaryButton
              onClick={() => removeStyle(inlineStyle._id)}
              mini={true}
            >
              Clear
            </SecondaryButton>
          ) : (
            <SecondaryButton
              onClick={() => applyStyle(inlineStyle._id)}
              mini={true}
            >
              Apply
            </SecondaryButton>
          )}

          <SecondaryButton onClick={toggleEditing} mini={true}>
            Edit
          </SecondaryButton>
        </div>
      </InlineStyleInfo>

      {editing && (
        <Formik
          initialValues={{
            title: inlineStyle.title || '',
            style: inlineStyle.style || '',
          }}
          onSubmit={values => {
            saveInlineStyle(values)
            toggleEditing()
          }}
        >
          <InlineStyleForm>
            <Subheading>Name</Subheading>

            <Field name={'title'}>
              {(props: FieldProps) => (
                <TextField
                  {...props.field}
                  placeholder={'Enter a name for this style…'}
                />
              )}
            </Field>

            <Subheading>CSS</Subheading>

            <Field name={'style'}>
              {(props: FieldProps) => <TextArea {...props.field} rows={5} />}
            </Field>

            <Actions>
              <SecondaryButton
                type={'button'}
                mini={true}
                danger={true}
                onClick={() => deleteInlineStyle(inlineStyle._id)}
              >
                Delete
              </SecondaryButton>

              <PrimaryButton type={'submit'} mini={true}>
                Save
              </PrimaryButton>
            </Actions>
          </InlineStyleForm>
        </Formik>
      )}
    </>
  )
}

const InlineStyleInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 16px;
`

const InlineStyleTitle = styled.div``

const InlineStyleForm = styled(Form)`
  margin: 8px 0;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 4px;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 4px 0;
`
