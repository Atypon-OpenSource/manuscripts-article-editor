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

import { Project, UserProfile } from '@manuscripts/manuscripts-json-schema'
import {
  AlertMessage,
  AlertMessageType,
  ButtonGroup,
  SecondaryButton,
  TextField,
  ToggleButton,
} from '@manuscripts/style-guide'
import React from 'react'
import { isOwner } from '../../lib/roles'
import { styled } from '../../theme/styled-components'
import { PopperBody } from '../Popper'
import { RadioButton } from '../RadioButton'
import { ShareProjectHeader, ShareProjectTitle } from './InvitationPopper'

const URIFieldContainer = styled.div`
  border: 1px solid ${props => props.theme.colors.border.field.default};
  border-radius: ${props => props.theme.grid.radius.small};
  display: flex;
  flex: 1;
  margin-bottom: ${props => props.theme.grid.unit * 5}px;

  & ${TextField} {
    border: none;
  }

  & ${SecondaryButton} {
    border: none;
    color: ${props => props.theme.colors.brand.default};
  }
`

const AlertMessageContainer = styled.div`
  margin-bottom: ${props => props.theme.grid.unit * 2}px;
`

export const MiniText = styled.span`
  font-size: ${props => props.theme.font.size.normal};
  letter-spacing: -0.3px;
  text-align: left;
  color: ${props => props.theme.colors.text.secondary};
  clear: both;
  display: block;
  margin-bottom: ${props => props.theme.grid.unit * 3}px;
`

const ClickableText = styled.div`
  font-weight: ${props => props.theme.font.weight.semibold};
  text-decoration: underline;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: ${props => props.theme.grid.unit * 2}px;
`

interface ShareURIFieldProps {
  isCopied: boolean
  URI: string
  handleCopy: () => void
}

const ShareURIField: React.FunctionComponent<ShareURIFieldProps> = ({
  isCopied,
  handleCopy,
  URI,
}) => (
  <React.Fragment>
    {isCopied ? (
      <AlertMessageContainer>
        <AlertMessage
          type={AlertMessageType.success}
          dismissButton={{ text: 'OK', action: handleCopy }}
          hideCloseButton={true}
        >
          Link copied to clipboard.
        </AlertMessage>
      </AlertMessageContainer>
    ) : (
      <URIFieldContainer>
        <TextField
          name={'url'}
          type={'text'}
          disabled={true}
          value={URI}
          style={{ backgroundColor: 'white' }}
        />
        <SecondaryButton onClick={handleCopy}>COPY</SecondaryButton>
      </URIFieldContainer>
    )}
  </React.Fragment>
)

interface FormProps {
  selectedRole: string
  isCopied: boolean
  loadingURIError: Error | null
  isProjectOwner: boolean
  handleChange: (event: React.FormEvent<HTMLInputElement>) => void
}

const ShareURIForm: React.FunctionComponent<FormProps> = ({
  loadingURIError,
  selectedRole,
  isCopied,
  isProjectOwner,
  handleChange,
}) => (
  <React.Fragment>
    {!loadingURIError && (
      <React.Fragment>
        <MiniText>Anyone with the link can join as:</MiniText>
        <RadioButton
          name={'role'}
          checked={selectedRole === 'Writer'}
          value={'Writer'}
          disabled={isCopied || !isProjectOwner}
          textHint={'Can modify project contents'}
          onChange={handleChange}
        >
          Writer
        </RadioButton>
        <RadioButton
          name={'role'}
          checked={selectedRole === 'Viewer'}
          value={'Viewer'}
          disabled={isCopied || !isProjectOwner}
          textHint={'Can only review projects without modifying it'}
          onChange={handleChange}
        >
          Viewer
        </RadioButton>
      </React.Fragment>
    )}
  </React.Fragment>
)

interface Props {
  dataLoaded: boolean
  URI: string
  selectedRole: string
  isCopied: boolean
  user: UserProfile
  project: Project
  loadingURIError: Error | null
  requestURI: () => void
  handleChange: (event: React.FormEvent<HTMLInputElement>) => void
  handleCopy: () => void
  handleSwitching: (isInvite: boolean) => void
}

export const ShareURIPopper: React.FunctionComponent<Props> = ({
  dataLoaded,
  URI,
  selectedRole,
  isCopied,
  user,
  project,
  requestURI,
  handleChange,
  handleCopy,
  handleSwitching,
  loadingURIError,
}) => {
  const isProjectOwner = isOwner(project, user.userID)

  return (
    <PopperBody>
      <ShareProjectHeader>
        <ShareProjectTitle>Share Project</ShareProjectTitle>
        <ButtonGroup>
          <ToggleButton selected={true}>Link</ToggleButton>
          <ToggleButton onClick={() => handleSwitching(true)}>
            Invite
          </ToggleButton>
        </ButtonGroup>
      </ShareProjectHeader>
      {!isProjectOwner || dataLoaded ? (
        <React.Fragment>
          {!isProjectOwner ? (
            <AlertMessageContainer>
              <AlertMessage type={AlertMessageType.info} hideCloseButton={true}>
                Only project owners can share links to the document.
              </AlertMessage>
            </AlertMessageContainer>
          ) : (
            <React.Fragment>
              {loadingURIError ? (
                <AlertMessageContainer>
                  <AlertMessage
                    type={AlertMessageType.error}
                    hideCloseButton={true}
                  >
                    Retrieving sharing link failed.
                    <ClickableText onClick={requestURI}>Retry.</ClickableText>
                  </AlertMessage>
                </AlertMessageContainer>
              ) : (
                <ShareURIField
                  URI={URI}
                  isCopied={isCopied}
                  handleCopy={handleCopy}
                />
              )}
            </React.Fragment>
          )}
          <ShareURIForm
            isCopied={isCopied}
            isProjectOwner={isProjectOwner}
            handleChange={handleChange}
            selectedRole={selectedRole}
            loadingURIError={loadingURIError}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          {loadingURIError ? (
            <AlertMessageContainer>
              <AlertMessage
                type={AlertMessageType.error}
                hideCloseButton={true}
              >
                Retrieving sharing link failed.
                <ClickableText onClick={requestURI}>Retry.</ClickableText>
              </AlertMessage>
            </AlertMessageContainer>
          ) : (
            <div>Thinking...</div>
          )}
        </React.Fragment>
      )}
    </PopperBody>
  )
}
