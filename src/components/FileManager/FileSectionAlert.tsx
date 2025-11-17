/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2024 Atypon Systems LLC. All Rights Reserved.
 */
import {
  AlertMessage,
  AlertMessageType,
  FileUnknownIcon,
} from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

import { FileContainer } from './FileContainer'
import { FileSectionType } from './FileManager'
import { FileNameText } from './FileName'

export enum FileSectionAlertType {
  NONE,
  UPLOAD_IN_PROGRESS,
  UPLOAD_SUCCESSFUL,
  UPLOAD_ERROR,
  MOVE_SUCCESSFUL,
  REPLACE_SUCCESSFUL,
}

export const setUploadProgressAlert =
  (
    setAlert: (t: { type: FileSectionAlertType; message: string }) => void,
    type: FileSectionType
  ) =>
  (percentage: number) => {
    if (percentage < 99) {
      setAlert({
        type: FileSectionAlertType.UPLOAD_IN_PROGRESS,
        message: type + ` ${percentage}%`,
      })
    }
  }

export const FileSectionAlert: React.FC<{
  alert: { type: FileSectionAlertType; message: string }
}> = ({ alert }) => {
  return (
    <>
      {alert.type === FileSectionAlertType.UPLOAD_IN_PROGRESS && (
        <FileUploadInProgressAlert name={alert.message} />
      )}
      {alert.type === FileSectionAlertType.UPLOAD_SUCCESSFUL && (
        <FileUploadSuccessful />
      )}
      {alert.type === FileSectionAlertType.UPLOAD_ERROR && (
        <FileUploadErrorAlert message={alert.message} />
      )}
      {alert.type === FileSectionAlertType.MOVE_SUCCESSFUL && (
        <FileMoveSuccessful name={alert.message} />
      )}
      {alert.type === FileSectionAlertType.REPLACE_SUCCESSFUL && (
        <FileReplaceSuccessful name={alert.message} />
      )}
    </>
  )
}

const FileUploadInProgressAlert: React.FC<{
  name: string
}> = ({ name }) => {
  return (
    <FileUploadContainer>
      <FileUnknownIcon />
      <FileUploadNameContainer>
        <UploadFileNameText>{name}</UploadFileNameText>
        <FileUploadProgressBar />
      </FileUploadNameContainer>
    </FileUploadContainer>
  )
}

const FileUploadSuccessful: React.FC = () => {
  return (
    <AlertMessageContainer>
      <AlertMessage
        type={AlertMessageType.success}
        hideCloseButton={true}
        dismissButton={{
          text: 'OK',
        }}
      >
        File uploaded successfully
      </AlertMessage>
    </AlertMessageContainer>
  )
}

const FileUploadErrorAlert: React.FC<{
  message: string
}> = ({ message }) => {
  return (
    <AlertMessageContainer>
      <AlertMessage
        type={AlertMessageType.error}
        hideCloseButton={true}
        dismissButton={{
          text: 'OK',
        }}
      >
        Upload failed: {message}
      </AlertMessage>
    </AlertMessageContainer>
  )
}

const FileMoveSuccessful: React.FC<{
  name: string
}> = ({ name }) => {
  return (
    <AlertMessageContainer>
      <AlertMessage
        type={AlertMessageType.success}
        hideCloseButton={true}
        dismissButton={{
          text: 'OK',
        }}
      >
        File moved to {name}
      </AlertMessage>
    </AlertMessageContainer>
  )
}

const FileReplaceSuccessful: React.FC<{
  name: string
}> = ({ name }) => {
  return (
    <AlertMessageContainer>
      <AlertMessage
        type={AlertMessageType.success}
        hideCloseButton={true}
        dismissButton={{
          text: 'OK',
        }}
      >
        File replaced with {name} successfully
      </AlertMessage>
    </AlertMessageContainer>
  )
}

const AlertMessageContainer = styled.div`
  margin-left: 16px;
  margin-right: 16px;
`

const FileUploadContainer = styled(FileContainer)`
  background: #f2fbfc;
`

const FileUploadNameContainer = styled.div`
  flex-grow: 1;
  margin-left: 8px;
`

const UploadFileNameText = styled(FileNameText)`
  margin: 0;
`

const FileUploadProgressBar: React.FC = () => {
  return (
    <LinearProgress>
      <Bar className="bar1"></Bar>
      <Bar className="bar2"></Bar>
    </LinearProgress>
  )
}

const LinearProgress = styled.div`
  background: ${(props) => props.theme.colors.background.tertiary};
  opacity: 0.7;
  height: 4px;
  position: relative;
  width: 100%;
  margin: 8px auto 0;
  overflow: hidden;
  border-radius: 8px;
  animation: start 0.3s ease-in;
`
const Bar = styled.div`
  position: absolute;
  opacity: 0.7;
  background: #1a9bc7;
  transition: transform 0.2s linear;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;

  &.bar1 {
    animation:
      growBar1 2.5s infinite,
      moveBar1 2.5s infinite;
  }

  &.bar2 {
    animation:
      growBar2 2.5s infinite,
      moveBar2 2.5s infinite;
  }

  @keyframes growBar1 {
    0% {
      animation-timing-function: linear;
      transform: scaleX(0.1);
    }
    35% {
      animation-timing-function: cubic-bezier(0.3, 0.1, 0.7, 1);
      transform: scaleX(0.1);
    }
    70% {
      animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1.4);
      transform: scaleX(0.8);
    }
    100% {
      transform: scaleX(0.1);
    }
  }

  @keyframes moveBar1 {
    0% {
      left: -105%;
      animation-timing-function: linear;
    }
    20% {
      left: -105%;
      animation-timing-function: cubic-bezier(0.5, 0, 0.7, 0.4);
    }
    60% {
      left: 21%;
      animation-timing-function: cubic-bezier(0.3, 0.4, 0.55, 0.9);
    }
    80% {
      left: 40%;
      animation-timing-function: cubic-bezier(0.1, 0.2, 0.3, 0.95);
    }
    100% {
      left: 90%;
    }
  }

  @keyframes growBar2 {
    0% {
      animation-timing-function: cubic-bezier(0.2, 0, 0.5, 0.4);
      transform: scaleX(0.1);
    }
    20% {
      animation-timing-function: cubic-bezier(0.1, 0.2, 0.6, 1);
      transform: scaleX(0.3);
    }
    60% {
      animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1.4);
      transform: scaleX(0.6);
    }
    100% {
      transform: scaleX(0.1);
    }
  }
  @keyframes moveBar2 {
    0% {
      left: -100%;
      animation-timing-function: cubic-bezier(0.15, 0, 0.5, 0.4);
    }
    25% {
      left: -50%;
      animation-timing-function: cubic-bezier(0.3, 0.3, 0.8, 0.7);
    }
    50% {
      left: 45%;
      animation-timing-function: cubic-bezier(0.1, 0.6, 0.6, 0.9);
    }
    100% {
      left: 95%;
    }
  }
`
