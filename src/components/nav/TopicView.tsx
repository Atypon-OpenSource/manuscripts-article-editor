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

import DOMPurify, { sanitize } from 'dompurify'
import React, { useEffect, useState } from 'react'

import { sanitizeLink } from '../../lib/sanitize'
import { RelativeDate } from '../RelativeDate'
import {
  Heading,
  IndividualTopic,
  Link,
  oldestFirst,
  Post,
  Timestamp,
  Title,
  Topic,
  TopicItem,
} from './Updates'

const ALLOWED_TAGS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'div',
  'span',
  'img',
  'ul',
  'ol',
  'li',
  'br',
  'a',
]

const sanitizedContent = (html: string, max?: number) => {
  const content = max && html.length > max ? html.substring(0, max) + '…' : html

  DOMPurify.addHook('afterSanitizeAttributes', sanitizeLink)
  const output = sanitize(content, { ALLOWED_TAGS })
  DOMPurify.removeHook('afterSanitizeAttributes')

  return <div dangerouslySetInnerHTML={{ __html: output }} />
}

export const TopicView: React.FC<{ host: string; topic: Topic }> = ({
  host,
  topic,
}) => {
  const [post, setPost] = useState<Post>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    if (topic) {
      fetch(`${host}/t/${topic.id}.json`)
        .then((response) => response.json())
        .then((data) => {
          const post = data.post_stream.posts.sort(oldestFirst)[0]
          setPost(post)
        })
        .catch((error) => {
          setError(error.message)
        })
    } else {
      setPost(undefined)
    }
  }, [host, topic])

  if (!topic) {
    return null
  }

  return (
    <IndividualTopic>
      <Heading>
        <Title>
          <Link
            href={`${host}/t/${topic.id}`}
            title={`Read more about "${topic.title}" at ${host}`}
            target={'_blank'}
          >
            {topic.title}
          </Link>
        </Title>

        <div>
          <Timestamp>
            <RelativeDate createdAt={Date.parse(topic.created_at)} />
          </Timestamp>
        </div>
      </Heading>

      {
        <TopicItem>
          {error ? (
            <div>There was an error loading this post.</div>
          ) : post ? (
            sanitizedContent(post.cooked)
          ) : (
            'Loading…'
          )}
        </TopicItem>
      }
    </IndividualTopic>
  )
}
