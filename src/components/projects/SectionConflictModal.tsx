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

import AlertIcon from '@manuscripts/assets/react/AttentionOrange'
import ManuscriptIcon from '@manuscripts/assets/react/OutlineIconManuscript'
import {
  PrimaryButton,
  SecondaryButton,
  StyledModal,
} from '@manuscripts/style-guide'
import { TreeNode } from '@manuscripts/sync-client'
import { Title } from '@manuscripts/title-editor'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import SectionTree from './SectionTree'

const Container = styled.div`
  max-width: 640px;
  background: ${props => props.theme.colors.background.primary};
  padding: 2rem;
  border: 1px solid ${props => props.theme.colors.text.muted};
  border-radius: ${props => props.theme.grid.radius.default};
`

const ModalTitle = styled.h3`
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  span {
    margin-left: 0.5em;
  }
`

const ManuscriptTitle = styled.span`
  font-size: 1.2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  span {
    margin-left: 0.2em;
  }
`

const CompareContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const CompareItem = styled.div`
  flex: 1 0 auto;
`

const ItemTitle = styled.h4`
  margin: 0 0 1em;
`

const SelectionButton = styled(SecondaryButton)`
  padding: 0.6em 1.2em;
  color: ${props => props.theme.colors.text.primary};
  background: ${props => props.theme.colors.border.secondary};
  border-radius: 2px;
  border: 2px solid ${props => props.theme.colors.border.secondary};

  g {
    fill: ${props => props.theme.colors.text.primary};
  }

  span {
    margin-left: 0.5em;
  }

  &:hover,
  &:active,
  &:focus {
    g {
      fill: ${props => props.theme.colors.brand.default};
    }
  }

  &[aria-pressed='true'] {
    border-color: ${props => props.theme.colors.brand.default};
    color: ${props => props.theme.colors.text.onDark};
    background: rgba(127, 181, 213, 0.6);
    g {
      fill: ${props => props.theme.colors.text.onDark};
    }
  }
`

const Footer = styled.footer`
  margin-top: 1rem;
  text-align: right;
`

interface Props {
  localTree: TreeNode
  remoteTree: TreeNode
  manuscriptTitle: string
  resolveToLocal: () => void
  resolveToRemote: () => void
}

type Selected = 'local' | 'remote' | null

const SectionConflictModal: React.FC<Props> = ({
  localTree,
  remoteTree,
  manuscriptTitle,
  resolveToLocal,
  resolveToRemote,
}) => {
  const [selected, setSelected] = useState<Selected>(null)

  const handleResolve = useCallback(() => {
    if (selected === 'remote') {
      resolveToRemote()
    } else if (selected === 'local') {
      resolveToLocal()
    }
  }, [selected])

  return (
    <StyledModal isOpen={true}>
      <Container>
        <ModalTitle>
          <AlertIcon />
          <span>Section Order Conflict</span>
        </ModalTitle>
        <p>
          External changes have resulted in a conflict in the overall outline of
          your manuscript. Please resolve this to continue.
        </p>
        <CompareContainer>
          <CompareItem>
            <ItemTitle>Your Version</ItemTitle>
            <ManuscriptTitle>
              <ManuscriptIcon />
              <Title value={manuscriptTitle} />
            </ManuscriptTitle>
            <SectionTree data={localTree} />
            <SelectionButton
              onClick={() => setSelected('local')}
              aria-pressed={selected === 'local'}
            >
              <ManuscriptIcon />
              <span>Use Your Version</span>
            </SelectionButton>
          </CompareItem>

          <CompareItem>
            <ItemTitle>Server Version</ItemTitle>
            <ManuscriptTitle>
              <ManuscriptIcon />
              <Title value={manuscriptTitle} />
            </ManuscriptTitle>
            <SectionTree data={remoteTree} />
            <SelectionButton
              onClick={() => setSelected('remote')}
              aria-pressed={selected === 'remote'}
            >
              <ManuscriptIcon />
              <span>Use Server Version</span>
            </SelectionButton>
          </CompareItem>
        </CompareContainer>

        <Footer>
          <PrimaryButton onClick={handleResolve} disabled={!selected}>
            Confirm
          </PrimaryButton>
        </Footer>
      </Container>
    </StyledModal>
  )
}

export default SectionConflictModal
