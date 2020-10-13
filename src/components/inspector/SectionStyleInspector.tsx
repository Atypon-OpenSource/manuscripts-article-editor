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

import {
  Model,
  ParagraphStyle,
  Section,
} from '@manuscripts/manuscripts-json-schema'
import { debounce } from 'lodash-es'
import React, { useCallback, useEffect, useState } from 'react'

import { buildColors } from '../../lib/colors'
import { chooseParagraphStyle } from '../../lib/styles'
import { SectionStyles } from './SectionStyles'

type SaveModel = <T extends Model>(model: Partial<T>) => Promise<T>

export const SectionStyleInspector: React.FC<{
  section: Section
  modelMap: Map<string, Model>
  saveModel: SaveModel
  dispatchUpdate: () => void
}> = ({ section, dispatchUpdate, modelMap, saveModel }) => {
  const [error, setError] = useState<Error>()

  const [paragraphStyle, setParagraphStyle] = useState<ParagraphStyle>()

  const depth = section.path.length
  const sectionParagraphStyle = chooseParagraphStyle(
    modelMap,
    `heading${depth}`
  )

  useEffect(() => {
    setParagraphStyle(sectionParagraphStyle)
  }, [
    setParagraphStyle,
    sectionParagraphStyle,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(sectionParagraphStyle),
  ])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSaveParagraphStyle = useCallback(
    debounce(
      (paragraphStyle: ParagraphStyle) =>
        saveModel<ParagraphStyle>(paragraphStyle).catch((error) => {
          setError(error)
        }),
      500
    ),
    [saveModel]
  )

  if (!paragraphStyle) {
    return null
  }

  const saveDebouncedParagraphStyle = (paragraphStyle: ParagraphStyle) => {
    setParagraphStyle(paragraphStyle)

    return debouncedSaveParagraphStyle(paragraphStyle)
  }

  const saveParagraphStyle = (paragraphStyle: ParagraphStyle) => {
    setParagraphStyle(paragraphStyle)

    return saveModel<ParagraphStyle>(paragraphStyle)
      .then(() => {
        // TODO: set meta
        dispatchUpdate() // TODO: do this when receiving an updated paragraph style instead?
      })
      .catch((error) => {
        // TODO: restore previous paragraphStyle?
        setError(error)
      })
  }

  const titlePrefix =
    depth === 1 ? 'Section' : `Sub${'sub'.repeat(depth - 2)}section`

  const { colors, colorScheme } = buildColors(modelMap)

  return (
    <SectionStyles
      title={`${titlePrefix} Heading Styles`}
      colors={colors}
      colorScheme={colorScheme}
      error={error}
      paragraphStyle={paragraphStyle}
      saveModel={saveModel}
      saveParagraphStyle={saveParagraphStyle}
      saveDebouncedParagraphStyle={saveDebouncedParagraphStyle}
      setError={setError}
    />
  )
}
