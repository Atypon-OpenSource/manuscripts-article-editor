import axios from 'axios'
import React from 'react'
import { Manager, Popper, Reference } from 'react-popper'
import { deYorkGreen } from '../colors'
import config from '../config'
import { styled } from '../theme'
import { newestFirst, Popup, Post, Topic, Updates } from './Updates'

const Wrapper = styled.div`
  position: relative;
`

const Notification = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  position: absolute;
  top: 10px;
  right: 0;
  background: ${deYorkGreen};
`

interface State {
  error: string | null
  isOpen: boolean
  loaded: boolean
  posts: Post[] | null
  topics: Topic[] | null
}

export class UpdatesContainer extends React.Component<{}, State> {
  public state: Readonly<State> = {
    error: null,
    isOpen: false,
    loaded: false,
    posts: null,
    topics: null,
  }

  private requestInterval: number

  public componentDidMount() {
    this.fetchData()
    this.requestInterval = window.setInterval(this.fetchData, 1000 * 60 * 5)
  }

  public componentWillUnmount() {
    window.clearInterval(this.requestInterval)
  }

  public render() {
    const { children } = this.props
    const { isOpen, loaded, error, topics, posts } = this.state

    if (!config.discourse.host) return children

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <Wrapper
              // @ts-ignore: styled
              ref={ref}
              onClick={this.toggleOpen}
            >
              {this.hasUpdates() && <Notification />}
              {children}
            </Wrapper>
          )}
        </Reference>

        {isOpen && (
          <Popper placement={'right'}>
            {({ ref, style, placement }) => (
              <div ref={ref} style={style} data-placement={placement}>
                <Popup>
                  <Updates
                    host={config.discourse.host}
                    error={error}
                    loaded={loaded}
                    posts={posts}
                    topics={topics}
                  />
                </Popup>
              </div>
            )}
          </Popper>
        )}
      </Manager>
    )
  }

  private fetchData = async () => {
    if (!config.discourse.host) return

    try {
      const response = await axios.get<{
        posts: Post[]
        topics: Topic[]
      }>(`${config.discourse.host}/search.json`, {
        params: {
          q: 'category:updates order:latest_topic',
        },
      })

      if (response.data) {
        const { posts, topics } = response.data
        this.setState({ posts, topics, loaded: true })
      } else {
        this.setState({ error: 'No response' })
      }
    } catch (error) {
      this.setState({ error })
    }
  }

  private hasUpdates = (): boolean => {
    const topic = this.latestTopic()

    if (!topic) return false

    const latest = window.localStorage.getItem('changelog')

    if (!latest) return true

    return latest < topic.created_at
  }

  private latestTopic = (): Topic | null => {
    const { topics } = this.state

    if (!topics || !topics.length) return null

    return topics.sort(newestFirst)[0]
  }

  private toggleOpen = () => {
    const { isOpen } = this.state

    if (!isOpen) {
      const topic = this.latestTopic()

      if (topic) {
        window.localStorage.setItem('changelog', topic.created_at)
      }
    }

    this.setState(state => ({
      ...state,
      isOpen: !state.isOpen,
    }))
  }
}
