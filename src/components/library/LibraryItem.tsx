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
  BibliographicName,
  BibliographyItem,
  Keyword,
} from '@manuscripts/manuscripts-json-schema'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { issuedYear } from '../../lib/library'
import { styled } from '../../theme/styled-components'

const ListItem = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  transition: background-color 0.1s;
  padding: 8px 0px 8px 16px;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  transition: background-color 0.1s;
  &:not(:last-child) ${ListItem} {
    border-bottom: 1px solid ${props => props.theme.colors.popper.border};
  }
`

const LibraryItemTitle = styled(Title)`
  font-family: Barlow;
  font-size: 18px;
  margin-top: -4px;
  padding-left: 3px;
`

const LibraryItemAuthors = styled.div`
  margin-top: 4px;
  color: #777;
`

interface ListNameProps {
  bgColor?: string
}

const ListName = styled.div<ListNameProps>`
  height: 20px;
  border-radius: 4px;
  background-color: ${props => (props.bgColor ? props.bgColor : 'none')};
  display: inline-block;
  padding: 0px 2px 0px 2px;
  margin-left: 2px;
`

const LibraryItemAuthor = styled.span``

interface LibraryItemProps {
  item: BibliographyItem
  handleSelect: (item: BibliographyItem) => void
  hasItem: (item: BibliographyItem) => boolean
  selectedKeywords?: Set<string>
  keywordIdMap?: Map<string, Keyword>
}

interface LibraryItemState {
  isLoading: boolean
}

class LibraryItem extends React.Component<LibraryItemProps, LibraryItemState> {
  public state: LibraryItemState = {
    isLoading: false,
  }

  public render() {
    const { item, keywordIdMap, handleSelect } = this.props
    return (
      <Container>
        <ListItem
          onMouseDown={event => {
            event.preventDefault()
            this.setState({ isLoading: true })
            handleSelect(item)
          }}
        >
          <div>
            <LibraryItemTitle value={item.title || 'Untitled'} />

            <LibraryItemAuthors>
              <span>{issuedYear(item)}</span>

              {item.author &&
                item.author.map((author: BibliographicName, index: number) => (
                  <LibraryItemAuthor key={`author.${index}`}>
                    {!!index && ', '}
                    {author.literal || [author.given, author.family].join(' ')}
                  </LibraryItemAuthor>
                ))}
              {item &&
                item.keywordIDs &&
                item.keywordIDs.map(keyword => {
                  const name: string = keywordIdMap!.get(keyword)!.name || ''
                  return (
                    <ListName key={name} bgColor={'#dcdcdc'}>
                      {name}
                    </ListName>
                  )
                })}
            </LibraryItemAuthors>
          </div>
        </ListItem>
      </Container>
    )
  }
}

export default LibraryItem
