import AnnotationEdit from '@manuscripts/assets/react/AnnotationEdit'
import AnnotationRemove from '@manuscripts/assets/react/AnnotationRemove'
import AnnotationReply from '@manuscripts/assets/react/AnnotationReply'
import AnnotationShare from '@manuscripts/assets/react/AnnotationShare'
import { Comment, CommentField } from '@manuscripts/comment-editor'
import {
  Build,
  buildComment,
  CommentAnnotation,
} from '@manuscripts/manuscript-editor'
import {
  Keyword,
  Model,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { Field, FieldProps, Form, Formik } from 'formik'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { Button, PrimarySubmitButton } from '../Button'
import { FormError } from '../Form'

const CommentFooter = styled.div`
  border-top: 1px solid #eee;
  margin-top: 16px;
  padding: 8px 8px 0;
  display: flex;
  justify-content: space-between;
`

const EditingCommentFooter = styled(CommentFooter)`
  justify-content: flex-end;
  padding: 8px 16px 0;
`

const ActionButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  height: 24px;
`

const CommentContent = styled.div`
  padding: 0 16px;
`

const StyledCommentField = styled(CommentField)`
  flex: 1;

  & .ProseMirror {
    cursor: text;
    font-family: 'Barlow', sans-serif;
    line-height: 1.06;
    letter-spacing: -0.2px;
    color: #444;
    margin: 8px 0;

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
      font-size: 12px;
      font-style: italic;
      line-height: 1.17;
      letter-spacing: -0.2px;
      color: #b7b7b7;
    }
  }
`

const StyledCommentViewer = styled(Comment)`
  flex: 1;

  & .ProseMirror {
    font-family: 'Barlow', sans-serif;
    line-height: 1.06;
    letter-spacing: -0.2px;
    color: #666;
    margin: 8px 0;

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
      font-size: 12px;
      font-style: italic;
      line-height: 1.17;
      letter-spacing: -0.2px;
      color: #b7b7b7;
    }
  }
`

interface Props {
  comment: CommentAnnotation
  createKeyword: (name: string) => Promise<Keyword>
  getCurrentUser: () => UserProfile
  getCollaborator: (id: string) => UserProfile | undefined
  getKeyword: (id: string) => Keyword | undefined
  listCollaborators: () => UserProfile[]
  listKeywords: () => Keyword[]
  saveComment: <T extends Model>(model: Build<T>) => Promise<T>
  deleteComment: (id: string) => Promise<string>
  isReply?: boolean
}

interface State {
  editing: boolean
}

class CommentBody extends React.Component<Props, State> {
  public state: Readonly<State> = {
    editing: false,
  }

  public componentDidMount() {
    if (this.isNew()) {
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
              <Button onClick={this.cancelEditing}>Cancel</Button>
              <PrimarySubmitButton>Save</PrimarySubmitButton>
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
            <ActionButton onClick={this.startEditing}>
              <AnnotationEdit />
            </ActionButton>
            <ActionButton
              onClick={() => this.confirmThenDeleteComment(comment._id)}
            >
              <AnnotationRemove />
            </ActionButton>
          </span>

          <span>
            <ActionButton onClick={this.openSharing}>
              <AnnotationShare />
            </ActionButton>
            {!isReply && (
              <ActionButton onClick={() => this.createReply(comment._id)}>
                <AnnotationReply />
              </ActionButton>
            )}
          </span>
        </CommentFooter>
      </div>
    )
  }

  private isNew = () => {
    const { comment } = this.props

    return Date.now() / 1000 - comment.createdAt < 60 // created < 1 min ago
  }

  private setEditing = (editing: boolean) => {
    this.setState({ editing })
  }

  private startEditing = () => {
    this.setEditing(true)
  }

  private cancelEditing = () => {
    this.setEditing(false)
  }

  private confirmThenDeleteComment = (id: string) => {
    if (confirm('Delete this comment?')) {
      this.props.deleteComment(id).catch(error => {
        console.error(error) // tslint:disable-line:no-console
      })
    }
  }

  private openSharing = () => {
    // TODO
  }

  private createReply = async (id: string) => {
    const { getCurrentUser, saveComment } = this.props

    const user = getCurrentUser()

    const comment = buildComment(user._id, id)

    await saveComment<CommentAnnotation>(comment)
  }
}

export default CommentBody
