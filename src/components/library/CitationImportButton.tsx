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
import { Build, buildBibliographyItem } from '@manuscripts/manuscript-transform'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import { Button, Tip } from '@manuscripts/style-guide'
import { extname } from 'path'
import React, { useCallback, useContext, useState } from 'react'
import config from '../../config'
import { openFilePicker } from '../../pressroom/importers'
import { transformFileContent } from '../../pressroom/pressroom'
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
import { CitationImportSuccessMessage } from './Messages'

const CITATION_IMPORT_NOTIFICATION_ID = 'citation-import'

const createCitationImportErrorNotification = (
  title: string
): NotificationComponent => ({ removeNotification }) => (
  <NotificationPrompt>
    <NotificationHead>
      <AttentionRed />
      <NotificationMessage>
        <NotificationTitle>{title}</NotificationTitle>
      </NotificationMessage>
    </NotificationHead>
    <NotificationActions>
      <Button onClick={removeNotification}>Dismiss</Button>
    </NotificationActions>
  </NotificationPrompt>
)

const createCitationImportSuccessNotification = (
  count: number
): NotificationComponent => ({ removeNotification }) => (
  <NotificationPrompt>
    <NotificationHead>
      <Check />
      <NotificationMessage>
        <NotificationTitle>
          <CitationImportSuccessMessage count={count} />
        </NotificationTitle>
      </NotificationMessage>
    </NotificationHead>
    <NotificationActions>
      <Button onClick={removeNotification}>Dismiss</Button>
    </NotificationActions>
  </NotificationPrompt>
)

export const CitationImportButton: React.FC<{
  setError: (error: string) => void
  importItems: (
    items: Array<Build<BibliographyItem>>
  ) => Promise<BibliographyItem[]>
}> = React.memo(({ setError, importItems }) => {
  const { showNotification } = useContext(NotificationContext)

  const [importing, setImporting] = useState(false)

  const handleImport = useCallback(() => {
    setImporting(true)

    openFilePicker(['.bib', '.ris'])
      .then(async file => {
        if (!file) {
          return
        }

        const text = await window
          .fetch(URL.createObjectURL(file))
          .then(response => response.text())

        if (!text) {
          showNotification(
            CITATION_IMPORT_NOTIFICATION_ID,
            createCitationImportErrorNotification(
              'No bibliography items were found in this file'
            )
          )
          return
        }

        const format = extname(file.name).replace('.', '')
        const items = await transformFileContent(text, format)

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
            `There was an error importing the file. Please contact ${config.support.email} if this persists.`
          )
        )
      })
  }, [])

  return (
    <Button onClick={handleImport}>
      <Tip
        title={'Import bibliography data from a BibTeX or RIS file'}
        placement={'top'}
      >
        {importing ? 'Importing…' : 'Import from File'}
      </Tip>
    </Button>
  )
})
