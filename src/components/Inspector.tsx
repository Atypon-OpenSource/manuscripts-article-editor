import { styled } from '../theme'
import { debounceRender } from './DebounceRender'

export const Inspector = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const DebouncedInspector = debounceRender(Inspector, 100, {
  leading: true,
  maxWait: 500,
})
