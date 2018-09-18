import { styled, ThemedProps } from '../theme'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const ResizerInner = styled.div`
  display: block;
  z-index: 2;
  overflow: hidden;
  position: absolute;

  &::before {
    content: '';
    position: absolute;
    transition: background-color 200ms ease-in-out 100ms;
    background: rgb(240, 240, 240);
  }

  &:hover::before {
    background: ${(props: ThemedDivProps) => props.theme.colors.button.primary};
  }
`

const HorizontalResizerInner = styled(ResizerInner)`
  cursor: ew-resize;
  top: 0;
  height: 100%;
  width: 16px;

  &::before {
    height: 100%;
    width: 2px;
  }
`

export const HorizontalStartResizerInner = styled(HorizontalResizerInner)`
  left: -16px;

  &::before {
    right: -1px;
  }
`

export const HorizontalEndResizerInner = styled(HorizontalResizerInner)`
  right: -16px;

  &::before {
    left: -1px;
  }
`

const VerticalResizerInner = styled(ResizerInner)`
  cursor: ns-resize;
  left: 0;
  height: 16px;
  width: 100%;

  &::before {
    width: 100%;
    height: 2px;
  }
`

export const VerticalStartResizerInner = styled(VerticalResizerInner)`
  top: -16px;

  &::before {
    bottom: -1px;
  }
`

export const VerticalEndResizerInner = styled(VerticalResizerInner)`
  bottom: -16px;

  &::before {
    top: -1px;
  }
`
