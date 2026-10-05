import type {
  Inconsistency,
  InconsistencyAction,
  openAccessibilityFields,
  openMetadataTarget,
  selectInconsistency,
} from '@manuscripts/body-editor'

export type IssueActionView = Parameters<typeof selectInconsistency>[1]

export type IssueActionDependencies = {
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

type IssueActionContext = {
  inconsistency: Inconsistency
  view: IssueActionView
  dependencies: IssueActionDependencies
}

type IssueActionHandlers = {
  [Type in keyof ActionByType]: (
    action: ActionByType[Type],
    context: IssueActionContext
  ) => void
}

const issueActionHandlers: IssueActionHandlers = {
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
  context: IssueActionContext
) => issueActionHandlers[type](action, context)

export const executeIssueAction = (
  inconsistency: Inconsistency,
  view: IssueActionView | undefined,
  dependencies: IssueActionDependencies
): void => {
  if (!view) {
    return
  }

  const action = inconsistency.action ?? { type: 'navigate-to-node' }
  dispatchAction(action.type, action, { inconsistency, view, dependencies })
}
