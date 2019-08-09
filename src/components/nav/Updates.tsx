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

import { BackArrowIcon } from '@manuscripts/style-guide'
import React from 'react'
import { FormattedRelative } from 'react-intl'
import { styled } from '../../theme/styled-components'
import { theme } from '../../theme/theme'
import { TopicView } from './TopicView'

export const Popup = styled.div`
  background: #fff;
  border-radius: ${props => props.theme.radius}px;
  box-shadow: 0 4px 9px 0 ${props => props.theme.colors.modal.shadow};
  font-family: Barlow, sans-serif;
  font-size: 10pt;
  font-weight: normal;
  color: #000;
  max-width: 500px;
  overflow-x: hidden;
  overflow-y: auto;
  white-space: normal;

  & p {
    margin: 0;
  }

  & img {
    box-sizing: border-box;
    padding: 10pt;
    height: auto;
  }
`

export const Link = styled.a`
  color: inherit;
  display: block;
  text-decoration: none;
`

const FooterLink = styled(Link)`
  padding: 6px 24px 12px;
  border-top: 1px solid #eee;
`

export const Title = styled.div`
  font-size: 1.1em;
  font-weight: 500;
  cursor: pointer;
  flex: 1;

  &:hover {
    text-decoration: underline;
  }
`

const Container = styled.div``

const Header = styled.div`
  font-size: 1.6em;
  font-weight: 200;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
`

export const Heading = styled.div`
  font-size: 1.05em;
  font-weight: 500;
  margin-bottom: 2px;
  display: flex;
  justify-content: space-between;
`

const UpdatesContent = styled.div`
  max-height: 70vh;
  overflow-y: auto;
`

export const Timestamp = styled.span`
  color: #585858;
  font-size: 8pt;
  font-weight: normal;
  border-radius: 6px;
  border: 1px solid rgba(0, 197, 255, 0.12);
  background-color: rgba(0, 197, 255, 0.1);
  padding: 2pt 5pt;
  flex-shrink: 0;
  white-space: nowrap;
  margin-left: 6px;
`

export const TopicItem = styled.div`
  cursor: pointer;
  font-weight: 400;
  padding: 12px 24px;

  &:not(:last-of-type) {
    border-bottom: 1px solid #eee;
  }

  & p {
    margin-top: 0.5em;
    margin-bottom: 0.8em;
  }

  & img {
    max-width: 70%;
    margin: 0;
    padding: 10pt;
  }
`

export const IndividualTopic = styled.div`
  padding: 12px 24px;

  & ${TopicItem} {
    padding: 0;
  }
`

const Back = styled.div`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const Message = styled.div`
  padding: 0 24px;
`

const LoginLink: React.FunctionComponent<{ host: string }> = ({ host }) => (
  <FooterLink href={`${host}/login`}>
    &#128279; Manuscripts.io community
  </FooterLink>
)

export const oldestFirst = (a: Post, b: Post) => {
  if (a.created_at === b.created_at) return 0

  return a.created_at > b.created_at ? 1 : -1
}

export const newestFirst = (a: Topic, b: Topic) => {
  if (a.created_at === b.created_at) return 0

  return a.created_at > b.created_at ? -1 : 1
}

export interface Topic {
  id: number
  title: string
  created_at: string
}

export interface Post {
  id: number
  created_at: string
  topic_id: number
  cooked: string
  blurb: string
}

interface Props {
  error?: string
  host: string
  loaded: boolean
  posts?: Post[]
  topics?: Topic[]
}

interface State {
  selectedTopic?: Topic
}

export class Updates extends React.Component<Props, State> {
  public state: Readonly<State> = {}

  public render() {
    const { host } = this.props
    const { selectedTopic } = this.state

    return (
      <Container>
        {selectedTopic ? (
          <UpdatesContent>
            <Header onClick={() => this.selectTopic(undefined)}>
              <Back>
                <BackArrowIcon size={15} color={theme.colors.updates.back} />{' '}
                Back to Latest Updates
              </Back>
            </Header>

            <TopicView topic={selectedTopic} host={host} />
          </UpdatesContent>
        ) : (
          <UpdatesContent>
            <Header>Latest Updates</Header>

            {this.renderTopics()}
          </UpdatesContent>
        )}

        <LoginLink host={host} />
      </Container>
    )
  }

  private renderTopics = () => {
    const { error, loaded, posts, topics } = this.props

    if (error) {
      return <Message>{error}</Message>
    }

    if (!loaded) {
      return <Message>Loading…</Message>
    }

    if (!topics || !topics.length) {
      return <Message>No topics.</Message>
    }

    if (!posts || !posts.length) {
      return <Message>No posts.</Message>
    }

    return topics.sort(newestFirst).map(topic => (
      <TopicItem
        key={topic.id}
        onClick={event => {
          event.preventDefault()
          this.selectTopic(topic)
        }}
      >
        <Heading>
          <Title>{topic.title}</Title>

          <div>
            <Timestamp>
              <FormattedRelative value={topic.created_at} />
            </Timestamp>
          </div>
        </Heading>
      </TopicItem>
    ))
  }

  private selectTopic = (selectedTopic?: Topic) => {
    this.setState({ selectedTopic })
  }
}
