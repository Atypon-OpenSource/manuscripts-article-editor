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
import {
  commentsKey,
  inspectorActionPluginKey,
  selectedSuggestionKey,
} from '@manuscripts/body-editor'
import { trackChangesPluginKey } from '@manuscripts/track-changes-plugin'
import { useEffect, useLayoutEffect, useMemo } from 'react'

import { useDoWithThrottle } from '../api/savingUtilities'
import { useStore } from '../store'
import { useCreateEditor } from './use-create-editor'
import { useDebugUtils } from './use-debug-utils'
import { useHandleSnapshot } from './use-handle-snapshot'

export const useConnectEditor = () => {
  const [_, storeDispatch] = useStore((store) => store.manuscriptID)

  const editor = useCreateEditor()

  const { state, view } = editor
  const handleSnapshot = useHandleSnapshot(view)
  useDebugUtils()

  useEffect(() => {
    storeDispatch({ handleSnapshot })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view?.state])

  useLayoutEffect(() => {
    const trackState = trackChangesPluginKey.getState(state)
    if (trackState) {
      // set init tracking state
      storeDispatch({ trackState })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selection = useMemo(() => {
    const suggestion = selectedSuggestionKey.getState(state)?.suggestion
    const selection = commentsKey.getState(state)?.selection
    const inspectorOpenTabs =
      inspectorActionPluginKey.getState(state)?.inspectorOpenTabs
    return {
      selectedSuggestionID: suggestion?.id,
      selectedCommentKey: selection?.key,
      newCommentID: selection?.isNew ? selection?.id : undefined,
      inspectorOpenTabs: inspectorOpenTabs,
    }
  }, [state])

  useEffect(() => {
    storeDispatch(selection)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeDispatch, ...Object.values(selection)])

  const hasPendingSuggestions = useMemo(() => {
    const { changeSet } = trackChangesPluginKey.getState(state) || {}
    return changeSet && changeSet.pending.length > 0
  }, [state])

  useEffect(() => {
    storeDispatch({ hasPendingSuggestions })
  }, [storeDispatch, hasPendingSuggestions])

  useEffect(() => {
    storeDispatch({ editor })
  }, [storeDispatch, view]) // eslint-disable-line react-hooks/exhaustive-deps

  const doWithThrottle = useDoWithThrottle()
  useEffect(() => {
    const trackState = trackChangesPluginKey.getState(state)

    doWithThrottle(() => {
      // @TODO - test throttling
      storeDispatch({ doc: state.doc, trackState, view, editor })
    }, 200)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return editor
}
