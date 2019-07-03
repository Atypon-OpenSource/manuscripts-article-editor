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

import { generateID } from '@manuscripts/manuscript-transform'
import {
  ListItemBulletStyle,
  NumberingStyle,
  ObjectTypes,
  ParagraphStyle,
} from '@manuscripts/manuscripts-json-schema'
import { MiniButton } from '@manuscripts/style-guide'
import React, { useCallback, useState } from 'react'
import {
  DEFAULT_LIST_BULLET_STYLE,
  DEFAULT_LIST_NUMBERING_PREFIX,
  DEFAULT_LIST_NUMBERING_STYLE,
  DEFAULT_LIST_NUMBERING_SUFFIX,
  DEFAULT_LIST_START_INDEX,
  ListBulletStyle,
  listBulletStyles,
  listLevels,
  ListNumberingScheme,
  listNumberingSchemes,
} from '../../lib/styles'
import { styled } from '../../theme/styled-components'
import { SmallNumberField, SmallTextField } from '../projects/inputs'
import { defaultValue, SaveParagraphStyle } from './StyleFields'

export const ParagraphListsField: React.FC<{
  paragraphStyle: ParagraphStyle
  saveParagraphStyle: SaveParagraphStyle
}> = ({ paragraphStyle, saveParagraphStyle }) => {
  const [expanded, setExpanded] = useState(false)

  const {
    embeddedListItemBulletStyles,
    embeddedListItemNumberingStyles,
  } = paragraphStyle

  const toggleExpanded = useCallback(() => {
    setExpanded(value => !value)
  }, [])

  return (
    <>
      <Row>
        <HeaderCell>Level</HeaderCell>
        <HeaderCell>Bullet</HeaderCell>
        <HeaderCell>Number</HeaderCell>
        <HeaderCell>Start</HeaderCell>
        <HeaderCell>Prefix</HeaderCell>
        <HeaderCell>Suffix</HeaderCell>
      </Row>

      {/* tslint:disable-next-line:cyclomatic-complexity */}
      {listLevels.slice(0, expanded ? listLevels.length : 3).map(listLevel => {
        const listItemBulletStyle =
          embeddedListItemBulletStyles &&
          embeddedListItemBulletStyles[listLevel]
            ? embeddedListItemBulletStyles[listLevel]
            : buildListItemBulletStyle()

        const listItemNumberingStyle =
          embeddedListItemNumberingStyles &&
          embeddedListItemNumberingStyles[listLevel]
            ? embeddedListItemNumberingStyles[listLevel]
            : buildNumberingStyle()

        return (
          <Row key={listLevel}>
            <RowHeaderCell>{listLevel}</RowHeaderCell>

            <Cell>
              <select
                name={'list-bullet-style'}
                value={defaultValue<string>(
                  listItemBulletStyle.bulletStyle,
                  DEFAULT_LIST_BULLET_STYLE
                )}
                onChange={event => {
                  saveParagraphStyle({
                    ...paragraphStyle,
                    embeddedListItemBulletStyles: {
                      ...embeddedListItemBulletStyles,
                      [listLevel]: {
                        ...listItemBulletStyle,
                        bulletStyle: event.target.value as ListBulletStyle,
                      },
                    },
                  })
                }}
              >
                {Object.entries(listBulletStyles).map(([key, value]) => (
                  <option value={key} key={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </Cell>

            <Cell>
              <select
                name={'list-numbering-scheme'}
                value={defaultValue<string>(
                  listItemNumberingStyle.numberingScheme,
                  DEFAULT_LIST_NUMBERING_STYLE
                )}
                onChange={event => {
                  saveParagraphStyle({
                    ...paragraphStyle,
                    embeddedListItemNumberingStyles: {
                      ...embeddedListItemNumberingStyles,
                      [listLevel]: {
                        ...listItemNumberingStyle,
                        numberingScheme: event.target
                          .value as ListNumberingScheme,
                      },
                    },
                  })
                }}
              >
                {Object.entries(listNumberingSchemes).map(([key, value]) => (
                  <option value={key} key={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </Cell>

            <Cell>
              <SmallNumberField
                name={'list-start-index'}
                value={defaultValue<number>(
                  listItemNumberingStyle.startIndex,
                  DEFAULT_LIST_START_INDEX
                )}
                onChange={event => {
                  saveParagraphStyle({
                    ...paragraphStyle,
                    embeddedListItemNumberingStyles: {
                      ...embeddedListItemNumberingStyles,
                      [listLevel]: {
                        ...listItemNumberingStyle,
                        startIndex: Number(event.target.value),
                      },
                    },
                  })
                }}
              />
            </Cell>

            <Cell>
              <SmallTextField
                name={'list-prefix'}
                size={1}
                value={defaultValue<string>(
                  listItemNumberingStyle.prefix,
                  DEFAULT_LIST_NUMBERING_PREFIX
                )}
                onChange={event => {
                  saveParagraphStyle({
                    ...paragraphStyle,
                    embeddedListItemNumberingStyles: {
                      ...embeddedListItemNumberingStyles,
                      [listLevel]: {
                        ...listItemNumberingStyle,
                        prefix: event.target.value,
                      },
                    },
                  })
                }}
              />
            </Cell>

            <Cell>
              <SmallTextField
                name={'list-suffix'}
                size={1}
                value={defaultValue<string>(
                  listItemNumberingStyle.suffix,
                  DEFAULT_LIST_NUMBERING_SUFFIX
                )}
                onChange={event => {
                  saveParagraphStyle({
                    ...paragraphStyle,
                    embeddedListItemNumberingStyles: {
                      ...embeddedListItemNumberingStyles,
                      [listLevel]: {
                        ...listItemNumberingStyle,
                        suffix: event.target.value,
                      },
                    },
                  })
                }}
              />
            </Cell>
          </Row>
        )
      })}

      {!expanded && (
        <Expander>
          <MiniButton onClick={toggleExpanded}>Show all levels</MiniButton>
        </Expander>
      )}
    </>
  )
}

const Row = styled.div`
  display: table-row;
`

const Cell = styled.div`
  display: table-cell;
  padding: 4px 8px 4px 0;
  font-size: 14px;
  color: #777;
`

const HeaderCell = styled(Cell)``

const RowHeaderCell = styled(Cell)`
  text-align: right;
`

const Expander = styled.div`
  padding: 4px 32px;
`

const buildListItemBulletStyle = (): ListItemBulletStyle => ({
  _id: generateID(ObjectTypes.ListItemBulletStyle),
  objectType: ObjectTypes.ListItemBulletStyle,
})

const buildNumberingStyle = (): NumberingStyle => ({
  _id: generateID(ObjectTypes.NumberingStyle),
  objectType: ObjectTypes.NumberingStyle,
  startIndex: 1,
})
