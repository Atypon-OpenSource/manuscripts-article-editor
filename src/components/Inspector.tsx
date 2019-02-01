import { debounceRender } from '@manuscripts/manuscript-editor'
import { styled } from '../theme/styled-components'

export const Inspector = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const DebouncedInspector = debounceRender(Inspector, 100, {
  leading: true,
  maxWait: 500,
})
