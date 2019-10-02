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

import { generateID } from '@manuscripts/manuscript-transform'
import {
  ListItemBulletStyle,
  NumberingStyle,
  ObjectTypes,
  ParagraphStyle,
} from '@manuscripts/manuscripts-json-schema'
import { SecondaryButton } from '@manuscripts/style-guide'
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
          <SecondaryButton mini={true} onClick={toggleExpanded}>
            Show all levels
          </SecondaryButton>
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
  padding: ${props => props.theme.grid.unit}px
    ${props => props.theme.grid.unit * 2}px ${props => props.theme.grid.unit}px
    0;
  font-size: ${props => props.theme.font.size.normal};
  color: ${props => props.theme.colors.text.muted};
`

const HeaderCell = styled(Cell)``

const RowHeaderCell = styled(Cell)`
  text-align: right;
`

const Expander = styled.div`
  padding: ${props => props.theme.grid.unit * 2}px
    ${props => props.theme.grid.unit * 8}px;
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
