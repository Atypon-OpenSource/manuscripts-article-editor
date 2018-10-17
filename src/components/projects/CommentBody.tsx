import AnnotationEdit from '@manuscripts/assets/react/AnnotationEdit'
import AnnotationRemove from '@manuscripts/assets/react/AnnotationRemove'
import AnnotationReply from '@manuscripts/assets/react/AnnotationReply'
import AnnotationShare from '@manuscripts/assets/react/AnnotationShare'
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikActions,
  FormikProps,
} from 'formik'
import React from 'react'
import { StyledCommentEditor } from '../../editor/comment/CommentEditor'
import { StyledCommentViewer } from '../../editor/comment/CommentViewer'
import {
  CreateKeyword,
  GetCollaborators,
  GetKeyword,
  GetKeywords,
  GetUser,
} from '../../editor/comment/config'
import { Build, buildComment } from '../../lib/commands'
import { styled } from '../../theme'
import { CommentAnnotation, Model, UserProfile } from '../../types/models'
import { Button, PrimaryButton } from '../Button'
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

interface Props {
  comment: CommentAnnotation
  getCurrentUser: () => UserProfile
  saveModel: <T extends Model>(model: Build<T>) => Promise<T>
  deleteModel: (id: string) => Promise<string>
  getCollaborators: GetCollaborators
  getKeywords: GetKeywords
  getKeyword: GetKeyword
  getUser: GetUser
  createKeyword: CreateKeyword
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
      getKeyword,
      getKeywords,
      getUser,
      getCollaborators,
      createKeyword,
      isReply = false,
    } = this.props

    return editing ? (
      <Formik initialValues={comment} onSubmit={this.handleSubmit}>
        {({
          errors,
          values,
          setFieldValue,
        }: FormikProps<CommentAnnotation>) => (
          <Form>
            {errors.contents && <FormError>{errors.contents}</FormError>}

            <Field name={'contents'}>
              {(props: FieldProps) => (
                <CommentContent>
                  <StyledCommentEditor
                    value={values.contents}
                    handleChange={(data: string) =>
                      setFieldValue(props.field.name, data)
                    }
                    getCollaborators={getCollaborators}
                    getKeywords={getKeywords}
                    createKeyword={createKeyword}
                  />
                </CommentContent>
              )}
            </Field>

            <EditingCommentFooter>
              <Button onClick={this.cancelEditing}>Cancel</Button>
              <PrimaryButton type={'submit'}>Save</PrimaryButton>
            </EditingCommentFooter>
          </Form>
        )}
      </Formik>
    ) : (
      <div>
        <CommentContent>
          <StyledCommentViewer
            value={comment.contents}
            getUser={getUser}
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

    return Date.now() / 1000 - comment.createdAt! < 60 // created < 1 min ago

    // return !comment.contents
  }

  private handleSubmit = (
    values: CommentAnnotation,
    formikActions: FormikActions<CommentAnnotation>
  ) => {
    const { saveModel } = this.props

    formikActions.setSubmitting(true)

    saveModel(values)
      .then(() => {
        this.setEditing(false)
      })
      .catch(error => {
        formikActions.setErrors({
          contents: error.message,
        })
        formikActions.setSubmitting(false)
      })
  }

  private setEditing = (editing: boolean) => {
    this.setState({ editing })
  }

  private startEditing = () => {
    this.setEditing(true)
  }

  private cancelEditing = () => {
    // TODO: delete the comment if it's always been empty
    this.setEditing(false)
  }

  private confirmThenDeleteComment = (id: string) => {
    if (confirm('Delete this comment?')) {
      this.props.deleteModel(id).catch(error => {
        console.error(error) // tslint:disable-line:no-console
      })
    }
  }

  private openSharing = () => {
    // TODO
  }

  private createReply = async (id: string) => {
    const { getCurrentUser, saveModel } = this.props

    const user = getCurrentUser()

    const comment = buildComment(user._id, id)

    await saveModel<CommentAnnotation>(comment)
  }
}

export default CommentBody
