import { Bundle } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { jellyBeanBlue } from '../../colors'
import { styled } from '../../theme'

const InfoLink = styled.a.attrs({
  target: '_blank',
  rel: 'noopener',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${jellyBeanBlue};
  margin: 0.5ch;
  line-height: 0;
  text-decoration: none;
`

export const TemplateInfoLink: React.FunctionComponent<{ bundle?: Bundle }> = ({
  bundle,
}) =>
  bundle && bundle.csl && bundle.csl['documentation-URL'] ? (
    <InfoLink href={bundle.csl['documentation-URL']}>ⓘ</InfoLink>
  ) : null
