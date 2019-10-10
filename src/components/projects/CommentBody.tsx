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

import AnnotationEdit from '@manuscripts/assets/react/AnnotationEdit'
import AnnotationRemove from '@manuscripts/assets/react/AnnotationRemove'
import AnnotationReply from '@manuscripts/assets/react/AnnotationReply'
// import AnnotationShare from '@manuscripts/assets/react/AnnotationShare'
import { Comment, CommentField } from '@manuscripts/comment-editor'
import { CommentAnnotation } from '@manuscripts/manuscript-transform'
import { Keyword, UserProfile } from '@manuscripts/manuscripts-json-schema'
import {
  FormError,
  PrimaryButton,
  SecondaryButton,
} from '@manuscripts/style-guide'
import { Field, FieldProps, Form, Formik } from 'formik'
import React from 'react'
import { styled } from '../../theme/styled-components'

const CommentFooter = styled.div`
  border-top: 1px solid #eee;
  margin-top: ${props => props.theme.grid.unit * 4}px;
  padding: ${props => props.theme.grid.unit * 2}px
    ${props => props.theme.grid.unit * 2}px 0;
  display: flex;
  justify-content: space-between;
`

const EditingCommentFooter = styled(CommentFooter)`
  justify-content: flex-end;
  padding: ${props => props.theme.grid.unit * 2}px
    ${props => props.theme.grid.unit * 4}px 0;
`

const ActionButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  height: ${props => props.theme.grid.unit * 6}px;
`

const CommentContent = styled.div`
  padding: 0 ${props => props.theme.grid.unit * 4}px;
`

const StyledCommentField = styled(CommentField)`
  flex: 1;

  & .ProseMirror {
    cursor: text;
    font-family: ${props => props.theme.font.family.sans};
    line-height: 1.06;
    letter-spacing: -0.2px;
    color: ${props => props.theme.colors.text.primary};
    margin: ${props => props.theme.grid.unit * 2}px 0;

    &:focus {
      outline: none;
    }

    & p:first-child {
      margin-top: 0;
    }

    & p:last-child {
      margin-bottom: 0;
    }

    & blockquote {
      margin: ${props => props.theme.grid.unit * 2}px 0;
      border-left: ${props => props.theme.grid.unit}px solid #faed98;
      padding-left: 1em;
      font-size: ${props => props.theme.font.size.small};
      font-style: italic;
      line-height: 1.17;
      letter-spacing: -0.2px;
      color: #bababa;
    }
  }
`

const StyledCommentViewer = styled(Comment)`
  flex: 1;

  & .ProseMirror {
    font-family: ${props => props.theme.font.family.sans};
    line-height: 1.06;
    letter-spacing: -0.2px;
    color: ${props => props.theme.colors.text.primary};
    margin: ${props => props.theme.grid.unit * 2}px 0;

    &:focus {
      outline: none;
    }

    & p:first-child {
      margin-top: 0;
    }

    & p:last-child {
      margin-bottom: 0;
    }

    & blockquote {
      margin: 10px 0;
      border-left: 4px solid #faed98;
      padding-left: 1em;
      font-size: ${props => props.theme.font.size.small};
      font-style: italic;
      line-height: 1.17;
      letter-spacing: -0.2px;
      color: #bababa;
    }
  }
`

interface Props {
  comment: CommentAnnotation
  createKeyword: (name: string) => Promise<Keyword>
  getCollaborator: (id: string) => UserProfile | undefined
  getKeyword: (id: string) => Keyword | undefined
  listCollaborators: () => UserProfile[]
  listKeywords: () => Keyword[]
  saveComment: (comment: CommentAnnotation) => Promise<CommentAnnotation>
  deleteComment: (comment: CommentAnnotation) => void
  isReply?: boolean
  isNew: boolean
  setCommentTarget: (commentTarget?: string) => void
}

interface State {
  editing: boolean
}

class CommentBody extends React.Component<Props, State> {
  public state: Readonly<State> = {
    editing: false,
  }

  public componentDidMount() {
    if (this.props.isNew) {
      this.startEditing()
    }
  }

  public render() {
    const { editing } = this.state
    const {
      comment,
      createKeyword,
      getCollaborator,
      getKeyword,
      isReply = false,
      listCollaborators,
      listKeywords,
    } = this.props

    return editing ? (
      <Formik<CommentAnnotation>
        initialValues={comment}
        onSubmit={(values, actions) => {
          actions.setSubmitting(true)

          this.props
            .saveComment(values)
            .then(() => {
              this.setEditing(false)
            })
            .catch(error => {
              actions.setErrors({
                contents: error.message,
              })
              actions.setSubmitting(false)
            })
        }}
      >
        {({ errors, values, setFieldValue }) => (
          <Form>
            {errors.contents && <FormError>{errors.contents}</FormError>}

            <Field name={'contents'}>
              {(props: FieldProps) => (
                <CommentContent>
                  <StyledCommentField
                    autoFocus={editing}
                    value={values.contents}
                    handleChange={(data: string) =>
                      setFieldValue(props.field.name, data)
                    }
                    createKeyword={createKeyword}
                    listCollaborators={listCollaborators}
                    listKeywords={listKeywords}
                  />
                </CommentContent>
              )}
            </Field>

            <EditingCommentFooter>
              <SecondaryButton onClick={this.cancelEditing}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit">Save</PrimaryButton>
            </EditingCommentFooter>
          </Form>
        )}
      </Formik>
    ) : (
      <div>
        <CommentContent>
          <StyledCommentViewer
            value={comment.contents}
            getCollaborator={getCollaborator}
            getKeyword={getKeyword}
          />
        </CommentContent>

        <CommentFooter>
          <span>
            <ActionButton onClick={this.startEditing} title={'Edit comment'}>
              <AnnotationEdit />
            </ActionButton>
            {!isReply && (
              <ActionButton onClick={this.createReply} title={'Reply'}>
                <AnnotationReply />
              </ActionButton>
            )}
          </span>

          <span>
            {/*<ActionButton onClick={this.openSharing}>
              <AnnotationShare />
            </ActionButton>*/}
            <ActionButton
              onClick={this.confirmThenDeleteComment}
              title={'Delete comment'}
            >
              <AnnotationRemove />
            </ActionButton>
          </span>
        </CommentFooter>
      </div>
    )
  }

  private setEditing = (editing: boolean) => {
    this.setState({ editing })
  }

  private startEditing = () => {
    this.setEditing(true)
  }

  private cancelEditing = async () => {
    const { comment, isNew, deleteComment } = this.props

    this.setEditing(false)

    if (isNew) {
      deleteComment(comment)
    }
  }

  private confirmThenDeleteComment = () => {
    const { comment, deleteComment } = this.props

    if (confirm('Delete this comment?')) {
      deleteComment(comment)
    }
  }

  // private openSharing = () => {
  //   // TODO
  // }

  private createReply = () => {
    const { comment, setCommentTarget } = this.props

    setCommentTarget(comment._id)
  }
}

export default CommentBody
