import React from 'react'
import { altoGrey, dustyGrey, manuscriptsBlue } from '../colors'
import AttentionError from '../icons/attention-error'
import SuccessGreen from '../icons/success'
import { getUserRole, ProjectRole } from '../lib/roles'
import { styled } from '../theme'
import { Project, UserProfile } from '../types/components'
import { Button, ManuscriptBlueButton, TransparentGreyButton } from './Button'
import { ShareProjectHeader, ShareProjectTitle } from './InvitationPopper'
import { PopperBody } from './Popper'
import { RadioButton } from './RadioButton'
import { TextField } from './TextField'

const URIFieldContainer = styled.div`
  display: flex;
  margin-bottom: 21px;

  & ${TextField} {
    border-color: ${altoGrey};
    border-right: transparent;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    width: 78%;
  }

  & ${Button} {
    color: ${manuscriptsBlue};
    border-color: ${altoGrey};
    border-width: thin;
    border-left: transparent;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    width: 22%;
  }

  & ${Button}:active {
    color: ${dustyGrey};
    background-color: white;
  }
`

const SuccessCopiedMessage = styled.div`
  display: flex;
  padding: 8px 25px;
  margin-bottom: 21px;
  border-radius: 6px;
  background-color: #dff0d7;
  border: solid 1px #d6e9c5;
  align-items: center;
  flex: 1;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.34;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  color: #3a773a;
  white-space: normal;
`

const ErrorMessage = styled.div`
  display: flex;
  padding: 8px 25px;
  margin-bottom: 21px;
  border-radius: 6px;
  background-color: #fff1f0;
  border: solid 1px #f5c1b7;
  align-items: center;
  flex: 1;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.34;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  color: #dc5030;
  white-space: normal;
`

const MessageText = styled.div`
  display: flex;
  align-items: center;
  margin-left: 8px;
`

const LinkButton = styled(ManuscriptBlueButton)`
  width: 70px;
  text-transform: none;
`

const InviteButton = styled(TransparentGreyButton)`
  width: 70px;
  text-transform: none;
`

export const MiniText = styled.span`
  font-size: 14px;
  letter-spacing: -0.3px;
  text-align: left;
  color: ${dustyGrey};
  clear: both;
  display: block;
  margin-bottom: 11px;
`

const OKText = styled.div`
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 8px;
`

interface Props {
  dataLoaded: boolean
  URI: string
  selectedRole: string
  isCopied: boolean
  user: UserProfile
  project: Project
  handleChange: (event: React.FormEvent<HTMLInputElement>) => void
  handleCopy: () => void
  handleSwitching: (isInvite: boolean) => void
}

export const ShareURIPopper: React.SFC<Props> = ({
  dataLoaded,
  URI,
  selectedRole,
  isCopied,
  user,
  project,
  handleChange,
  handleCopy,
  handleSwitching,
}) => {
  const isOwner = getUserRole(project, user.userID) === ProjectRole.owner

  return (
    <PopperBody>
      <ShareProjectHeader>
        <ShareProjectTitle>Share Project</ShareProjectTitle>
        <div>
          <LinkButton>Link</LinkButton>
          <InviteButton onClick={() => handleSwitching(true)}>
            Invite
          </InviteButton>
        </div>
      </ShareProjectHeader>
      {!isOwner || dataLoaded ? (
        <React.Fragment>
          {!isOwner ? (
            <ErrorMessage>
              <AttentionError />
              <MessageText>
                Only project owners can share links to the document.
              </MessageText>
            </ErrorMessage>
          ) : (
            <React.Fragment>
              {isCopied ? (
                <SuccessCopiedMessage>
                  <SuccessGreen />
                  <MessageText>Link copied to clipboard.</MessageText>
                  <OKText onClick={handleCopy}>OK</OKText>
                </SuccessCopiedMessage>
              ) : (
                <URIFieldContainer>
                  <TextField
                    name={'url'}
                    type={'text'}
                    disabled={true}
                    value={URI}
                    style={{ backgroundColor: 'white' }}
                  />
                  <Button onClick={handleCopy}>COPY</Button>
                </URIFieldContainer>
              )}
            </React.Fragment>
          )}
          <MiniText>Anyone with the link can join as:</MiniText>
          <RadioButton
            name={'role'}
            checked={selectedRole === 'Writer'}
            value={'Writer'}
            disabled={isCopied || !isOwner}
            textHint={'Can modify project contents'}
            onChange={handleChange}
          >
            Writer
          </RadioButton>
          <RadioButton
            name={'role'}
            checked={selectedRole === 'Viewer'}
            value={'Viewer'}
            disabled={isCopied || !isOwner}
            textHint={'Can only review projects without modifying it'}
            onChange={handleChange}
          >
            Viewer
          </RadioButton>
        </React.Fragment>
      ) : (
        <div>Thinking...</div>
      )}
    </PopperBody>
  )
}
