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

import ChatIcon from '@manuscripts/assets/react/Chat'
import React, { useCallback, useEffect, useState } from 'react'
import { styled } from '../theme/styled-components'

export const Chatbox: React.FC = React.memo(() => {
  const [open, setOpen] = useState<boolean>()
  const [unreadCount, setUnreadCount] = useState<number>()

  // mirror the opened state to this component's state
  useEffect(() => {
    window.$crisp.push([
      'on',
      'chat:opened',
      () => {
        // wait a small amount of time so the button is already hidden
        window.setTimeout(() => {
          setOpen(true)
        }, 500)
      },
    ])
    window.$crisp.push(['on', 'chat:closed', () => setOpen(false)])

    const getUnreadCount = () => {
      // wait for some time, as asking for chat:unread:count immediately isn't reliable
      window.setTimeout(() => {
        if (typeof window.$crisp.get === 'function') {
          const unreadCount = window.$crisp.get('chat:unread:count')
          setUnreadCount(Number(unreadCount))
        }
      }, 5000)
    }

    if (typeof window.$crisp.get === 'function') {
      getUnreadCount()
    } else {
      window.CRISP_READY_TRIGGER = getUnreadCount
    }

    window.$crisp.push(['on', 'message:received', getUnreadCount])
    window.$crisp.push(['on', 'chat:closed', getUnreadCount])

    return () => {
      delete window.CRISP_READY_TRIGGER
      window.$crisp.push(['off', 'chat:opened'])
      window.$crisp.push(['off', 'chat:closed'])
      window.$crisp.push(['off', 'message:received'])
    }
  }, [])

  // show/hide the chatbox when it's opened/closed
  useEffect(() => {
    if (open) {
      window.$crisp.push(['do', 'chat:show'])
    } else {
      window.$crisp.push(['do', 'chat:hide'])
    }
  }, [open])

  // open the chatbox on button click
  const handleClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    window.$crisp.push(['do', 'chat:open'])
  }, [])

  if (open) {
    return null
  }

  return (
    <ChatButton onClick={handleClick}>
      {unreadCount ? <UnreadCount>{unreadCount}</UnreadCount> : null}
      <ChatIcon width={32} height={32} />
    </ChatButton>
  )
})

const ChatButton = styled.button`
  cursor: pointer;
  border: none;
  background: none;
  padding: 8px;
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 5000000;

  &:hover {
    & path {
      fill: #fdcd48;
    }
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: initial;
  }
`

const UnreadCount = styled.div`
  height: 12px;
  font-size: 10px;
  background: #fdcd48;
  padding: 2px 6px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border-radius: 8px;
  position: absolute;
  top: 4px;
  right: 4px;
`
