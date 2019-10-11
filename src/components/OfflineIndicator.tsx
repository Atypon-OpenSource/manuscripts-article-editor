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

import { Tip } from '@manuscripts/style-guide'
import React from 'react'
import useOnlineState, { OnlineState } from '../hooks/use-online-state'
import { styled } from '../theme/styled-components'

const Wrapper = styled.div`
  display: flex;
  position: relative;
`

const Bubble = styled.div`
  width: ${props => props.theme.grid.unit * 3}px;
  height: ${props => props.theme.grid.unit * 3}px;
  border-radius: 50%;
  position: absolute;
  top: -2px;
  right: -2px;
  cursor: pointer;
  background: ${props => props.theme.colors.border.secondary};
  border: 2px solid white;
`

const OfflineIndicator: React.FC<{}> = ({ children }) => {
  const [onlineState] = useOnlineState()

  return (
    <Wrapper>
      {onlineState === OnlineState.Online ? null : (
        <Tip placement={'right-end'} title={'Working offline'}>
          <Bubble />
        </Tip>
      )}
      {children}
    </Wrapper>
  )
}

export default OfflineIndicator
