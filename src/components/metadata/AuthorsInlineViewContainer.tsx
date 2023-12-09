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
import { Contributor } from '@manuscripts/json-schema'
import { AuthorsContainer, IconButton } from '@manuscripts/style-guide'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { GenericStore, state } from '../../store'

export const ExpanderButton = styled(IconButton).attrs(() => ({
  size: 20,
  defaultColor: true,
}))`
  border: none;
  border-radius: 50%;

  &:focus,
  &:hover {
    &:not([disabled]) {
      background: ${(props) => props.theme.colors.background.fifth};
    }
  }

  svg circle {
    stroke: ${(props) => props.theme.colors.border.secondary};
  }
`

const HeaderContainer = styled.header`
  padding: 0 64px;
`

const Header = styled.div`
  font-family: 'PT Sans';
  font-size: ${(props) => props.theme.font.size.medium};
  line-height: ${(props) => props.theme.font.lineHeight.large};
  color: ${(props) => props.theme.colors.text.primary};

  ${ExpanderButton} {
    display: none;
  }

  &:hover ${ExpanderButton} {
    display: initial;
  }
`

interface Props {
  showAuthorEditButton: boolean
  disableEditButton?: boolean
  subscribe: GenericStore['subscribe']
}

const AuthorsInlineViewContainer: React.FC<Props> = (props) => {
  const [store, setStore] = useState<state>()

  useEffect(() => {
    props.subscribe((store) => {
      setStore(store)
    })
  }, [props])

  if (!store || !store.trackedAuthorsAndAffiliations) {
    return null
  }
  return (
    <HeaderContainer>
      <Header>
        <AuthorsContainer
          authorData={store.trackedAuthorsAndAffiliations}
          startEditing={store.startEditing}
          showEditButton={props.showAuthorEditButton}
          disableEditButton={props.disableEditButton}
          selectAuthor={store.selectAuthor}
        />
      </Header>
    </HeaderContainer>
  )
}

export default AuthorsInlineViewContainer
