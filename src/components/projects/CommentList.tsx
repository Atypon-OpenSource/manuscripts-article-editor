import { Node as ProsemirrorNode } from 'prosemirror-model'
import React from 'react'
import {
  CreateKeyword,
  GetCollaborators,
  GetKeyword,
  GetKeywords,
  GetUser,
} from '../../editor/comment/config'
import { DeleteComponent, SaveComponent } from '../../editor/Editor'
import { Selected } from '../../editor/lib/utils'
import { buildCommentTree, buildName } from '../../lib/comments'
import { styled } from '../../theme'
import { CommentAnnotation, UserProfile } from '../../types/components'
import { Avatar } from '../Avatar'
import { LightRelativeDate } from '../RelativeDate'
import CommentBody from './CommentBody'
import { CommentTarget } from './CommentTarget'

interface UserProps {
  user?: UserProfile
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
  border-left: 4px solid ${props => (props.isSelected ? '#ffe08b' : '#edf1f4')};
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

const CommentUser: React.SFC<UserProps> = ({ user }) =>
  user ? (
    <CommentUserContainer>
      <Avatar src={user.image} size={20} />
      <CommentUserName>by {buildName(user.bibliographicName)}</CommentUserName>
    </CommentUserContainer>
  ) : null

interface Props {
  comments: CommentAnnotation[]
  deleteComponent: DeleteComponent
  doc: ProsemirrorNode
  saveComponent: SaveComponent
  getCurrentUser: () => UserProfile
  getUser: GetUser
  getKeyword: GetKeyword
  getKeywords: GetKeywords
  getCollaborators: GetCollaborators
  createKeyword: CreateKeyword
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
      deleteComponent,
      doc,
      getCurrentUser,
      getUser,
      getKeyword,
      saveComponent,
      getCollaborators,
      getKeywords,
      createKeyword,
      selected,
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
                      <CommentUser user={getUser(comment.userID)} />
                      <LightRelativeDate createdAt={comment.createdAt} />
                    </CommentHeader>

                    <CommentBody
                      comment={comment}
                      getCurrentUser={getCurrentUser}
                      getUser={getUser}
                      getKeyword={getKeyword}
                      saveComponent={saveComponent}
                      deleteComponent={deleteComponent}
                      getCollaborators={getCollaborators}
                      getKeywords={getKeywords}
                      createKeyword={createKeyword}
                    />
                  </Container>

                  {children.map(comment => (
                    <Reply key={comment._id}>
                      <CommentHeader>
                        <CommentUser user={getUser(comment.userID)} />
                        <LightRelativeDate createdAt={comment.createdAt} />
                      </CommentHeader>

                      <CommentBody
                        comment={comment}
                        getCurrentUser={getCurrentUser}
                        getUser={getUser}
                        getKeyword={getKeyword}
                        saveComponent={saveComponent}
                        deleteComponent={deleteComponent}
                        getCollaborators={getCollaborators}
                        getKeywords={getKeywords}
                        createKeyword={createKeyword}
                        isReply={true}
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
