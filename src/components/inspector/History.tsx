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

import EditIcon from '@manuscripts/assets/react/AnnotationEdit'
import {
  Project,
  Snapshot,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import {
  Avatar,
  PrimaryButton,
  TextField,
  TextFieldWrapper,
} from '@manuscripts/style-guide'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { useHistory } from '../../hooks/use-history'
import {
  SaveSnapshotStatus,
  useSnapshotManager,
} from '../../hooks/use-snapshot-manager'
import { avatarURL } from '../../lib/user'
import { AddButton } from '../AddButton'
import { FormattedDateTime } from '../FormattedDateTime'
import { NotificationContext } from '../NotificationProvider'

const SnapshotComponentContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: start;
  padding: 16px 24px;

  &::after {
    content: ' ';
    position: absolute;
    left: 33px;
    top: 42px;
    bottom: 0;
    border-left: 1px solid ${(props) => props.theme.colors.border.secondary};
  }
`

const SnapshotComponentContainerInner = styled.div`
  flex-grow: 1;
  margin-left: 8px;
`

const TitleLine = styled.p`
  margin-top: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const Title = styled.span`
  font-weight: 700;
  flex-grow: 1;
`

const EditIconStyled = styled(EditIcon)`
  path {
    fill: ${(props) => props.theme.colors.brand.medium};
  }
`

const ErrorStatus = styled.div`
  color: ${(props) => props.theme.colors.text.error};
  font-size: 0.8rem;
`

const Form = styled.form`
  border-color: ${(props) => props.theme.colors.border.primary} !important;
  border-top: 1px solid;
  border-bottom: 1px solid;
  background: ${(props) => props.theme.colors.background.info};
`

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

const ListItem = styled.li`
  position: relative;
`

const AddButtonWrapper = styled.div`
  padding: 16px 24px;
`

const ViewLink = styled(Link)`
  color: ${(props) => props.theme.colors.text.tertiary};
  text-decoration: none;

  &&::after {
    content: ' ';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`

interface SnapshotProps {
  date: number
  userId?: string
  onSwitchSnapshot?: () => void
}

const SnapshotComponent: React.FC<SnapshotProps> = ({
  userId,
  date,
  children,
  onSwitchSnapshot,
}) => {
  return (
    <SnapshotComponentContainer>
      <Avatar size={20} src={avatarURL(userId)} />
      <SnapshotComponentContainerInner>
        <TitleLine>
          <Title>
            {date ? (
              <FormattedDateTime date={date} />
            ) : (
              <span>New Snapshot</span>
            )}
          </Title>
          {onSwitchSnapshot && (
            <ViewLink
              to="#"
              onClick={(e) => {
                e.preventDefault()
                onSwitchSnapshot && onSwitchSnapshot()
              }}
            >
              View
            </ViewLink>
          )}
        </TitleLine>
        {children}
      </SnapshotComponentContainerInner>
    </SnapshotComponentContainer>
  )
}

interface Props {
  project: Project
  manuscriptID: string
  snapshotsList: Snapshot[]
  requestTakeSnapshot?: () => void
  isCreateFormOpen?: boolean
  submitName?: (e: React.SyntheticEvent) => void
  textFieldValue?: string
  handleTextFieldChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  status?: SaveSnapshotStatus
  currentUserId: string
  onSwitchSnapshot: (snapshot: Snapshot) => void
}

export const HistoryPanel: React.FC<Props> = ({
  project,
  manuscriptID,
  snapshotsList,
  requestTakeSnapshot,
  isCreateFormOpen = false,
  submitName,
  handleTextFieldChange,
  textFieldValue = '',
  status,
  currentUserId,
  onSwitchSnapshot,
}) => {
  return (
    <div>
      {requestTakeSnapshot && (
        <AddButtonWrapper>
          <AddButton
            action={requestTakeSnapshot}
            size="medium"
            title="New Version"
          />
        </AddButtonWrapper>
      )}

      {isCreateFormOpen && (
        <Form onSubmit={submitName}>
          <SnapshotComponent date={0} userId={currentUserId}>
            <TextFieldWrapper leftIcon={<EditIconStyled />}>
              <TextField
                value={textFieldValue}
                onChange={handleTextFieldChange}
                id="snapshot-name"
                placeholder="Add Title"
              />
            </TextFieldWrapper>
            {!!status && status === SaveSnapshotStatus.Error && (
              <React.Fragment>
                <ErrorStatus>
                  <span>There was an error saving your snapshot.</span>
                </ErrorStatus>
                <PrimaryButton mini={true} onClick={requestTakeSnapshot}>
                  Retry
                </PrimaryButton>
              </React.Fragment>
            )}
          </SnapshotComponent>
        </Form>
      )}

      <List>
        {snapshotsList.map((item) => (
          <ListItem key={item._id}>
            <SnapshotComponent
              date={item.createdAt}
              userId={item.creator}
              onSwitchSnapshot={() => onSwitchSnapshot(item)}
            >
              <p>{item.name}</p>
            </SnapshotComponent>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

interface ContainerProps {
  project: Project
  manuscriptID: string
  getCurrentUser: () => UserProfile
}

export const HistoryPanelContainer: React.FC<ContainerProps> = ({
  project,
  manuscriptID,
  getCurrentUser,
}) => {
  const { showNotification } = useContext(NotificationContext)
  const history = useHistory(project._id)
  const snapshotManager = useSnapshotManager(project, showNotification)

  const currentUserId = getCurrentUser()._id

  if (!history.snapshotsList) {
    return null
  }

  const isCreateFormOpen = snapshotManager.status !== SaveSnapshotStatus.Ready

  return (
    <HistoryPanel
      project={project}
      manuscriptID={manuscriptID}
      snapshotsList={history.snapshotsList}
      isCreateFormOpen={isCreateFormOpen}
      requestTakeSnapshot={snapshotManager.requestTakeSnapshot}
      submitName={snapshotManager.submitName}
      handleTextFieldChange={snapshotManager.handleTextChange}
      textFieldValue={snapshotManager.textValue}
      status={snapshotManager.status}
      currentUserId={currentUserId}
    />
  )
}
