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

import BellNormal from '@manuscripts/assets/react/BellNormal'
import axios, { CancelTokenSource } from 'axios'
import React from 'react'
import { Manager, Popper, Reference } from 'react-popper'
import config from '../../config'
import { manuscriptsBlue } from '../../theme/colors'
import { styled } from '../../theme/styled-components'
import { newestFirst, Popup, Post, Topic, Updates } from './Updates'

const Wrapper = styled.div`
  position: relative;
  margin: 0 12px;
`

const Bubble = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  top: -2px;
  right: -2px;
  cursor: pointer;
  background: ${manuscriptsBlue};
  border: 2px solid white;
`

const StyledBellIcon = styled(BellNormal)``

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover ${StyledBellIcon} g {
    fill: ${manuscriptsBlue};
  }
`

interface State {
  error?: string
  isOpen: boolean
  loaded: boolean
  posts?: Post[]
  topics?: Topic[]
  hasUpdates: boolean
}

export class UpdatesContainer extends React.Component<{}, State> {
  public static getDerivedStateFromError = (error: Error) => ({
    error: 'The latest updates could not be displayed.',
  })

  public state: Readonly<State> = {
    isOpen: false,
    loaded: false,
    hasUpdates: false,
  }

  private requestInterval: number

  private cancelSource: CancelTokenSource = axios.CancelToken.source()

  private nodeRef: React.RefObject<HTMLDivElement> = React.createRef()

  public componentDidCatch(error: Error) {
    // tslint:disable-next-line:no-console
    console.error(error)
  }

  public componentDidMount() {
    this.fetchData().catch(() => {
      // ignore fetch errors
    })
    this.requestInterval = window.setInterval(this.fetchData, 1000 * 60 * 5)
    this.addClickListener()
  }

  public componentWillUnmount() {
    window.clearInterval(this.requestInterval)
    this.removeClickListener()
    this.cancelSource.cancel()
  }

  public render() {
    const { children } = this.props
    const { isOpen, loaded, error, topics, posts, hasUpdates } = this.state

    if (!config.discourse.host) return children

    return (
      <div ref={this.nodeRef}>
        <Manager>
          <Reference>
            {({ ref }) => (
              <Wrapper ref={ref} onClick={this.toggleOpen}>
                {hasUpdates && <Bubble />}
                <Icon>
                  <StyledBellIcon width={32} height={32} />
                </Icon>
              </Wrapper>
            )}
          </Reference>

          {isOpen && (
            <Popper placement={'right'}>
              {({ ref, style, placement }) => (
                <div
                  ref={ref}
                  style={{ ...style, zIndex: 2 }}
                  data-placement={placement}
                >
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
      </div>
    )
  }

  private fetchData = async () => {
    if (!config.discourse.host) return

    const response = await axios.get<{
      posts: Post[]
      topics: Topic[]
    }>(`${config.discourse.host}/search.json`, {
      params: {
        q: 'category:updates order:latest_topic',
      },
      cancelToken: this.cancelSource.token,
    })

    if (response.data) {
      const { posts, topics } = response.data
      const hasUpdates = this.hasUpdates(topics)
      this.setState({ posts, topics, loaded: true, hasUpdates })
    } else {
      this.setState({ error: 'No response' })
    }
  }

  private hasUpdates = (topics?: Topic[]): boolean => {
    const topic = this.latestTopic(topics)

    if (!topic) return false

    const latest = window.localStorage.getItem('changelog')

    if (!latest) return true

    return latest < topic.created_at
  }

  private latestTopic = (topics?: Topic[]): Topic | null => {
    if (!topics || !topics.length) return null

    return topics.sort(newestFirst)[0]
  }

  private handleClickOutside = (event: Event) => {
    if (
      this.state.isOpen &&
      this.nodeRef.current &&
      !this.nodeRef.current.contains(event.target as Node)
    ) {
      this.setState({
        isOpen: false,
      })
    }
  }

  private addClickListener() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  private removeClickListener() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  private toggleOpen = () => {
    const { isOpen } = this.state

    if (!isOpen) {
      const topic = this.latestTopic(this.state.topics)

      if (topic) {
        window.localStorage.setItem('changelog', topic.created_at)
      }
    }

    this.setState({
      isOpen: !isOpen,
      hasUpdates: false,
    })
  }
}
