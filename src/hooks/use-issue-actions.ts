import {
  Inconsistency,
  openAccessibilityFields,
  openMetadataTarget,
  selectInconsistency,
} from '@manuscripts/body-editor'
import { useCallback } from 'react'

import { executeIssueAction } from '../lib/issue-actions'
import { scrollIntoView } from '../lib/utils'
import { useStore } from '../store'
import { InspectorAction } from './use-inspector-tabs-context'

export const useIssueActions = () => {
  const [{ view, doInspectorTab }] = useStore((store) => ({
    view: store.view,
    doInspectorTab: store.doInspectorTab,
  }))

  return useCallback(
    (inconsistency: Inconsistency) =>
      executeIssueAction(inconsistency, view, {
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
