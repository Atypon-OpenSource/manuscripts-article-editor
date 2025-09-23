/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */
import { ManuscriptNode } from '@manuscripts/transform'

import { useStore } from '../store'

export interface InspectorOpenTabs {
  primaryTab: InspectorPrimaryTabs | null
  secondaryTab: InspectorSecondaryTabsFiles | null
}

export enum InspectorPrimaryTabs {
  Comments = 0,
  History = 1,
  Files = 2,
  Quality = 3,
}
export enum InspectorSecondaryTabsFiles {
  MainDocument = 1,
  SupplementsFiles = 2,
  OtherFiles = 3,
}

enum InspectorAction {
  OpenOtherFiles = 'open-other-files',
  OpenSupplementFiles = 'open-supplement-files',
  OpenQualityReport = 'open-quality-report',
  OpenSuggestions = 'open-suggestion',
}

export const useInspectorTabsParentControl = () => {
  const [_, dispatch] = useStore((state) => state.inspectorOpenTabs)

  function doInspectorTab(tab: InspectorAction) {
    const preppedTabs = prepareTabs(tab)
    if (preppedTabs.primaryTab != null || preppedTabs.secondaryTab != null) {
      dispatch({ inspectorOpenTabs: preppedTabs })
    }
  }
  dispatch({ doInspectorTab })
}

export const useInspectorTabsContext = () => {
  const [_, dispatch] = useStore((state) => state.inspectorOpenTabs)

  function setTabs(
    pos: number,
    node: ManuscriptNode,
    nodePos: number,
    event: MouseEvent
  ) {
    const target = event.target as HTMLElement
    if (
      target.dataset.action &&
      Object.values(InspectorAction).includes(
        target.dataset.action as InspectorAction
      )
    ) {
      const preppedTabs = prepareTabs(target.dataset.action as InspectorAction)
      if (preppedTabs.primaryTab != null || preppedTabs.secondaryTab != null) {
        event.stopPropagation()
        dispatch({ inspectorOpenTabs: preppedTabs })
      }
    }
  }

  return setTabs
}

function prepareTabs(action?: InspectorAction) {
  const inspectorOpenTabs: InspectorOpenTabs = {
    primaryTab: null,
    secondaryTab: null,
  }
  switch (action) {
    // @TODO - implement the rest of actions
    // case 'selec-main-file':
    case 'open-other-files':
      inspectorOpenTabs.primaryTab = InspectorPrimaryTabs.Files
      inspectorOpenTabs.secondaryTab = InspectorSecondaryTabsFiles.OtherFiles
      break
    case 'open-supplement-files':
      inspectorOpenTabs.primaryTab = InspectorPrimaryTabs.Files
      inspectorOpenTabs.secondaryTab =
        InspectorSecondaryTabsFiles.SupplementsFiles
      break
    default:
      break
  }
  return inspectorOpenTabs
}
