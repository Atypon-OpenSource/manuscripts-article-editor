import * as React from 'react'
import Search from '../icons/search'
import { styled } from '../theme'
import { HelpButton } from './Button'

export const PageHeadingContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
`

export const PageHeadingSection = styled('div')`
  display: flex;
`

export const PageHeadingText = styled('div')`
  font-weight: 600;
  font-size: 30px;
`

export interface PageHeadingProps {
  title: string
  action?: React.ReactNode
}

export const PageHeading: React.SFC<PageHeadingProps> = ({ title, action }) => (
  <PageHeadingContainer>
    <PageHeadingSection>
      <PageHeadingText>{title}</PageHeadingText>
    </PageHeadingSection>
    <PageHeadingSection>
      <HelpButton>
        <Search size={16} />
      </HelpButton>
      {action}
    </PageHeadingSection>
  </PageHeadingContainer>
)
