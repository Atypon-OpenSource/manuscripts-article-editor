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

import Chat from '@manuscripts/assets/react/Chat'
import React, { useCallback, useEffect, useState } from 'react'
import { styled } from '../theme/styled-components'

export const Chatbox: React.FC = React.memo(() => {
  const [open, setOpen] = useState()
  const [available, setAvailable] = useState(false)

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
    window.$crisp.push(['on', 'website:availability:changed', setAvailable])

    const setWebsiteAvailability = () => {
      // wait for some time, as asking for website:available immediately isn't reliable
      window.setTimeout(() => {
        if (typeof window.$crisp.is === 'function') {
          const available = window.$crisp.is('website:available')
          setAvailable(available)
        }
      }, 5000)
    }

    if (typeof window.$crisp.is === 'function') {
      setWebsiteAvailability()
    } else {
      window.CRISP_READY_TRIGGER = setWebsiteAvailability
    }

    return () => {
      delete window.CRISP_READY_TRIGGER
      window.$crisp.push(['off', 'chat:opened'])
      window.$crisp.push(['off', 'chat:closed'])
      window.$crisp.push(['off', 'website:availability:changed'])
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

  if (open || !available) {
    return null
  }

  return (
    <FeedbackButton onClick={handleClick}>
      <Chat width={32} height={32} />
    </FeedbackButton>
  )
})

const FeedbackButton = styled.button`
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
