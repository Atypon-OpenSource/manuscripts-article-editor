import { COMMENT_ANNOTATION } from '../../src/transformer/object-types'
import { CommentAnnotation } from '../../src/types/components'

export const comments: CommentAnnotation[] = [
  {
    id: 'comment-1',
    objectType: COMMENT_ANNOTATION,
    containerID: 'project-1',
    manuscriptID: 'manuscript-1',
    userID: 'user-1',
    target: 'MPParagraphElement:872C613C-4BD6-48DC-CC11-5CEC1ED4DBA0',
    contents:
      '<div><blockquote>some quoted text</blockquote><p>This is a <span class="keyword" data-keywordid="keyword-1">#comment</span> for <span class="user" data-userid="user-2">@test</span>.</p></div>',
    createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-01-23T08:00:00Z').getTime() / 1000),
  },
]
