import * as React from 'react'
import { styled } from '../theme'
import { HelpButton } from './Button'

export const PageHeadingContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`

export const PageHeadingSection = styled('div')`
  display: flex;
`

export const PageHeadingText = styled('div')`
  font-weight: bold;
  font-size: 120%;
  margin-right: 20px;
`

export interface PageHeadingProps {
  title: string
  action?: React.ReactNode
}

export const PageHeading: React.SFC<PageHeadingProps> = ({ title, action }) => (
  <PageHeadingContainer>
    <PageHeadingSection>
      <PageHeadingText>{title}</PageHeadingText>
      {action}
    </PageHeadingSection>
    <HelpButton>?</HelpButton>
  </PageHeadingContainer>
)
