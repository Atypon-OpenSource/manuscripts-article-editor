import AppIcon from '@manuscripts/assets/react/AppIcon'
import { sanitize } from 'dompurify'
import React from 'react'
import { FormattedRelative } from 'react-intl'
import { BackArrow } from '../../icons/back-arrow'
import { styled } from '../../theme/styled-components'
import { theme } from '../../theme/theme'

export const Popup = styled.div`
  background: white;
  box-shadow: 0 2px 2px #777;
  font-family: Barlow, sans-serif;
  font-size: 10pt;
  font-weight: normal;
  color: #000;
  padding: 20px;
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

const Link = styled.a`
  color: inherit;
  display: block;
  text-decoration: none;
`

const Title = styled.div`
  font-size: 1.1em;
  color: #585858;
  cursor: pointer;
  flex: 1;

  &:hover {
    text-decoration: underline;
  }
`

const Header = styled.div`
  font-size: 1.5em;
  font-weight: 600;
  color: #585858;
  margin-bottom: 10px;
`

const Heading = styled.div`
  font-size: 1.05em;
  font-weight: 600;
  margin-bottom: 2px;
  display: flex;
  justify-content: space-between;
`

const UpdatesContent = styled.div`
  max-height: 70vh;
  overflow-y: auto;
`

const Blurb = styled.div`
  margin: 0pt;

  * p {
    margin-top: 0.3em;
    margin-bottom: 1em;
  }
`

const Timestamp = styled.span`
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

const Container = styled.div`
  display: flex;
`

const TopicItem = styled.div`
  margin-bottom: 20px;
  cursor: pointer;

  * p {
    margin-top: 0.5em;
    margin-bottom: 0.8em;
  }
  * img {
    max-width: 70%;
    margin: 0;
    padding: 10pt;
  }
`

const Back = styled.div`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const Logo = styled.div`
  flex-shrink: 0;
  margin-right: 26px;
`

const LoginLink: React.FunctionComponent<{ host: string }> = ({ host }) => (
  <Link href={`${host}/login`} target={'_blank'}>
    &#128279; Manuscripts.io community
  </Link>
)

const oldestFirst = (a: Post, b: Post) => {
  if (a.created_at === b.created_at) return 0

  return a.created_at > b.created_at ? 1 : -1
}

export const newestFirst = (a: Topic, b: Topic) => {
  if (a.created_at === b.created_at) return 0

  return a.created_at > b.created_at ? -1 : 1
}

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
]

const sanitizedContent = (html: string, max?: number) => {
  const content = max && html.length > max ? html.substring(0, max) + '…' : html

  const output = sanitize(content, { ALLOWED_TAGS })

  return <div dangerouslySetInnerHTML={{ __html: output }} />
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
  error: string | null
  host: string
  loaded: boolean
  posts: Post[] | null
  topics: Topic[] | null
}

interface State {
  selectedTopic: Topic | null
}

export class Updates extends React.Component<Props, State> {
  public state: Readonly<State> = {
    selectedTopic: null,
  }

  public render() {
    const { host } = this.props
    const { selectedTopic } = this.state

    return (
      <Container>
        <Logo>
          <AppIcon />
        </Logo>

        <div>
          {selectedTopic ? (
            <UpdatesContent>
              <Header onClick={() => this.selectTopic(null)}>
                <Back>
                  <BackArrow size={15} color={theme.colors.updates.back} /> Back
                  to Latest Updates
                </Back>
              </Header>

              {this.renderTopic(selectedTopic)}
            </UpdatesContent>
          ) : (
            <UpdatesContent>
              <Header>Latest Updates</Header>

              {this.renderTopics()}
            </UpdatesContent>
          )}

          <LoginLink host={host} />
        </div>
      </Container>
    )
  }

  private renderTopics = () => {
    const { error, loaded, posts, topics } = this.props

    if (error) {
      return <div>{error}</div>
    }

    if (!loaded) {
      return <div>Loading…</div>
    }

    if (!topics || !topics.length) {
      return <div>No topics.</div>
    }

    if (!posts || !posts.length) {
      return <div>No posts.</div>
    }

    return topics.sort(newestFirst).map(topic => {
      const post = this.postForTopic(topic)

      return (
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

          <Blurb>{sanitizedContent(post.cooked, 64)}</Blurb>
        </TopicItem>
      )
    })
  }

  private renderTopic = (topic: Topic) => {
    const post = this.postForTopic(topic)

    return (
      <React.Fragment>
        <Heading>
          <Title>
            <Link
              href={`${this.props.host}/t/${topic.id}`}
              title={`Read more about "${topic.title}" at ${this.props.host}`}
              target={'_blank'}
            >
              {topic.title}
            </Link>
          </Title>

          <div>
            <Timestamp>
              <FormattedRelative value={topic.created_at} />
            </Timestamp>
          </div>
        </Heading>

        <TopicItem>{sanitizedContent(post.cooked)}</TopicItem>
      </React.Fragment>
    )
  }

  private postForTopic = (topic: Topic): Post =>
    this.props
      .posts!.filter(post => post.topic_id === topic.id)
      .sort(oldestFirst)[0]

  private selectTopic = (selectedTopic: Topic | null) => {
    this.setState({ selectedTopic })
  }
}
