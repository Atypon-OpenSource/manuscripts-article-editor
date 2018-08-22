import React from 'react'
import { styled } from '../theme'

export const PageHeadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
`

export const PageHeadingSection = styled.div`
  display: flex;
`

export const PageHeadingText = styled.div`
  font-weight: 600;
  font-size: 30px;
`

export interface PageHeadingProps {
  action?: React.ReactNode
}

export const PageHeading: React.SFC<PageHeadingProps> = ({
  children,
  action,
}) => (
  <PageHeadingContainer>
    <PageHeadingSection>
      <PageHeadingText>{children}</PageHeadingText>
    </PageHeadingSection>
    <PageHeadingSection>{action}</PageHeadingSection>
  </PageHeadingContainer>
)
