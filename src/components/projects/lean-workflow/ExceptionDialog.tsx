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
import {
  AlertMessage,
  AlertMessageType,
  Category,
  Dialog,
  errorsDecoder,
  TertiaryButton,
} from '@manuscripts/style-guide'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useSetTaskOnHold } from '../../../lib/lean-workflow-gql'
import { Loading, LoadingOverlay } from '../../Loading'
import { UserContext } from './provider/UserProvider'

export const ExceptionDialog: React.FC<{
  errorCode: string
}> = ({ errorCode }) => {
  const setTaskOnHold = useSetTaskOnHold()
  const [toggleDialog, setToggleDialog] = useState(true)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<undefined | AlertMessageType>(undefined)
  const { lwUser, submissionId } = useContext(UserContext)
  const { title, description } = errorsDecoder(errorCode)

  const onCloseClick = useCallback(() => {
    setToggleDialog(false)
  }, [])

  const onAssignClick = useCallback(async () => {
    setLoading(true)
    return await setTaskOnHold({ submissionId, errorCode })
      .then(({ data }) => {
        if (data?.setTaskOnHold) {
          setAlert(AlertMessageType.success)
        } else {
          setAlert(AlertMessageType.error)
        }
        setLoading(false)
      })
      .catch(() => {
        setAlert(AlertMessageType.error)
        setLoading(false)
      })
  }, [setTaskOnHold, submissionId, errorCode])

  const dialogMessages = useMemo(
    () =>
      lwUser.role.id === 'pe'
        ? {
            header: title,
            message: description,
            secondaryMessage:
              'Take care of the reported issue to unblock the process.',
            actions: {
              primary: {
                action: onAssignClick,
                title: 'Assign to me',
              },
              secondary: {
                action: onCloseClick,
                title: 'Cancel',
              },
            },
          }
        : {
            header: title,
            message: description,
            secondaryMessage:
              'If the problem persists, please assign the task to the Production Editor to take care of the issue.',
            actions: {
              primary: {
                action: onAssignClick,
                title: 'Assign',
              },
              secondary: {
                action: onCloseClick,
                title: 'Close',
              },
            },
          },
    [lwUser.role.id, onAssignClick, onCloseClick, title, description]
  )

  return (
    <>
      {(loading && (
        <LoadingOverlay>
          <Loading>Assigning task to the Production Editor…</Loading>
        </LoadingOverlay>
      )) ||
        (alert && (
          <AlertWrapper>
            <AlertMessage type={alert}>
              {(alert === AlertMessageType.success &&
                'The task was successfully assigned to the Production Editor') ||
                'Un able to assign task to the Production Editor'}
            </AlertMessage>
          </AlertWrapper>
        )) || (
          <Dialog
            isOpen={toggleDialog}
            category={Category.error}
            header={dialogMessages.header}
            message={dialogMessages.message}
            actions={dialogMessages.actions}
          >
            <SecondaryMessage>
              {dialogMessages.secondaryMessage}
              {lwUser.role.id === 'pe' && (
                <TextButton>Contact support</TextButton>
              )}
            </SecondaryMessage>
          </Dialog>
        )}
    </>
  )
}

const SecondaryMessage = styled.div`
  word-wrap: break-word;
  margin: ${(props) => props.theme.grid.unit * 2}px 0;
  font: ${(props) => props.theme.font.weight.normal}
    ${(props) => props.theme.font.size.medium} / 1
    ${(props) => props.theme.font.family.sans};
  color: ${(props) => props.theme.colors.text.secondary};
  line-height: 1.5;
`

// TODO:: move this to style-guide as we use it for dashboard
const TextButton = styled(TertiaryButton)`
  &:not([disabled]):hover,
  &:not([disabled]):focus {
    border-color: transparent;
    background: transparent;
    color: ${(props) => props.theme.colors.brand.dark};
  }
  padding: 0;
  width: 100%;
  justify-content: start;
  font-size: ${(props) => props.theme.font.size.medium};
  text-decoration: underline;
`

const AlertWrapper = styled.div`
  position: fixed;
  z-index: 10;
  margin: 0 ${(props) => props.theme.grid.unit * 20}px
    ${(props) => props.theme.grid.unit * 11}px
    ${(props) => props.theme.grid.unit * 20}px;
  bottom: 0;
  right: 0;
  left: 0;
`
