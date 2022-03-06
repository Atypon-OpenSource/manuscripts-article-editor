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
import { Snapshot } from '@manuscripts/manuscripts-json-schema'
import { Avatar, SecondaryButton } from '@manuscripts/style-guide'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { useDropdown } from '../../hooks/use-dropdown'
import { avatarURL } from '../../lib/user'
import { FormattedDateTime } from '../FormattedDateTime'
import {
  Dropdown,
  DropdownButtonContainer,
  DropdownContainer,
  DropdownToggle,
} from '../nav/Dropdown'

interface SnapProps {
  snapshots: Array<Snapshot>
  selectSnapshot: (snapshot: Snapshot) => void
  selectedSnapshot: Snapshot
  selectedSnapshotURL: string
}

export const SnapshotsDropdown: React.FC<SnapProps> = ({
  snapshots,
  selectSnapshot,
  selectedSnapshot,
  selectedSnapshotURL,
}) => {
  const { wrapperRef, toggleOpen, isOpen } = useDropdown()

  return (
    <SnapshotContainer>
      <DropdownContainer id={'snapshots-dropdown'} ref={wrapperRef}>
        <DropdownButtonContainer
          onClick={toggleOpen}
          isOpen={isOpen}
          className={'dropdown-toggle'}
        >
          <Container>
            <AvatarContainer>
              <Avatar size={20} src={avatarURL(selectedSnapshot.creator)} />
            </AvatarContainer>
            <InnerContainer>
              <Text>
                {selectedSnapshot.name}
                {selectedSnapshot._id == snapshots[0]._id && ' (Current)'}
                <DropdownToggle className={isOpen ? 'open' : ''} />
              </Text>

              <Date>
                <FormattedDateTime date={selectedSnapshot.createdAt} />{' '}
              </Date>
            </InnerContainer>
          </Container>
        </DropdownButtonContainer>
        {isOpen && (
          <SnapshotsList top={25} direction={'left'} minWidth={100}>
            {snapshots.map((snapshot) => {
              return (
                <Element
                  onClick={() => {
                    selectSnapshot(snapshot)
                    toggleOpen()
                  }}
                  key={snapshot._id}
                  disabled={true}
                >
                  <Container>
                    <AvatarContainer>
                      <Avatar size={20} src={avatarURL(snapshot.creator)} />
                    </AvatarContainer>
                    <InnerContainer>
                      <Text>
                        {snapshot.name}{' '}
                        {snapshot._id == snapshots[0]._id && ' (Current)'}{' '}
                      </Text>

                      <Date>
                        <FormattedDateTime date={snapshot.createdAt} />{' '}
                      </Date>
                    </InnerContainer>
                  </Container>
                </Element>
              )
            })}
          </SnapshotsList>
        )}
      </DropdownContainer>
      <ViewLink to={selectedSnapshotURL}>View</ViewLink>
    </SnapshotContainer>
  )
}
const Container = styled.div`
  display: flex;
`
const InnerContainer = styled.div`
  display: block;
  text-align: left;
  margin-left: 8px;
`
const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: ${(props) => props.theme.grid.unit}px;
`
const SnapshotsList = styled(Dropdown)`
  display: block;
  overflow: auto;
  padding: ${(props) => props.theme.grid.unit * 2}px 0;
`
const Element = styled(SecondaryButton)`
  background: ${(props) => props.theme.colors.background.primary} !important;
  display: flex;
  padding: ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 6}px;
  white-space: nowrap;
  border: none;
  &:not([disabled]):hover {
    background: ${(props) => props.theme.colors.background.fifth} !important;
  }
`
const SnapshotContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 3}px;
  margin-top: ${(props) => props.theme.grid.unit * 6}px;
  align-items: center;

  .dropdown-toggle {
    border: none;
    background: transparent !important;
  }

  &:hover {
    background: ${(props) => props.theme.colors.background.fifth};
  }
`
const Text = styled.div`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.font.size.normal};
  display: flex;
  align-items: center;
`
const Date = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.normal};
`

const ViewLink = styled(Link)`
  font-size: ${(props) => props.theme.font.size.medium};
  line-height: ${(props) => props.theme.font.lineHeight.large};
  color: ${(props) => props.theme.colors.text.tertiary};
  text-decoration: none;
  margin: 0 1em;
`
