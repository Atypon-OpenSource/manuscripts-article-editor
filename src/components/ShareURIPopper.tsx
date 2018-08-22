import React from 'react'
import { altoGrey, dustyGrey, manuscriptsBlue } from '../colors'
import SuccessGreen from '../icons/success'
import { styled } from '../theme'
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
  padding: 8px;
  margin-bottom: 21px;
  border-radius: 6px;
  background-color: #dff0d7;
  border: solid 1px #d6e9c5;
  align-items: center;
`

const CopiedMessageContentContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.34;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  color: #3a773a;
`

const CopiedMessageText = styled.div`
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
  handleChange: (event: React.FormEvent<HTMLInputElement>) => void
  handleCopy: () => void
  handleSwitching: (isInvite: boolean) => void
}

export const ShareURIPopper: React.SFC<Props> = ({
  dataLoaded,
  URI,
  selectedRole,
  isCopied,
  handleChange,
  handleCopy,
  handleSwitching,
}) => (
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
    {dataLoaded ? (
      <React.Fragment>
        {isCopied ? (
          <SuccessCopiedMessage>
            <CopiedMessageContentContainer>
              <SuccessGreen />
              <CopiedMessageText>Link copied to clipboard.</CopiedMessageText>
              <OKText onClick={handleCopy}>OK</OKText>
            </CopiedMessageContentContainer>
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
        <MiniText>Anyone with the link can join as:</MiniText>
        <RadioButton
          name={'role'}
          checked={selectedRole === 'Writer'}
          value={'Writer'}
          disabled={isCopied}
          textHint={'Can modify project contents'}
          onChange={handleChange}
        >
          Writer
        </RadioButton>
        <RadioButton
          name={'role'}
          checked={selectedRole === 'Viewer'}
          value={'Viewer'}
          disabled={isCopied}
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
