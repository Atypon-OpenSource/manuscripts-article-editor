/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import CommunityIcon from '@manuscripts/assets/react/Community'
import DocumentationIcon from '@manuscripts/assets/react/Documentation'
import FeedbackIcon from '@manuscripts/assets/react/FeedbackIcon'
import SupportIcon from '@manuscripts/assets/react/Support'
import { Placement } from 'popper.js'
import React, { useCallback, useState } from 'react'
import { Manager, Popper, Reference } from 'react-popper'
import { NavLink } from 'react-router-dom'
import { css, styled } from '../theme/styled-components'
import { Popup } from './nav/Updates'

const Button = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  padding: 14px;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: initial;
  }
`

const StyledFeedbackIcon = styled(FeedbackIcon)`
  path {
    stroke: #7fb5d5;
  }

  text {
    fill: #7fb5d5;
  }
`

const linkStyle = css`
  display: flex;
  padding: 8px 16px;
  align-items: center;
  font-size: 14px;
  color: ${props => props.theme.colors.dropdown.text.primary};
  text-decoration: none;

  &:hover {
    background: ${props => props.theme.colors.dropdown.background.hovered};
    color: ${props => props.theme.colors.dropdown.text.hovered};

    path {
      stroke: ${props => props.theme.colors.dropdown.text.hovered};
    }
  }
`

const MenuLink = styled(NavLink)`
  ${linkStyle}
`

const ExternalMenuLink = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferer',
})`
  ${linkStyle}
`

const MenuText = styled.div`
  margin-left: 8px;
`

const Menu = styled.div`
  padding: 8px 0;
`

const arrowTopBorderStyle = css`
  bottom: -8px;
  border-top: 8px solid ${props => props.theme.colors.popper.border};
`

const arrowBottomBorderStyle = css`
  top: -8px;
  border-bottom: 8px solid ${props => props.theme.colors.popper.border};
`

const Arrow = styled.div<{
  'data-placement': Placement
}>`
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  ${props =>
    props['data-placement'] === 'top'
      ? arrowTopBorderStyle
      : arrowBottomBorderStyle};
  position: absolute;
`

const Container = styled.div`
  position: relative;
`

export const Support: React.FC = React.memo(() => {
  const [open, setOpen] = useState(false)

  const toggleOpen = useCallback(() => {
    setOpen(value => !value)
  }, [])

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <Button ref={ref} onClick={toggleOpen}>
            <StyledFeedbackIcon width={32} height={32} />
          </Button>
        )}
      </Reference>

      {open && (
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
                    <ExternalMenuLink
                      href={'https://community.manuscripts.io/'}
                    >
                      <CommunityIcon />
                      <MenuText>Community</MenuText>
                    </ExternalMenuLink>

                    <ExternalMenuLink href={'https://manual.manuscripts.io/'}>
                      <DocumentationIcon />
                      <MenuText>Documentation</MenuText>
                    </ExternalMenuLink>

                    <MenuLink to={'/feedback'}>
                      <SupportIcon />
                      <MenuText>Support</MenuText>
                    </MenuLink>
                  </Menu>
                </Popup>

                <Arrow {...arrowProps} data-placement={placement} />
              </Container>
            </div>
          )}
        </Popper>
      )}
    </Manager>
  )
})
