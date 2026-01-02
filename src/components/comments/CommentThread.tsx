/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2024 Atypon Systems LLC. All Rights Reserved.
 */
import { CommentAttrs } from '@manuscripts/body-editor'
import { TextButton } from '@manuscripts/style-guide'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { usePreservedComments } from '../../hooks/use-preserved-comments'
import { usePermissions } from '../../lib/capabilities'
import { commentsByTime, Thread } from '../../lib/comments'
import { CommentCard } from './CommentCard'
import { ReplyBox } from './ReplyBox'

const Container = styled.div<{ isSelected?: boolean }>`
  padding: 8px;
  background-color: ${(props) => (props.isSelected ? '#fff' : '#fafafa')};
  border: 1px solid #c9c9c9;
  ${(props) => props.isSelected && 'border-left-width: 4px'};
  border-radius: 4px;
  margin-bottom: 16px;
  margin-left: 12px;
  margin-right: 12px;
  cursor: pointer;
  .actions-icon {
    visibility: ${(props) => (props.isSelected ? 'visible' : 'hidden')};
  }

  &:hover {
    background-color: #fff;

    .actions-icon {
      visibility: visible;
    }
  }

  &:focus {
    outline: none;
    background-color: #fff;

    .actions-icon {
      visibility: visible;
    }
  }
`
const SeparatorLine = styled.div`
  margin-bottom: 8px;
  background-color: #c9c9c9;
  height: 1px;
`
const Indented = styled.div`
  padding-left: 16px;
`

export interface CommentThreadProps {
  thread: Thread
  isSelected: boolean
  onSelect: () => void
  onSave: (comment: CommentAttrs) => void
  onDelete: (id: string) => void
  insertCommentReply: (target: string, contents: string) => void
  isOrphanComment?: boolean
  isTabbable: boolean
  cardRef?: (el: HTMLDivElement | null) => void
}

export const CommentThread = forwardRef<HTMLDivElement, CommentThreadProps>(
  (props, ref) => {
    const {
      thread,
      isSelected,
      onSelect,
      onSave,
      onDelete,
      insertCommentReply,
      isOrphanComment,
      isTabbable,
      cardRef,
    } = props

    const can = usePermissions()

    const { comment, isNew, replies } = thread
    const { get: getPreserved } = usePreservedComments()

    const cardsRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      const el = containerRef.current
      cardRef?.(el)
      if (typeof ref === 'function') {
        ref(el)
      } else if (ref) {
        ref.current = el
      }
    }, [cardRef, ref])

    const [showMore, setShowMore] = useState(false)

    // Initialize editingCommentId: set to comment ID if it's new OR has UNSAVED preserved content
    const [editingCommentId, setEditingCommentId] = useState<string | null>(
      () => {
        const commentId = comment.node.attrs.id
        if (isNew) {
          return commentId
        }
        // Check if there's preserved content that's different from saved content (unsaved changes)
        const preservedContent = getPreserved(commentId)
        const savedContent = comment.node.attrs.contents
        if (preservedContent && preservedContent !== savedContent) {
          return commentId
        }
        return null
      }
    )

    useEffect(() => {
      if (cardsRef.current) {
        const contentHeight = cardsRef.current.scrollHeight
        setShowMore(contentHeight > 280)
      }
    }, [comment, replies])

    const handleSelect = () => {
      if (!isSelected) {
        onSelect()
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      const currentElement = document.activeElement as HTMLElement

      if (e.key === 'Enter' && currentElement === containerRef.current) {
        e.preventDefault()
        onSelect()
        setTimeout(() => containerRef.current?.focus(), 0)
      }
    }

    return (
      <Container
        data-cy="comment"
        isSelected={isSelected}
        ref={containerRef}
        onClick={handleSelect}
        onKeyDown={handleKeyDown}
        tabIndex={isTabbable ? 0 : -1}
      >
        <CardsWrapper
          ref={cardsRef}
          isSelected={isSelected}
          showMore={showMore}
        >
          <CommentCard
            comment={comment}
            isReply={false}
            numOfReplies={replies.length}
            isNew={isNew}
            isEndOfThread={!replies.length}
            isOrphanComment={isOrphanComment || false}
            editingCommentId={editingCommentId}
            setEditingCommentId={setEditingCommentId}
            onDelete={onDelete}
            onSave={onSave}
          />
          {replies.sort(commentsByTime).map((reply, index) => {
            return (
              <div key={reply.node.attrs.id}>
                {index === 0 && <SeparatorLine />}
                <Indented>
                  {index !== 0 && <SeparatorLine />}
                  <CommentCard
                    comment={reply}
                    isReply={true}
                    numOfReplies={0}
                    isNew={false}
                    isEndOfThread={index === replies.length - 1}
                    isOrphanComment={isOrphanComment || false}
                    editingCommentId={editingCommentId}
                    setEditingCommentId={setEditingCommentId}
                    onDelete={onDelete}
                    onSave={onSave}
                  />
                </Indented>
              </div>
            )
          })}
        </CardsWrapper>

        {showMore && !isSelected && (
          <>
            <SeparatorLine />
            <ButtonContainer>
              <ShowMore onClick={onSelect}>Show more</ShowMore>
            </ButtonContainer>
          </>
        )}
        {can.createComment &&
          isSelected &&
          editingCommentId === null &&
          !isOrphanComment && (
            <ReplyBox
              insertCommentReply={insertCommentReply}
              commentID={comment.node.attrs.id}
            />
          )}
      </Container>
    )
  }
)

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ShowMore = styled(TextButton)`
  cursor: pointer;
  text-align: center;
  margin-top: 6px;
  color: #353535;
`

const CardsWrapper = styled.div<{
  isSelected: boolean
  showMore: boolean
}>`
  max-height: ${({ isSelected }) => (isSelected ? 'none' : '280px')};
  position: relative;
  ${({ showMore, isSelected }) =>
    showMore &&
    !isSelected &&
    `
    overflow: hidden;
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    }
  `}
`
