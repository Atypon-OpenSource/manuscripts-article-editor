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

import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React, { useEffect, useState } from 'react'
import { useDebounce } from '../../hooks/use-debounce'

const RECORD_ACTIVITY = gql`
  mutation RecordActivity(
    $containerId: String!
    $deviceId: String!
    $path: [String]
    $startPos: Int
    $endPos: Int
  ) {
    recordActivity(
      containerId: $containerId
      deviceId: $deviceId
      path: $path
      startPos: $startPos
      endPos: $endPos
    ) {
      containerId
      deviceId
      userId
    }
  }
`

const RECORD_IDLENESS = gql`
  mutation RecordIdleness($containerId: String!, $deviceId: String!) {
    recordIdleness(containerId: $containerId, deviceId: $deviceId) {
      containerId
      deviceId
      userId
    }
  }
`

const STOP_ACTIVITY = gql`
  mutation StopActivity($containerId: String!, $deviceId: String!) {
    stopActivity(containerId: $containerId, deviceId: $deviceId) {
      success
    }
  }
`

interface ActivityLocation {
  path: string[]
  root: string
  leaf: string
  startPos?: number
  endPos?: number
}

interface Activity {
  containerId: string
  datetime: string
  deviceId: string
  userId: string
  location: ActivityLocation
}

interface ActivityUpdate {
  containerId: string
  deviceId: string
  path: string[]
  startPos?: number
  endPos?: number
}

export const Presence: React.FC<{
  deviceId: string
  containerId: string
  manuscriptId: string
  selectedElementId?: string
}> = React.memo(
  ({ deviceId, containerId, manuscriptId, selectedElementId }) => {
    const [activity, setActivity] = useState<ActivityUpdate>()
    const [idle, setIdle] = useState<boolean>(document.hidden)

    const debouncedActivity = useDebounce<ActivityUpdate | undefined>(
      activity,
      1000
    )

    const debouncedIdle = useDebounce<boolean>(idle, 30000)

    const [recordActivity] = useMutation<
      {
        recordActivity: Activity
      },
      ActivityUpdate
    >(RECORD_ACTIVITY)

    const [recordIdleness] = useMutation<
      {
        recordIdleness: Activity
      },
      {
        containerId: string
        deviceId: string
      }
    >(RECORD_IDLENESS)

    const [stopActivity] = useMutation<
      {
        stopActivity: Activity
      },
      {
        containerId: string
        deviceId: string
      }
    >(STOP_ACTIVITY)

    useEffect(() => {
      if (debouncedIdle) {
        recordIdleness({
          variables: {
            containerId,
            deviceId,
          },
        }).catch(error => {
          // tslint:disable-next-line:no-console
          console.error(error)
        })
      }
    }, [containerId, deviceId, debouncedIdle, recordIdleness])

    useEffect(() => {
      if (debouncedActivity && !idle) {
        recordActivity({
          variables: debouncedActivity,
        }).catch(error => {
          // tslint:disable-next-line:no-console
          console.error(error)
        })
      }
    }, [debouncedActivity, idle, recordActivity])

    useEffect(() => {
      const buildPath = () => {
        const path = [manuscriptId]

        if (selectedElementId) {
          path.push(selectedElementId)
        }

        return path
      }

      setActivity({
        containerId,
        deviceId,
        path: buildPath(),
      })
    }, [containerId, deviceId, manuscriptId, selectedElementId])

    useEffect(() => {
      // call stopActivity on unmount
      return () => {
        stopActivity({
          variables: {
            containerId,
            deviceId,
          },
        }).catch(error => {
          // tslint:disable-next-line:no-console
          console.error(error)
        })
      }
    }, [containerId, deviceId, stopActivity])

    useEffect(() => {
      const handleVisibilityChange = () => {
        setIdle(document.hidden)
      }

      document.addEventListener(
        'visibilitychange',
        handleVisibilityChange,
        false
      )

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }, [])

    return null
  }
)
