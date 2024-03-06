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
import React, {
  MutableRefObject,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from 'react'
import styled from 'styled-components'

import EditIcon from '../components/projects/icons/EditIcon'
import { filterAttrsChange } from '../lib/attrs-change-filter'
import { useStore } from '../store'
import _ from 'lodash'
import { useExecCmd } from './use-track-attrs-popper'
import { usePopper } from 'react-popper'
import {
  Accept,
  Reject,
} from '../components/track-changes/suggestion-list/Icons'

interface Props {
  changeId: string
  isVisible: boolean
  setVisible: (to: boolean) => void
}

type PropRef = HTMLElement

function isValidValue(val: any) {
  if (val || typeof val === 'boolean') {
    return true
  }
  return false
}

export const TrackModal = forwardRef<PropRef, Props>((props, ref) => {
  const { changeId, isVisible, setVisible } = props
  const [{ selectedAttrsChange, trackState, files }, dispatch] = useStore(
    (store) => ({
      selectedAttrsChange: store.selectedAttrsChange,
      popper: store.popper,
      trackState: store.trackState,
      files: store.files,
    })
  )

  const execCmd = useExecCmd()

  useEffect(() => {
    if (selectedAttrsChange == changeId) {
      dispatch({ selectedAttrsChange: undefined })
    }
  }, [dispatch, changeId, selectedAttrsChange])

  const inputRef = ref as MutableRefObject<HTMLInputElement>

  const offset = -(inputRef.current.getBoundingClientRect().width + 40)

  const virtualReference = useMemo(() => {
    return {
      getBoundingClientRect() {
        const original = inputRef.current.getBoundingClientRect()
        const rectLike = {} as Mutable<DOMRect>
        for (const x in original) {
          const k = x as keyof DOMRect
          // @ts-ignore
          rectLike[k] = original[k]
        }
        rectLike.top -= rectLike.height
        return rectLike
      },
    }
  }, [inputRef])

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>()
  const { styles, attributes } = usePopper(virtualReference, popperElement, {
    strategy: 'fixed',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [offset, 0], // Adjust the offset as needed
        },
      },
    ],
  })

  useEffect(() => {
    const captureOutside = (e: MouseEvent) => {
      if (
        e.target &&
        !popperElement?.contains(e.target as Node) &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setVisible(false)
      }
    }
    document.addEventListener('click', captureOutside)
    return () => {
      document.removeEventListener('click', captureOutside)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!trackState || !isVisible) {
    return null
  }

  const change = trackState.changeSet.get(changeId)

  if (change?.type !== 'node-attr-change') {
    return null
  }

  const { newAttrs, oldAttrs } = filterAttrsChange(
    change as NodeAttrChange,
    files
  )
  const approveChange = () => {
    execCmd(trackCommands.setChangeStatuses(CHANGE_STATUS.accepted, [changeId]))
  }

  const rejectChange = () => {
    execCmd(trackCommands.setChangeStatuses(CHANGE_STATUS.rejected, [changeId]))
  }

  return (
    <div
      ref={setPopperElement}
      style={{ zIndex: 100, ...styles.popper }}
      {...attributes.popper}
    >
      <TrackModalWrapper data-cy="suggestion-details-modal">
        <Header>
          <LabelContainer>
            <EditIcon />
            <Label>Changed</Label>
          </LabelContainer>
          <ButtonGroup>
            <RejectButton onClick={rejectChange}>
              <Reject color="#353535" />
            </RejectButton>
            <TrackChangesButton onClick={approveChange}>
              <Accept color="#353535" />
            </TrackChangesButton>
          </ButtonGroup>
        </Header>

        <ChangesList>
          {Object.entries(newAttrs).map(([key], index) =>
            isValidValue(newAttrs[key].value) &&
            (!oldAttrs[key] ||
              !_.isEqual(oldAttrs[key].value, newAttrs[key].value)) ? (
              <Attribute key={index}>
                <AttributeLabel>{newAttrs[key].label}:</AttributeLabel>
                {oldAttrs[key]?.value ? (
                  <div>
                    <DeleteLabel>Delete: </DeleteLabel>
                    <OldAttribute>{oldAttrs[key].value}</OldAttribute>
                  </div>
                ) : null}
                <div>
                  <InsertLabel>Insert: </InsertLabel>
                  <AttributeValue>
                    {newAttrs[key].value || oldAttrs[key].value}
                  </AttributeValue>
                </div>
              </Attribute>
            ) : null
          )}
        </ChangesList>
      </TrackModalWrapper>
    </div>
  )
})

export default TrackModal

const InsertLabel = styled.span`
  color: #36b260;
`
const DeleteLabel = styled.span`
  color: #f35143;
`

const TrackModalWrapper = styled.div`
  width: 368px;
  min-height: 136px:
  max-height: 380px;
  border-radius: ${(props) => props.theme.grid.radius.default};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  background: ${(props) => props.theme.colors.background.primary};
`

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
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.06);
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

const AttributeLabel = styled.span`
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
  overflow: auto;
`
