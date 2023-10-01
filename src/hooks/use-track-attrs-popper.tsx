/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2023 Atypon Systems LLC. All Rights Reserved.
 */
import { TrackAttrsPopperContent } from '@manuscripts/style-guide'
import { NodeAttrChange } from '@manuscripts/track-changes-plugin'
import React, { useCallback } from 'react'
import ReactDOM from 'react-dom'

import { useEditorStore } from '../components/track-changes/useEditorStore'
import { filterAttrsChange } from '../lib/attrs-change-filter'
import { useStore } from '../store'
import { ThemeProvider } from '../theme/ThemeProvider'

export default () => {
  const { trackState, execCmd } = useEditorStore()

  const [{ selectedAttrsChange, popper }, dispatch] = useStore((store) => ({
    selectedAttrsChange: store.selectedAttrsChange,
    popper: store.popper,
  }))

  const cleanSelectedChange = useCallback(() => {
    const previousSelection = document.querySelector(`.track-attrs-popper`)
    previousSelection && ReactDOM.unmountComponentAtNode(previousSelection)
    popper.destroy()
    document
      .querySelector('.attrs-popper-button-active')
      ?.classList.replace('attrs-popper-button-active', 'attrs-popper-button')
    dispatch({ selectedAttrsChange: undefined })
  }, [dispatch, popper])

  const renderAttrsChangePopper = useCallback(
    (changeId: string, attrTrackingButton: HTMLButtonElement) => {
      if (!trackState) {
        return
      }

      attrTrackingButton.classList.replace(
        'attrs-popper-button',
        'attrs-popper-button-active'
      )

      const { newAttrs, oldAttrs } = filterAttrsChange(
        trackState.changeSet.get(changeId) as NodeAttrChange
      )

      const popperContainer = document.createElement('div')
      popperContainer.className = 'track-attrs-popper'
      ReactDOM.render(
        <ThemeProvider>
          <TrackAttrsPopperContent
            newAttrs={newAttrs}
            oldAttrs={oldAttrs}
            changeId={changeId}
            updateState={(cmd) => {
              cleanSelectedChange()
              execCmd(cmd)
            }}
          />
        </ThemeProvider>,
        popperContainer
      )
      popper.show(attrTrackingButton, popperContainer)
      dispatch({ selectedAttrsChange: changeId })
    },
    [cleanSelectedChange, dispatch, execCmd, popper, trackState]
  )

  return useCallback(
    (e: React.MouseEvent) => {
      const attrTrackingButton = (e.target as HTMLElement).closest(
        '.attrs-popper-button,.attrs-popper-button-active'
      ) as HTMLButtonElement | null

      cleanSelectedChange()

      if (attrTrackingButton) {
        const changeId = attrTrackingButton.value

        if (selectedAttrsChange !== changeId) {
          renderAttrsChangePopper(changeId, attrTrackingButton)
        } else {
          dispatch({ selectedAttrsChange: undefined })
        }
      }
    },
    [
      cleanSelectedChange,
      dispatch,
      renderAttrsChangePopper,
      selectedAttrsChange,
    ]
  )
}
