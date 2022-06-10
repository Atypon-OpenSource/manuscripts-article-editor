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

import Check from '@manuscripts/assets/react/Check'
import { ObjectTypes, Project } from '@manuscripts/manuscripts-json-schema'
import { SecondaryButton } from '@manuscripts/style-guide'
import React, { useCallback, useState } from 'react'
import { v4 as uuid } from 'uuid'

import {
  NotificationComponent,
  ShowNotification,
} from '../components/NotificationProvider'
import {
  NotificationActions,
  NotificationHead,
  NotificationMessage,
  NotificationPrompt,
  NotificationTitle,
} from '../components/Notifications'
import * as api from '../lib/snapshot'
import { exportProject } from '../pressroom/exporter'
import CollectionManager from '../sync/CollectionManager'

export enum SaveSnapshotStatus {
  Ready = 'Ready',
  Submitting = 'Submitting',
  GotResponse = 'GotResponse',
  Saved = 'Saved',
  Error = 'Error',
}

interface SnapshotData {
  creator: string
  key: string
  proofs?: string[]
}

interface State {
  textName: string
  status: SaveSnapshotStatus
  nameSubmitted: boolean
  snapshotData?: SnapshotData
}

const getInitialState = (): State => ({
  textName: '',
  status: SaveSnapshotStatus.Ready,
  nameSubmitted: false,
})

export const buildSnapshot = (
  { creator, key, proofs }: SnapshotData,
  name: string
) => ({
  _id: `MPSnapshot:${uuid()}`,
  objectType: ObjectTypes.Snapshot,
  creator,
  s3Id: key,
  proof: proofs && proofs.filter(Boolean),
  name,
})

const SnapshotSuccessNotification: NotificationComponent = ({
  removeNotification,
}) => (
  <NotificationPrompt>
    <NotificationHead>
      <Check color={'green'} />
      <NotificationMessage>
        <NotificationTitle>Snapshot saved successfully</NotificationTitle>
      </NotificationMessage>
    </NotificationHead>
    <NotificationActions>
      <SecondaryButton onClick={removeNotification}>Dismiss</SecondaryButton>
    </NotificationActions>
  </NotificationPrompt>
)

export const useSnapshotManager = (
  project: Project,
  showNotification?: ShowNotification
) => {
  const collection = CollectionManager.getCollection(`project-${project._id}`)

  const [state, setState] = useState<State>(getInitialState)

  const getEntireProject = useCallback(
    () =>
      collection
        .find({ containerID: project._id })
        .exec()
        .then((models) => {
          return new Map(
            models.map((model) => {
              const json = model.toJSON()
              return [json._id, json]
            })
          )
        }),
    [collection, project]
  )

  const saveSnapshot = useCallback(
    (data: SnapshotData, name: string) => {
      collection
        .save(buildSnapshot(data, name), { containerID: project._id })
        .catch((e) => {
          console.error('Error saving snapshot', e)
        })
      if (showNotification) {
        showNotification('snapshot', SnapshotSuccessNotification)
      }
      setState(getInitialState())
    },
    [collection, showNotification, project]
  )

  const requestTakeSnapshot = useCallback(async () => {
    try {
      setState({
        ...state,
        status: SaveSnapshotStatus.Submitting,
      })
      const projectModelMap = await getEntireProject()
      const blob = await exportProject(
        collection.getAttachmentAsBlob,
        projectModelMap,
        null,
        'manuproj',
        project
      )
      const data = await api.takeSnapshot(project._id, blob)
      if (state.nameSubmitted) {
        saveSnapshot(data, state.textName)
      } else {
        setState((state) => ({
          ...state,
          status: SaveSnapshotStatus.GotResponse,
          snapshotData: data,
        }))
      }
    } catch (e) {
      setState((state) => ({ ...state, status: SaveSnapshotStatus.Error }))
    }
  }, [
    state,
    getEntireProject,
    collection.getAttachmentAsBlob,
    project,
    saveSnapshot,
  ])

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      setState({ ...state, textName: e.target.value })
    },
    [state]
  )

  const submitName = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault()
      if (state.status === SaveSnapshotStatus.GotResponse) {
        saveSnapshot(state.snapshotData!, state.textName)
      } else {
        setState({ ...state, nameSubmitted: true })
      }
    },
    [saveSnapshot, state]
  )

  return {
    textValue: state.textName,
    requestTakeSnapshot,
    handleTextChange,
    submitName,
    status: state.status,
  }
}
