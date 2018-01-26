import * as React from 'react'
import styled from 'styled-components'

export const FooterBlock = styled('footer')`
  margin-top: 100px;
  //background-color: #303e4e;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
`

export const FooterLinks = styled('nav')`
  display: flex;
  justify-content: center;
`

export const FooterLink = styled('a')`
  display: inline-flex;
  padding: 5px;
  color: white;
  text-decoration: none;
`

export const FooterLinkSeparator = styled('span')`
  display: inline-flex;
  padding: 0 5px;
`

interface FooterLink {
  url: string
  text: string
}

interface FooterProps {
  links: FooterLink[]
}

export const Footer: React.SFC<FooterProps> = ({ links }) => (
  <FooterBlock>
    <FooterLinks>
      {links.map((link, index) => (
        <span key={link.url}>
          {!!index && <FooterLinkSeparator>|</FooterLinkSeparator>}
          <FooterLink href={link.url}>{link.text}</FooterLink>
        </span>
      ))}
    </FooterLinks>
  </FooterBlock>
)
