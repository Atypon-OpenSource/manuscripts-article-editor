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
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Thread, commentsByTime } from '../../lib/comments'
import { ReplyBox } from './ReplyBox'
import { CommentCard } from './CommentCard'

const Container = styled.div<{ isSelected?: boolean }>`
  padding: 8px;
  background-color: ${(props) => (props.isSelected ? '#fff' : '#fafafa')};
  border: 1px solid #c9c9c9;
  ${(props) => props.isSelected && 'border-left-width: 4px'};
  border-radius: 4px;
  margin-bottom: 16px;
  margin-left: 12px;
  margin-right: 12px;

  .actions-icon {
    visibility: ${(props) => (props.isSelected ? 'visible' : 'hidden')};
  }

  .show-more {
    cursor: pointer;
    text-align: center;
    margin-top: 6px;
  }

  &:hover {
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
    } = props

    const { comment, isNew, replies } = thread

    const cardsRef = useRef<HTMLDivElement>(null)
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
      if (cardsRef.current) {
        const contentHeight = cardsRef.current.scrollHeight
        setShowMore(contentHeight > 280) // || replies.length > 1
      }
    }, [cardsRef.current, replies])

    return (
      <Container data-cy="comment" isSelected={isSelected} ref={ref}>
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
            onDelete={onDelete}
            onSave={onSave}
            onSelect={onSelect}
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
                    onDelete={onDelete}
                    onSave={onSave}
                    onSelect={onSelect}
                  />
                </Indented>
              </div>
            )
          })}
        </CardsWrapper>

        {showMore && !isSelected && (
          <>
            <SeparatorLine />
            <div className="show-more" onClick={onSelect}>
              Show more
            </div>
          </>
        )}
        {isSelected && !isNew && (
          <ReplyBox
            insertCommentReply={insertCommentReply}
            commentId={comment.node.attrs.id}
          />
        )}
      </Container>
    )
  }
)

const CardsWrapper = styled.div<{
  isSelected: boolean
  showMore: boolean
}>`
  max-height: ${({ isSelected }) => (isSelected ? 'none' : '280px')};
  overflow: hidden;
  position: relative;
  ${({ showMore, isSelected }) =>
    showMore &&
    !isSelected &&
    `
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
