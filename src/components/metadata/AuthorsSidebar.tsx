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

import { Contributor } from '@manuscripts/manuscripts-json-schema'
import {
  AlertMessage,
  AlertMessageType,
  AuthorAffiliation,
  AuthorsDND,
} from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

import { AddButton } from '../AddButton'
import { ModalSidebar, SidebarContent, SidebarHeader } from '../Sidebar'

const SidebarAction = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.grid.unit * 4}px;
`

const AlertMessageContainer = styled.div`
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
`

interface Props {
  authors: Contributor[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  selectedAuthor: Contributor | null
  invitationSent: boolean
  selectAuthor: (item: Contributor) => void
  openAddAuthors: () => void
  handleDrop: (oldIndex: number, newIndex: number) => void
  getSidebarItemDecorator?: (authorID: string) => JSX.Element | null
  handleDismiss: () => void
}

const AuthorsSidebar: React.FunctionComponent<Props> = ({
  authors,
  selectAuthor,
  selectedAuthor,
  openAddAuthors,
  handleDrop,
  getSidebarItemDecorator,
  invitationSent,
  handleDismiss,
}) => (
  <ModalSidebar data-cy={'authors-sidebar'}>
    <SidebarHeader title={'Authors'} />

    <SidebarContent>
      <SidebarAction>
        <AddButton
          action={openAddAuthors}
          size={'medium'}
          title={'New Author'}
        />
      </SidebarAction>
      {invitationSent && (
        <AlertMessageContainer>
          <AlertMessage
            type={AlertMessageType.success}
            hideCloseButton={true}
            dismissButton={{
              text: 'OK',
              action: () => {
                handleDismiss()
              },
            }}
          >
            Invitation was sent.
          </AlertMessage>
        </AlertMessageContainer>
      )}
      <AuthorsDND
        authors={authors}
        selectAuthor={selectAuthor}
        selectedAuthor={selectedAuthor}
        handleDrop={handleDrop}
        getSidebarItemDecorator={getSidebarItemDecorator}
      />
    </SidebarContent>
  </ModalSidebar>
)

export default AuthorsSidebar
