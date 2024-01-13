/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2023 Atypon Systems LLC. All Rights Reserved.
 */
import { ButtonGroup, TextButton } from '@manuscripts/style-guide'
import {
  CHANGE_STATUS,
  NodeAttrChange,
  trackCommands,
} from '@manuscripts/track-changes-plugin'
import { Command } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React, { useCallback } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import EditIcon from '../components/projects/icons/EditIcon'
import { filterAttrsChange } from '../lib/attrs-change-filter'
import { useStore } from '../store'
import { ThemeProvider } from '../theme/ThemeProvider'

export const useExecCmd = () => {
  const [storeView] = useStore((store) => store.view)
  return (cmd: Command, hookView?: EditorView) => {
    const view = storeView || hookView
    cmd(view.state, view.dispatch)
  }
}

export default () => {
  const [{ selectedAttrsChange, popper, trackState }, dispatch] = useStore(
    (store) => ({
      selectedAttrsChange: store.selectedAttrsChange,
      popper: store.popper,
      trackState: store.trackState,
    })
  )

  const execCmd = useExecCmd()

  const cleanSelectedChange = useCallback(() => {
    const previousSelection = document.querySelector(`.track-attrs-popper`)
    previousSelection && ReactDOM.unmountComponentAtNode(previousSelection)
    popper.destroy()
    document
      .querySelector('.attrs-popper-button-active')
      ?.classList.replace('attrs-popper-button-active', 'attrs-popper-button')
    dispatch({ selectedAttrsChange: undefined })
  }, [dispatch, popper])

  const renderAttrsChangePopper = useCallback(
    (changeId: string, attrTrackingButton: HTMLButtonElement) => {
      if (!trackState) {
        return
      }

      attrTrackingButton.classList.replace(
        'attrs-popper-button',
        'attrs-popper-button-active'
      )

      const { newAttrs, oldAttrs } = filterAttrsChange(
        trackState.changeSet.get(changeId) as NodeAttrChange
      )

      const popperContainer = document.createElement('div')
      popperContainer.className = 'track-attrs-popper'
      ReactDOM.render(
        <ThemeProvider>
          <TrackAttrsPopperContent
            newAttrs={newAttrs}
            oldAttrs={oldAttrs}
            changeId={changeId}
            updateState={(cmd) => {
              cleanSelectedChange()
              execCmd(cmd)
            }}
          />
        </ThemeProvider>,
        popperContainer
      )
      popper.show(attrTrackingButton, popperContainer)
      dispatch({ selectedAttrsChange: changeId })
    },
    [trackState, popper, dispatch, cleanSelectedChange, execCmd]
  )

  return useCallback(
    (e: React.MouseEvent) => {
      const attrTrackingButton = (e.target as HTMLElement).closest(
        '.attrs-popper-button,.attrs-popper-button-active'
      ) as HTMLButtonElement | null

      cleanSelectedChange()

      if (attrTrackingButton) {
        const changeId = attrTrackingButton.value

        if (selectedAttrsChange !== changeId) {
          renderAttrsChangePopper(changeId, attrTrackingButton)
        } else {
          dispatch({ selectedAttrsChange: undefined })
        }
      }
    },
    [
      cleanSelectedChange,
      dispatch,
      renderAttrsChangePopper,
      selectedAttrsChange,
    ]
  )
}

export const TrackAttrsPopperContent: React.FC<{
  newAttrs: Record<string, { label: string; value: string }>
  oldAttrs: Record<string, { label: string; value: string }>
  changeId: string
  updateState: (cmd: Command) => void
}> = ({ newAttrs, oldAttrs, changeId, updateState }) => {
  const approveChange = () => {
    updateState(
      trackCommands.setChangeStatuses(CHANGE_STATUS.accepted, [changeId])
    )
  }

  const rejectChange = () => {
    updateState(
      trackCommands.setChangeStatuses(CHANGE_STATUS.rejected, [changeId])
    )
  }

  return (
    <>
      <Header>
        <LabelContainer>
          <EditIcon />
          <Label>Changed</Label>
        </LabelContainer>
        <ButtonGroup>
          <RejectButton onClick={rejectChange}>Reject</RejectButton>
          <TrackChangesButton onClick={approveChange}>
            Approve
          </TrackChangesButton>
        </ButtonGroup>
      </Header>

      <ChangesList>
        {Object.entries(oldAttrs).map(([key], index) => (
          <Attribute key={index}>
            <AttributeLabel>{oldAttrs[key].label}:</AttributeLabel>
            {newAttrs[key].value &&
              oldAttrs[key].value !== newAttrs[key].value && (
                <OldAttribute>{oldAttrs[key].value}</OldAttribute>
              )}
            <AttributeValue>
              {newAttrs[key].value || oldAttrs[key].value}
            </AttributeValue>
          </Attribute>
        ))}
      </ChangesList>
    </>
  )
}

export const TrackChangesButton = styled(TextButton)`
  font-size: ${(props) => props.theme.font.size.normal};
  color: ${(props) => props.theme.colors.text.tertiary};
  text-decoration: underline;
  margin-right: ${(props) => props.theme.grid.unit * 2}px;

  &:hover,
  &:focus {
    color: ${(props) => props.theme.colors.text.tertiary} !important;
  }
`

const RejectButton = styled(TrackChangesButton)`
  color: ${(props) => props.theme.colors.text.secondary};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`

const Label = styled.div`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.font.size.medium};
  font-weight: ${(props) => props.theme.font.weight.normal};
  line-height: ${(props) => props.theme.font.lineHeight.large};
  font-style: normal;
  padding: 2px;
`

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
`

const Attribute = styled.div`
  padding: ${(props) => props.theme.grid.unit * 3}px;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.background.fifth};
  }
`

const AttributeLabel = styled.div`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.font.size.small};
  font-weight: ${(props) => props.theme.font.weight.bold};
  font-style: normal;
  line-height: 16px;
`

const AttributeValue = styled(AttributeLabel)`
  font-weight: ${(props) => props.theme.font.weight.normal};
`

const OldAttribute = styled(AttributeValue)`
  text-decoration: line-through;
`

const ChangesList = styled.div`
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 4}px;
  max-height: ${(props) => props.theme.grid.unit * 124}px;
  background: ${(props) => props.theme.colors.background.secondary};
  overflow-y: scroll;
  overflow-x: hidden;
`
