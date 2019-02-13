/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Build,
  CommentAnnotation,
  ManuscriptNode,
  Selected,
  UserProfileWithAvatar,
} from '@manuscripts/manuscript-editor'
import {
  Keyword,
  Model,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { buildCommentTree, buildName } from '../../lib/comments'
import { styled } from '../../theme/styled-components'
import { Avatar } from '../Avatar'
import { RelativeDate } from '../RelativeDate'
import CommentBody from './CommentBody'
import { CommentTarget } from './CommentTarget'

interface UserProps {
  user?: UserProfileWithAvatar
}

const CommentListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`

interface ContainerProps {
  isSelected: boolean
}

const Container = styled.div<ContainerProps>`
  padding: 16px 0 8px;
  background: white;
  border: 1px solid #edf1f4;
  border-left: 4px solid
    ${props =>
      props.isSelected
        ? props.theme.colors.comment.border.selected
        : props.theme.colors.comment.border.default};
`

const CommentThread = styled.div`
  margin: 16px 16px 16px 0;
`

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 0 16px;
`

const CommentUserContainer = styled.div`
  display: flex;
  align-items: center;
`

const CommentUserName = styled.div`
  margin: 0 8px;
  font-weight: 600;
`

const Reply = styled.div`
  padding: 16px 0 8px;
  margin-left: 16px;
  border: 1px solid #edf1f4;
  border-top: none;
`

const LightRelativeDate = styled(RelativeDate)`
  font-size: 12px;
  color: ${props => props.theme.colors.comment.date};
  letter-spacing: -0.2px;
`

const CommentUser: React.FunctionComponent<UserProps> = ({ user }) =>
  user ? (
    <CommentUserContainer>
      <Avatar src={user.avatar} size={20} />
      <CommentUserName>by {buildName(user.bibliographicName)}</CommentUserName>
    </CommentUserContainer>
  ) : null

interface Props {
  comments: CommentAnnotation[]
  createKeyword: (name: string) => Promise<Keyword>
  deleteComment: (id: string) => Promise<string>
  doc: ManuscriptNode
  getCollaborator: (id: string) => UserProfile | undefined
  getCurrentUser: () => UserProfile
  getKeyword: (id: string) => Keyword | undefined
  listCollaborators: () => UserProfile[]
  listKeywords: () => Keyword[]
  saveComment: <T extends Model>(model: Build<T>) => Promise<T>
  selected: Selected | null
}

export class CommentList extends React.Component<Props> {
  public componentWillReceiveProps(nextProps: Props) {
    const { selected } = nextProps

    if (selected) {
      const { id } = selected.node.attrs

      if (!this.props.selected || id !== this.props.selected.node.attrs.id) {
        // scroll into view and expand
      }
    }
  }

  public render() {
    const {
      comments,
      deleteComment,
      doc,
      getCurrentUser,
      saveComment,
      selected,
      createKeyword,
      getCollaborator,
      getKeyword,
      listCollaborators,
      listKeywords,
    } = this.props

    const commentsTreeMap = buildCommentTree(doc, comments)
    const items = Array.from(commentsTreeMap.entries())

    return (
      <CommentListContainer>
        {items.map(([target, commentData]) => {
          const isSelected = selected
            ? selected.node.attrs.id === target
            : false

          return (
            <CommentTarget key={target} isSelected={isSelected}>
              {commentData.map(({ comment, children }) => (
                <CommentThread key={comment._id}>
                  <Container isSelected={isSelected}>
                    <CommentHeader>
                      <CommentUser user={getCollaborator(comment.userID)} />
                      <LightRelativeDate createdAt={comment.createdAt} />
                    </CommentHeader>

                    <CommentBody
                      comment={comment}
                      createKeyword={createKeyword}
                      deleteComment={deleteComment}
                      getCollaborator={getCollaborator}
                      getCurrentUser={getCurrentUser}
                      getKeyword={getKeyword}
                      listCollaborators={listCollaborators}
                      listKeywords={listKeywords}
                      saveComment={saveComment}
                    />
                  </Container>

                  {children.map(comment => (
                    <Reply key={comment._id}>
                      <CommentHeader>
                        <CommentUser user={getCollaborator(comment.userID)} />
                        <LightRelativeDate createdAt={comment.createdAt} />
                      </CommentHeader>

                      <CommentBody
                        comment={comment}
                        createKeyword={createKeyword}
                        deleteComment={deleteComment}
                        getCollaborator={getCollaborator}
                        getCurrentUser={getCurrentUser}
                        getKeyword={getKeyword}
                        isReply={true}
                        listCollaborators={listCollaborators}
                        listKeywords={listKeywords}
                        saveComment={saveComment}
                      />
                    </Reply>
                  ))}
                </CommentThread>
              ))}
            </CommentTarget>
          )
        })}
      </CommentListContainer>
    )
  }
}
