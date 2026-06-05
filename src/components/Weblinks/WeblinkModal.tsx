/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2026 Atypon Systems LLC. All Rights Reserved.
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
}

export enum WeblinkModalMode {
  Add = 'add',
  Edit = 'edit',
}
type WeblinkModalProps = {
  isOpen: boolean
  header: string
  initialUrl: string
  onClose: () => void
  onSave: (values: WeblinkFormValues) => void
}

export const WeblinkModal: React.FC<WeblinkModalProps> = ({
  isOpen,
  header,
  initialUrl,
  onClose,
  onSave,
}) => {
  const [url, setUrl] = useState(initialUrl)
  const [urlError, setUrlError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl)
      setUrlError('')
    }
  }, [isOpen, initialUrl])

  const validateUrl = useCallback((currentUrl: string) => {
    const trimmed = currentUrl.trim()
    if (!trimmed) {
      setUrlError('URL is required')
      return false
    }
    if (!isValidWeblinkUrl(trimmed)) {
      setUrlError('Please enter a valid URL')
      return false
    }
    setUrlError('')
    return true
  }, [])

  const handleSave = () => {
    const trimmedUrl = url.trim()
    if (!validateUrl(trimmedUrl)) {
      return
    }
    onSave({ url: trimmedUrl })
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
              placeholder="https://"
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => validateUrl(url)}
              data-cy="weblink-url-input"
            />
            {urlError && <InputErrorText>{urlError}</InputErrorText>}
          </FormRow>
        </FormContainer>
      }
      actions={{
        primary: {
          action: handleSave,
          title: header === WeblinkModalMode.Add ? 'Add link' : 'Update link',
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
