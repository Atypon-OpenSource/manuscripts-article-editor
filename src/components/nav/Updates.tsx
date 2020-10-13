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

import { BackArrowIcon } from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

import { theme } from '../../theme/theme'
import { RelativeDate } from '../RelativeDate'
import { TopicView } from './TopicView'

export const Popup = styled.div`
  background: ${(props) => props.theme.colors.background.primary};
  border-radius: ${(props) => props.theme.grid.radius.default};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  font-family: ${(props) => props.theme.font.family.sans};
  font-size: 10pt;
  font-weight: ${(props) => props.theme.font.weight.normal};
  color: ${(props) => props.theme.colors.text.primary};
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
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 6}px
    ${(props) => props.theme.grid.unit * 3}px;
  border-top: 1px solid ${(props) => props.theme.colors.border.secondary};
`

export const Title = styled.div`
  font-size: 1.1em;
  font-weight: ${(props) => props.theme.font.weight.medium};
  cursor: pointer;
  flex: 1;

  &:hover {
    text-decoration: underline;
  }
`

const Container = styled.div``

const Header = styled.div`
  font-size: 1.6em;
  font-weight: ${(props) => props.theme.font.weight.xlight};
  padding: ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 6}px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.tertiary};
`

export const Heading = styled.div`
  font-size: 1.05em;
  font-weight: ${(props) => props.theme.font.weight.medium};
  margin-bottom: 2px;
  display: flex;
  justify-content: space-between;
`

const UpdatesContent = styled.div`
  max-height: 70vh;
  overflow-y: auto;

  img.emoji {
    height: 1em;
    padding: 0;
  }
`

export const Timestamp = styled.span`
  color: ${(props) => props.theme.colors.text.tertiary};
  font-size: 8pt;
  font-weight: ${(props) => props.theme.font.weight.normal};
  border-radius: ${(props) => props.theme.grid.radius.default};
  border: 1px solid rgba(0, 197, 255, 0.12);
  background-color: rgba(0, 197, 255, 0.1);
  padding: 2pt 5pt;
  flex-shrink: 0;
  white-space: nowrap;
  margin-left: ${(props) => props.theme.grid.unit}px;
`

export const TopicItem = styled.div`
  cursor: pointer;
  font-weight: ${(props) => props.theme.font.weight.normal};
  padding: ${(props) => props.theme.grid.unit * 3}px
    ${(props) => props.theme.grid.unit * 6}px;

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

  & .lightbox-wrapper .meta {
    display: none;
  }
`

export const IndividualTopic = styled.div`
  padding: ${(props) => props.theme.grid.unit * 3}px
    ${(props) => props.theme.grid.unit * 6}px;

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
  if (a.created_at === b.created_at) {
    return 0
  }

  return a.created_at > b.created_at ? 1 : -1
}

export const newestFirst = (a: Topic, b: Topic) => {
  if (a.created_at === b.created_at) {
    return 0
  }

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
                <BackArrowIcon size={15} color={theme.colors.text.tertiary} />{' '}
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

    return topics.sort(newestFirst).map((topic) => (
      <TopicItem
        key={topic.id}
        onClick={(event) => {
          event.preventDefault()
          this.selectTopic(topic)
        }}
      >
        <Heading>
          <Title>{topic.title}</Title>

          <div>
            <Timestamp>
              <RelativeDate createdAt={Date.parse(topic.created_at)} />
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
