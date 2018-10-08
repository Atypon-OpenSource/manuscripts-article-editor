import React from 'react'
import { altoGrey, dustyGrey, manuscriptsBlue } from '../colors'
import { getUserRole, ProjectRole } from '../lib/roles'
import { styled } from '../theme'
import { Project, UserProfile } from '../types/components'
import AlertMessage from './AlertMessage'
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

const AlertMessageContainer = styled.div`
  margin-bottom: 9px;
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

const RetryButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

interface Props {
  dataLoaded: boolean
  URI: string
  selectedRole: string
  isCopied: boolean
  user: UserProfile
  project: Project
  error: Error | null
  requestURI: () => void
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
  requestURI,
  handleChange,
  handleCopy,
  handleSwitching,
  error,
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
      <React.Fragment>
        {!isOwner || dataLoaded ? (
          <React.Fragment>
            {!isOwner ? (
              <AlertMessageContainer>
                <AlertMessage type={'warning'} hideCloseButton={true}>
                  Only project owners can share links to the document.
                </AlertMessage>
              </AlertMessageContainer>
            ) : (
              <React.Fragment>
                {!error ? (
                  <React.Fragment>
                    {isCopied ? (
                      <AlertMessageContainer>
                        <AlertMessage type={'success'} hideCloseButton={true}>
                          Link copied to clipboard.
                          <OKText onClick={handleCopy}>OK.</OKText>
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
                        <Button onClick={handleCopy}>COPY</Button>
                      </URIFieldContainer>
                    )}{' '}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <AlertMessageContainer>
                      <AlertMessage
                        type={'error'}
                        dismissButtonText={'Dismiss.'}
                        hideCloseButton={true}
                      >
                        {error.message}
                      </AlertMessage>
                    </AlertMessageContainer>
                    <RetryButtonContainer>
                      <ManuscriptBlueButton onClick={requestURI}>
                        Retry
                      </ManuscriptBlueButton>
                    </RetryButtonContainer>
                  </React.Fragment>
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
      </React.Fragment>
    </PopperBody>
  )
}
