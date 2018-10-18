import React from 'react'
import { altoGrey, dustyGrey, manuscriptsBlue } from '../../colors'
import { isOwner } from '../../lib/roles'
import { styled } from '../../theme'
import { Project, UserProfile } from '../../types/models'
import AlertMessage, { AlertMessageType } from '../AlertMessage'
import { Button, ManuscriptBlueButton, TransparentGreyButton } from '../Button'
import { PopperBody } from '../Popper'
import { RadioButton } from '../RadioButton'
import { TextField } from '../TextField'
import { ShareProjectHeader, ShareProjectTitle } from './InvitationPopper'

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

const ClickableText = styled.div`
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 8px;
`

interface ShareURIFieldProps {
  isCopied: boolean
  URI: string
  handleCopy: () => void
}

const ShareURIField: React.SFC<ShareURIFieldProps> = ({
  isCopied,
  handleCopy,
  URI,
}) => (
  <React.Fragment>
    {isCopied ? (
      <AlertMessageContainer>
        <AlertMessage type={AlertMessageType.success} hideCloseButton={true}>
          Link copied to clipboard.
          <ClickableText onClick={handleCopy}>OK</ClickableText>
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

const ShareURIForm: React.SFC<FormProps> = ({
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
  loadingURIError,
}) => {
  const isProjectOwner = isOwner(project, user.userID)

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
      {!isProjectOwner || dataLoaded ? (
        <React.Fragment>
          {!isProjectOwner ? (
            <AlertMessageContainer>
              <AlertMessage
                type={AlertMessageType.error}
                hideCloseButton={true}
              >
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
        <div>Thinking...</div>
      )}
    </PopperBody>
  )
}
