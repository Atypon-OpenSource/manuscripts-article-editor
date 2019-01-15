import { Project } from '@manuscripts/manuscripts-json-schema'
import { Title } from '@manuscripts/title-editor'
import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { styled, ThemedProps } from '../../theme'
import { DangerButton } from '../Button'
import { FormError, FormErrors } from '../Form'
import { ModalFormActions } from '../ModalForm'
import { TextField } from '../TextField'
import { TextFieldContainer } from '../TextFieldContainer'

type ThemedDivProps = ThemedProps<HTMLDivElement>

export interface DeleteAccountValues {
  password: string
}

interface DeleteAccountProps {
  deletedProjects: Project[]
}

const MessageContainer = styled.div`
  font-family: Barlow;
  font-size: 16px;
  color: ${(props: ThemedDivProps) => props.theme.colors.global.text.secondary};
  margin-top: 15px;
  margin-left: 20px;
`

export const DeleteAccountForm: React.FunctionComponent<
  FormikProps<DeleteAccountValues & FormErrors> & DeleteAccountProps
> = ({ deletedProjects, errors, isSubmitting }) => (
  <Form id={'delete-account-form'} noValidate={true}>
    <Field name={'password'}>
      {({ field }: FieldProps) => (
        <TextFieldContainer error={errors.password}>
          <TextField
            {...field}
            type={'password'}
            placeholder={'Confirm your password to delete your account'}
            autoFocus={true}
            required={true}
          />
        </TextFieldContainer>
      )}
    </Field>
    {errors.submit && <FormError>{errors.submit}</FormError>}
    {deletedProjects &&
      deletedProjects.length !== 0 && (
        <MessageContainer>
          {'Deleting your account will also delete these projects'}
          <ul>
            {deletedProjects.map(project => (
              <li key={project._id}>
                <Title value={project.title || 'Untitled Project'} />
              </li>
            ))}
          </ul>
        </MessageContainer>
      )}
    <ModalFormActions>
      <DangerButton type={'submit'} disabled={isSubmitting}>
        Delete Account
      </DangerButton>
    </ModalFormActions>
  </Form>
)
