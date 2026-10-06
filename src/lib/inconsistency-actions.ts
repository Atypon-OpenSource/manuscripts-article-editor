import type {
  Inconsistency,
  InconsistencyAction,
  openAccessibilityFields,
  openMetadataTarget,
  selectInconsistency,
} from '@manuscripts/body-editor'

export type InconsistencyActionView = Parameters<typeof selectInconsistency>[1]

export type InconsistencyActionDependencies = {
  openAccessibility: typeof openAccessibilityFields
  openMainDocument: () => void
  openMetadata: typeof openMetadataTarget
  selectInconsistency: typeof selectInconsistency
  scrollIntoView: (element: HTMLElement) => void
}

type ActionByType = {
  [Type in InconsistencyAction['type']]: Extract<
    InconsistencyAction,
    { type: Type }
  >
}

type InconsistencyActionContext = {
  inconsistency: Inconsistency
  view: InconsistencyActionView
  dependencies: InconsistencyActionDependencies
}

type InconsistencyActionHandlers = {
  [Type in keyof ActionByType]: (
    action: ActionByType[Type],
    context: InconsistencyActionContext
  ) => void
}

const inconsistencyActionHandlers: InconsistencyActionHandlers = {
  'navigate-to-node': (_, { inconsistency, view, dependencies }) => {
    const domNode = dependencies.selectInconsistency(inconsistency, view)
    if (domNode) {
      dependencies.scrollIntoView(domNode)
    }
  },
  'open-accessibility': (_, { inconsistency, view, dependencies }) => {
    const domNode = dependencies.openAccessibility(inconsistency, view)
    if (domNode) {
      dependencies.scrollIntoView(domNode)
    }
  },
  'open-metadata': (action, { inconsistency, view, dependencies }) => {
    dependencies.openMetadata(inconsistency.pos, view, action.tab, {
      addNew: false,
    })
  },
  'open-files': (_, { dependencies }) => {
    dependencies.openMainDocument()
  },
}

const dispatchAction = <Type extends keyof ActionByType>(
  type: Type,
  action: ActionByType[Type],
  context: InconsistencyActionContext
) => inconsistencyActionHandlers[type](action, context)

export const executeInconsistencyAction = (
  inconsistency: Inconsistency,
  view: InconsistencyActionView | undefined,
  dependencies: InconsistencyActionDependencies
): void => {
  if (!view) {
    return
  }

  const action = inconsistency.action ?? { type: 'navigate-to-node' }
  dispatchAction(action.type, action, { inconsistency, view, dependencies })
}
