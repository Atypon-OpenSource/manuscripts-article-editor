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

import CommunityIcon from '@manuscripts/assets/react/Community'
import DocumentationIcon from '@manuscripts/assets/react/Documentation'
import SupportIcon from '@manuscripts/assets/react/Support'
import { IconButton } from '@manuscripts/style-guide'
import { Placement } from 'popper.js'
import React from 'react'
import { Manager, Popper, Reference } from 'react-popper'
import styled, { css } from 'styled-components'

import config from '../config'
import { useDropdown } from '../hooks/use-dropdown'
import { Popup } from './nav/Updates'

const Button = styled(IconButton).attrs(() => ({
  size: 56,
}))`
  color: ${(props) => props.theme.colors.text.secondary};
  padding: ${(props) => props.theme.grid.unit * 2}px;
`

const StyledSupportIcon = styled(SupportIcon)`
  g {
    stroke: currentColor;
  }

  &:hover {
    g {
      stroke: #7fb5d5;
    }
  }
`

const linkStyle = css`
  display: flex;
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 4}px;
  align-items: center;
  font-size: ${(props) => props.theme.font.size.normal};
  color: ${(props) => props.theme.colors.text.primary};
  text-decoration: none;

  &:hover {
    background: ${(props) => props.theme.colors.background.fifth};
  }
`

const ExternalMenuLink = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferer',
})`
  ${linkStyle}
`

const MenuText = styled.div`
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
`

const Menu = styled.div`
  padding: ${(props) => props.theme.grid.unit * 2}px 0;
`

const arrowTopBorderStyle = css`
  bottom: -${(props) => props.theme.grid.unit * 2}px;
  border-top: ${(props) => props.theme.grid.unit * 2}px solid
    ${(props) => props.theme.colors.border.secondary};
`

const arrowBottomBorderStyle = css`
  top: -${(props) => props.theme.grid.unit * 2}px;
  border-bottom: ${(props) => props.theme.grid.unit * 2}px solid
    ${(props) => props.theme.colors.border.secondary};
`

const Arrow = styled.div<{
  'data-placement': Placement
}>`
  width: 0;
  height: 0;
  border-left: ${(props) => props.theme.grid.unit * 2}px solid transparent;
  border-right: ${(props) => props.theme.grid.unit * 2}px solid transparent;
  ${(props) =>
    props['data-placement'] === 'top'
      ? arrowTopBorderStyle
      : arrowBottomBorderStyle};
  position: absolute;
`

const Container = styled.div`
  position: relative;
`

export const Support: React.FC = React.memo(() => {
  const { wrapperRef, toggleOpen, isOpen } = useDropdown()

  return (
    <Manager>
      <div ref={wrapperRef}>
        <Reference>
          {({ ref }) => (
            <Button ref={ref} onClick={toggleOpen}>
              <StyledSupportIcon width={32} height={32} />
            </Button>
          )}
        </Reference>

        {isOpen && (
          <Popper placement={'top'}>
            {({ ref, style, placement, arrowProps }) => (
              <div
                ref={ref}
                style={{ ...style, zIndex: 3 }}
                data-placement={placement}
              >
                <Container>
                  <Popup>
                    <Menu>
                      {config.leanWorkflow.enabled || (
                        <ExternalMenuLink
                          href={'https://community.manuscripts.io/'}
                        >
                          <CommunityIcon />
                          <MenuText>Community</MenuText>
                        </ExternalMenuLink>
                      )}

                      <ExternalMenuLink
                        href={'https://support.manuscripts.io/'}
                      >
                        <DocumentationIcon />
                        <MenuText>Documentation</MenuText>
                      </ExternalMenuLink>
                    </Menu>
                  </Popup>

                  <Arrow {...arrowProps} data-placement={placement} />
                </Container>
              </div>
            )}
          </Popper>
        )}
      </div>
    </Manager>
  )
})
