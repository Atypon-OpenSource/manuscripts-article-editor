/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */
import { isValidWeblinkUrl } from '@manuscripts/body-editor'
import {
  Category,
  Dialog,
  FormContainer,
  FormRow,
  InputErrorText,
  Label,
  TextField,
} from '@manuscripts/style-guide'
import React, { useCallback, useEffect, useState } from 'react'

export type WeblinkFormValues = {
  url: string
  title: string
}

type WeblinkModalProps = {
  isOpen: boolean
  header: string
  initialValues: WeblinkFormValues
  onClose: () => void
  onSave: (values: WeblinkFormValues) => void
}

export const WeblinkModal: React.FC<WeblinkModalProps> = ({
  isOpen,
  header,
  initialValues,
  onClose,
  onSave,
}) => {
  const [url, setUrl] = useState(initialValues.url)
  const [weblinkTitle, setWeblinkTitle] = useState(initialValues.title)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      setUrl(initialValues.url)
      setWeblinkTitle(initialValues.title)
      setErrors({})
    }
  }, [isOpen, initialValues.url, initialValues.title])

  const validate = useCallback((currentUrl: string, currentTitle: string) => {
    const newErrors: Record<string, string> = {}
    if (!currentUrl.trim()) {
      newErrors.url = 'URL is required'
    } else if (!isValidWeblinkUrl(currentUrl.trim())) {
      newErrors.url = 'Please enter a valid URL'
    }
    if (!currentTitle.trim()) {
      newErrors.title = 'Label is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [])

  const handleSave = () => {
    const trimmedUrl = url.trim()
    const trimmedTitle = weblinkTitle.trim()
    if (!validate(trimmedUrl, trimmedTitle)) {
      return
    }
    onSave({ url: trimmedUrl, title: trimmedTitle })
  }

  return (
    <Dialog
      isOpen={isOpen}
      category={Category.confirmation}
      header={header}
      message={
        <FormContainer>
          <FormRow>
            <Label htmlFor="weblink-url">URL</Label>
            <TextField
              id="weblink-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => validate(url, weblinkTitle)}
              data-cy="weblink-url-input"
            />
            {errors.url && <InputErrorText>{errors.url}</InputErrorText>}
          </FormRow>
          <FormRow>
            <Label htmlFor="weblink-title">Label</Label>
            <TextField
              id="weblink-title"
              value={weblinkTitle}
              onChange={(e) => setWeblinkTitle(e.target.value)}
              onBlur={() => validate(url, weblinkTitle)}
              data-cy="weblink-label-input"
            />
            {errors.title && <InputErrorText>{errors.title}</InputErrorText>}
          </FormRow>
        </FormContainer>
      }
      actions={{
        primary: {
          action: handleSave,
          title: 'Save',
        },
        secondary: {
          action: onClose,
          title: 'Cancel',
        },
        onClose,
      }}
    />
  )
}
