import {
  Inconsistency,
  openAccessibilityFields,
  openMetadataTarget,
  selectInconsistency,
} from '@manuscripts/body-editor'
import { useCallback } from 'react'

import { executeInconsistencyAction } from '../lib/inconsistency-actions'
import { scrollIntoView } from '../lib/utils'
import { useStore } from '../store'
import { InspectorAction } from './use-inspector-tabs-context'

export const useInconsistencyActions = () => {
  const [{ view, doInspectorTab }] = useStore((store) => ({
    view: store.view,
    doInspectorTab: store.doInspectorTab,
  }))

  return useCallback(
    (inconsistency: Inconsistency) =>
      executeInconsistencyAction(inconsistency, view, {
        openAccessibility: openAccessibilityFields,
        openMainDocument: () =>
          doInspectorTab?.(InspectorAction.OpenMainDocument),
        openMetadata: openMetadataTarget,
        selectInconsistency,
        scrollIntoView,
      }),
    [doInspectorTab, view]
  )
}
