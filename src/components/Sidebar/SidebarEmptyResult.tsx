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
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
  Tip,
} from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'

const EmptyTextContainer = styled.div`
  padding-left: ${props => props.theme.grid.unit * 10}px;
  line-height: ${props => props.theme.font.lineHeight.large};
  max-width: 230px;
`
const EmptyTextTitle = styled.div`
  margin-bottom: ${props => props.theme.grid.unit * 2}px;
  font-weight: ${props => props.theme.font.weight.bold};
`

const SidebarText = styled.div`
  font-size: ${props => props.theme.font.size.medium};
  margin-bottom: ${props => props.theme.grid.unit * 8}px;
  margin-top: ${props => props.theme.grid.unit * 10}px;
`

const SidebarButtonContainer = styled(ButtonGroup)`
  flex-wrap: wrap;
  justify-content: flex-start;
  div,
  button {
    white-space: unset;
    width: 100%;
  }

  > div,
  > button {
    margin-bottom: ${props => props.theme.grid.unit * 4}px;
  }
`

interface ButtonProps {
  action: (event: React.MouseEvent) => void
  text: string
  tip?: {
    text: string | HTMLElement
    placement: 'left' | 'right' | 'top' | 'bottom'
  }
}

interface Props {
  primaryButton?: ButtonProps
  secondaryButton?: ButtonProps
  text?: string | JSX.Element
}

export class SidebarEmptyResult extends React.Component<Props> {
  public render() {
    const { primaryButton, secondaryButton, text } = this.props
    return (
      <EmptyTextContainer>
        <SidebarText data-cy={'sidebar-text'}>
          <EmptyTextTitle>No matches found.</EmptyTextTitle>
          {text}
        </SidebarText>
        <SidebarButtonContainer>
          {primaryButton &&
            (primaryButton.tip
              ? this.renderTip(primaryButton, true)
              : this.renderButton(primaryButton, true))}
          {secondaryButton &&
            (secondaryButton.tip
              ? this.renderTip(secondaryButton, false)
              : this.renderButton(secondaryButton, false))}
        </SidebarButtonContainer>
      </EmptyTextContainer>
    )
  }

  private renderButton = (button: ButtonProps, primary: boolean) => {
    return primary ? (
      <PrimaryButton onClick={button.action}>{button.text}</PrimaryButton>
    ) : (
      <SecondaryButton onClick={button.action}>{button.text}</SecondaryButton>
    )
  }
  private renderTip = (button: ButtonProps, primary: boolean) => {
    return (
      <Tip
        title={button.tip && button.tip.text}
        placement={button.tip && button.tip.placement}
      >
        {this.renderButton(button, primary)}
      </Tip>
    )
  }
}
