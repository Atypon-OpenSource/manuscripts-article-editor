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

import React from 'react'
import { Link } from 'react-router-dom'
import { styled } from '../theme/styled-components'

export const FooterBlock = styled('footer')`
  position: absolute;
  bottom: 7px;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  color: #777;
`

export const FooterLinks = styled('nav')`
  display: flex;
  justify-content: center;
`

export const FooterLink = styled(Link)`
  display: inline-flex;
  color: inherit;
  padding: 5px;
  text-decoration: none;
`

export const FooterLinkSeparator = styled.span`
  display: inline-flex;
  padding: 0 5px;
`

export const Footer: React.FunctionComponent<{
  links: Array<{
    url: string
    text: string
  }>
}> = ({ links }) => (
  <FooterBlock>
    <FooterLinks>
      {links.map((link, index) => (
        <span key={link.url}>
          {!!index && <FooterLinkSeparator>|</FooterLinkSeparator>}
          <FooterLink to={link.url}>{link.text}</FooterLink>
        </span>
      ))}
    </FooterLinks>
  </FooterBlock>
)
