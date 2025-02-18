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
}
export enum InspectorSecondaryTabsFiles {
  SupplementsFiles = 1,
  OtherFiles = 2,
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
    const inspectorOpenTabs: InspectorOpenTabs = {
      primaryTab: null,
      secondaryTab: null,
    }
    switch (target.dataset.action) {
      case 'open-other-files':
        event.stopPropagation()
        inspectorOpenTabs.primaryTab = InspectorPrimaryTabs.Files
        inspectorOpenTabs.secondaryTab = InspectorSecondaryTabsFiles.OtherFiles
        break
      case 'open-supplement-files':
        event.stopPropagation()
        inspectorOpenTabs.primaryTab = InspectorPrimaryTabs.Files
        inspectorOpenTabs.secondaryTab =
          InspectorSecondaryTabsFiles.SupplementsFiles
        break
      default:
        break
    }
    if (
      inspectorOpenTabs.primaryTab != null ||
      inspectorOpenTabs.secondaryTab != null
    ) {
      dispatch({ inspectorOpenTabs })
    }
  }

  return setTabs
}
