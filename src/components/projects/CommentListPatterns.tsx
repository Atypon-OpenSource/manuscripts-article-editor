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

import AuthorPlaceholder from '@manuscripts/assets/react/AuthorPlaceholder'
import { CheckboxField, CheckboxLabel } from '@manuscripts/style-guide'
import React, { useCallback } from 'react'
import styled from 'styled-components'

export const Container = styled.div`
  flex: 1;
  overflow-y: auto;
`

export const Thread = styled.div`
  margin: 16px 16px 16px 0;
`

export const Reply = styled.div`
  padding: ${(props) => props.theme.grid.unit * 4}px 0
    ${(props) => props.theme.grid.unit * 2}px;
  margin-left: ${(props) => props.theme.grid.unit * 4}px;
  border: 1px solid ${(props) => props.theme.colors.brand.xlight};
  border-top: none;
`

export const PlaceholderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`

export const PlaceholderMessage = styled.div`
  font-size: ${(props) => props.theme.font.size.medium};
  font-weight: ${(props) => props.theme.font.weight.light};
  color: ${(props) => props.theme.colors.text.secondary};
  text-align: center;
  margin: ${(props) => props.theme.grid.unit * 5}px;
`

export const ActionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 17px;
  margin-left: 33px;
`

export const LabelText = styled.div`
  font-family: ${(props) => props.theme.font.family.sans};
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 14px;
  line-height: 24px;
`

export const Checkbox = styled(CheckboxLabel)`
  div {
    color: ${(props) => props.theme.colors.text.primary};
  }
`

export enum CommentFilter {
  ALL,
  UNRESOLVED,
}

interface SeeResolvedCheckboxProps {
  isEmpty: boolean
  commentFilter: CommentFilter
  setCommentFilter: (filter: CommentFilter) => void
}

export const SeeResolvedCheckbox: React.FC<SeeResolvedCheckboxProps> = ({
  isEmpty,
  commentFilter,
  setCommentFilter,
}) => {
  const handleOnSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setCommentFilter(
        e.target.checked ? CommentFilter.ALL : CommentFilter.UNRESOLVED
      ),
    [setCommentFilter]
  )

  return (
    <ActionHeader>
      {isEmpty ? null : (
        <Checkbox>
          <CheckboxField
            checked={commentFilter === CommentFilter.ALL}
            onChange={handleOnSelectChange}
          />
          <LabelText>See resolved</LabelText>
        </Checkbox>
      )}
    </ActionHeader>
  )
}

export const EmptyCommentsListPlaceholder: React.FC = () => {
  return (
    <PlaceholderContainer>
      <AuthorPlaceholder width={295} height={202} />
      <PlaceholderMessage>
        Discuss this manuscript with your collaborators by creating a comment.
      </PlaceholderMessage>
    </PlaceholderContainer>
  )
}
