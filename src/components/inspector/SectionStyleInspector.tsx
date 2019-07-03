/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Manuscript,
  Model,
  ParagraphStyle,
  Section,
} from '@manuscripts/manuscripts-json-schema'
import { debounce } from 'lodash-es'
import React, { useCallback, useEffect, useState } from 'react'
import { buildColors } from '../../lib/colors'
import { isParagraphStyle } from '../../lib/styles'
import { SectionStyles } from './SectionStyles'

type SaveModel = <T extends Model>(model: Partial<T>) => Promise<T>

export const SectionStyleInspector: React.FC<{
  section: Section
  manuscript: Manuscript
  modelMap: Map<string, Model>
  saveModel: SaveModel
}> = ({ section, manuscript, modelMap, saveModel }) => {
  const [error, setError] = useState<Error>()

  const [paragraphStyle, setParagraphStyle] = useState<ParagraphStyle>()

  const chooseParagraphStyle = (styleName: string) => {
    for (const model of modelMap.values()) {
      if (isParagraphStyle(model) && model.name === styleName) {
        return model
      }
    }
  }

  const depth = section.path.length
  const sectionParagraphStyle = chooseParagraphStyle(`heading${depth}`)

  useEffect(() => {
    setParagraphStyle(sectionParagraphStyle)
  }, [
    setParagraphStyle,
    sectionParagraphStyle,
    JSON.stringify(sectionParagraphStyle),
  ])

  const debouncedSaveParagraphStyle = useCallback(
    debounce((paragraphStyle: ParagraphStyle) => {
      return saveModel<ParagraphStyle>(paragraphStyle).catch(error => {
        setError(error)
      })
    }, 500),
    [setError, saveModel]
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

    return saveModel<ParagraphStyle>(paragraphStyle).catch(error => {
      // TODO: restore previous paragraphStyle?
      setError(error)
    })
  }

  const titlePrefix =
    depth === 1 ? 'Section' : `Sub${'sub'.repeat(depth - 2)}section`

  const { colors, colorScheme } = buildColors(modelMap)

  if (!colorScheme) {
    return null
  }

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
