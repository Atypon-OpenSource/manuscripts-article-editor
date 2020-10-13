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

import AddIcon from '@manuscripts/assets/react/AddIcon'
import { IconTextButton } from '@manuscripts/style-guide'
import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'

const RegularAddIcon = styled(AddIcon)``

const smallStyles = css`
  font-size: ${(props) => props.theme.font.size.normal};
`
const defaultStyles = css`
  svg {
    max-height: 28px;
    max-width: 28px;
  }
`
const mediumStyles = css`
  font-size: ${(props) => props.theme.font.size.medium};
  svg {
    max-height: 36px;
    max-width: 36px;
  }
`
const largeStyles = css`
  font-size: ${(props) => props.theme.font.size.xlarge};
  svg {
    max-height: 40px;
    max-width: 40px;
  }
`
const Action = styled(IconTextButton)<{
  size: 'small' | 'default' | 'medium' | 'large'
}>`
  font-size: ${(props) => props.theme.font.size.normal};
  text-overflow: ellipsis;

  ${(props) =>
    props.size === 'small'
      ? smallStyles
      : props.size === 'medium'
      ? mediumStyles
      : props.size === 'large'
      ? largeStyles
      : defaultStyles};

  svg {
    margin: 0;
  }

  svg path {
    transition: fill 0.5s;
  }

  &:focus,
  &:hover {
    svg path:first-of-type {
      fill: #f7b314;
    }
  }
`

const ActionTitle = styled.div`
  padding-left: ${(props) => props.theme.grid.unit * 3}px;
`
interface Props {
  action: React.MouseEventHandler
  id?: string
  size: 'small' | 'medium' | 'default' | 'large'
  title: string | ReactNode
}

export const AddButton: React.FunctionComponent<Props> = ({
  action,
  id,
  size,
  title,
}) => (
  <Action onClick={action} size={size} id={id}>
    <RegularAddIcon width={40} height={40} />
    <ActionTitle>{title}</ActionTitle>
  </Action>
)
