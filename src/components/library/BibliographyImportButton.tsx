/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import AttentionRed from '@manuscripts/assets/react/AttentionRed'
import Check from '@manuscripts/assets/react/Check'
import { BibliographyItem } from '@manuscripts/json-schema'
import { parseBibliography } from '@manuscripts/library'
import { SecondaryButton } from '@manuscripts/style-guide'
import { Build, buildBibliographyItem } from '@manuscripts/transform'
import React, { useCallback, useContext, useState } from 'react'

import { FileExtensionError } from '../../lib/errors'
import { ContactSupportButton } from '../ContactSupportButton'
import {
  NotificationComponent,
  NotificationContext,
} from '../NotificationProvider'
import {
  NotificationActions,
  NotificationHead,
  NotificationMessage,
  NotificationPrompt,
  NotificationTitle,
} from '../Notifications'
import {FormattedMessage} from "react-intl";

const CITATION_IMPORT_NOTIFICATION_ID = 'citation-import'

const createCitationImportErrorNotification =
  (title: string | JSX.Element): NotificationComponent =>
  ({ removeNotification }) =>
    (
      <NotificationPrompt>
        <NotificationHead>
          <AttentionRed />
          <NotificationMessage>
            <NotificationTitle>{title}</NotificationTitle>
          </NotificationMessage>
        </NotificationHead>
        <NotificationActions>
          <SecondaryButton onClick={removeNotification}>
            Dismiss
          </SecondaryButton>
        </NotificationActions>
      </NotificationPrompt>
    )

const createCitationImportSuccessNotification =
  (count: number): NotificationComponent =>
  ({ removeNotification }) =>
    (
      <NotificationPrompt>
        <NotificationHead>
          <Check color={'green'} />
          <NotificationMessage>
            <NotificationTitle>
              <CitationImportSuccessMessage count={count} />
            </NotificationTitle>
          </NotificationMessage>
        </NotificationHead>
        <NotificationActions>
          <SecondaryButton onClick={removeNotification}>
            Dismiss
          </SecondaryButton>
        </NotificationActions>
      </NotificationPrompt>
    )

const openFilePicker = (
  acceptedExtensions: string[],
  multiple = false
): Promise<File[]> =>
  new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = acceptedExtensions.join(',')
    input.multiple = multiple

    const handleFocus = () => {
      window.removeEventListener('focus', handleFocus)

      // This event is fired before the input's change event,
      // and before the input's FileList has been populated,
      // so a delay is needed.
      window.setTimeout(() => {
        if (!input.files || !input.files.length) {
          resolve([])
        }
      }, 1000)
    }

    // window "focus" event, fired even if the file picker is cancelled.
    window.addEventListener('focus', handleFocus)

    input.addEventListener('change', () => {
      if (input.files && input.files.length) {
        for (const file of input.files) {
          const ext = file.type.split('/').pop() || ''
          const extension = ext.toLowerCase()

          if (!acceptedExtensions.includes(extension)) {
            const error = new FileExtensionError(extension, acceptedExtensions)
            reject(error)
            return
          }
        }

        resolve(Array.from(input.files))
      } else {
        resolve([])
      }
    })

    input.click()
  })

interface Props {
  importItems: () => void
  importing: boolean
}

export const BibliographyImportButton: React.FC<{
  importItems: (
    items: Array<Build<BibliographyItem>>
  ) => Promise<BibliographyItem[]>
  component: React.FunctionComponent<Props>
}> = React.memo(({ importItems, component: Component }) => {
  const { showNotification } = useContext(NotificationContext)

  const [importing, setImporting] = useState(false)

  const handleImport = useCallback(() => {
    setImporting(true)

    openFilePicker(['.bib', '.bibtex', '.ris'])
      .then(async ([file]) => {
        if (!file) {
          return
        }

        const text = await window
          .fetch(URL.createObjectURL(file))
          .then((response) => response.text())

        if (!text) {
          showNotification(
            CITATION_IMPORT_NOTIFICATION_ID,
            createCitationImportErrorNotification(
              'No bibliography items were found in this file'
            )
          )
          return
        }

        const ext = file.type.split('/').pop() || ''
        const items = await parseBibliography(text, ext)

        if (!items || !items.length) {
          showNotification(
            CITATION_IMPORT_NOTIFICATION_ID,
            createCitationImportErrorNotification(
              'No bibliography items were found in this file'
            )
          )
          return
        }

        const bibliographyItems = items.map(buildBibliographyItem)
        const newItems = await importItems(bibliographyItems)

        showNotification(
          CITATION_IMPORT_NOTIFICATION_ID,
          createCitationImportSuccessNotification(newItems.length)
        )
      })
      .finally(() => {
        setImporting(false)
      })
      .catch(() => {
        showNotification(
          CITATION_IMPORT_NOTIFICATION_ID,
          createCitationImportErrorNotification(
            <React.Fragment>
              There was an error importing the file. Please{' '}
              <ContactSupportButton>contact support</ContactSupportButton> if
              this persists.
            </React.Fragment>
          )
        )
      })
  }, [importItems, showNotification])

  return <Component importItems={handleImport} importing={importing} />
})

const CitationImportSuccessMessage: React.FC<{
  count: number
}> = ({ count }) => (
  <FormattedMessage
    id={'citation_import_success'}
    defaultMessage={`{count, number} {count, plural,
                        one {record}
                        other {records}
                      } imported into the project library`}
    values={{ count }}
  />
)
