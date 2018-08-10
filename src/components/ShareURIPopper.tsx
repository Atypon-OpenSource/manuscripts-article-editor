import React from 'react'
import { altoGrey, dustyGrey, manuscriptsBlue } from '../colors'
import SuccessGreen from '../icons/success'
import { styled } from '../theme'
import { Button, PrimaryButton } from './Button'
import {
  Control,
  Main,
  PopperBodyContainer,
  RadioButton,
  ShareProjectHeader,
  ShareProjectTitle,
  TextHint,
} from './ShareProjectPopper'
import { TextField } from './TextField'

const URIFieldContainer = styled.div`
  display: flex;
  & ${TextField} {
    border-color: ${altoGrey};
    border-right: transparent;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  & ${Button} {
    color: ${manuscriptsBlue};
    border-color: ${altoGrey};
    border-width: thin;
    border-left: transparent;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  & ${Button}:active {
    color: ${dustyGrey};
    background-color: white;
    border-color: white;
  }
`

const SuccessCopiedMessage = styled.div`
  display: flex;
  padding: 8px;
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

export interface Props {
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
  <PopperBodyContainer>
    <ShareProjectHeader>
      <ShareProjectTitle>Share Project</ShareProjectTitle>
      <PrimaryButton>Link</PrimaryButton>
      <Button onClick={() => handleSwitching(true)}>Invite</Button>
    </ShareProjectHeader>
    <Main>
      {dataLoaded ? (
        <div>
          {isCopied ? (
            <SuccessCopiedMessage>
              <CopiedMessageContentContainer>
                <SuccessGreen />
                <CopiedMessageText>Link copied to clipboard.</CopiedMessageText>
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
              <Button onClick={() => handleCopy()}>COPY</Button>
            </URIFieldContainer>
          )}
          <TextHint>Anyone with the link can join as:</TextHint>
          <Control>
            <input
              name={'role'}
              type={'radio'}
              checked={selectedRole === 'Writer'}
              value={'Writer'}
              onChange={handleChange}
            />
            <RadioButton />
            Writer
            <TextHint>Can modify project contents</TextHint>
          </Control>
          <br />
          <Control>
            <input
              name={'role'}
              type={'radio'}
              checked={selectedRole === 'Viewer'}
              value={'Viewer'}
              onChange={handleChange}
            />
            <RadioButton />
            Viewer
            <TextHint>
              Can only review projects without
              <br />
              modifying it
            </TextHint>
          </Control>
        </div>
      ) : (
        <div>Thinking...</div>
      )}
    </Main>
  </PopperBodyContainer>
)
