import { styled, ThemedProps } from '../theme'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const ResizerInner = styled.div`
  display: block;
  z-index: 2;

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

const HorizontalResizerInner = ResizerInner.extend`
  cursor: ew-resize;
  top: 0;
  height: 100%;
  width: 16px;

  &::before {
    height: 100%;
    width: 2px;
  }
`

export const HorizontalStartResizerInner = HorizontalResizerInner.extend`
  left: -16px;

  &::before {
    right: -1px;
  }
`

export const HorizontalEndResizerInner = HorizontalResizerInner.extend`
  right: -16px;

  &::before {
    left: -1px;
  }
`

const VerticalResizerInner = ResizerInner.extend`
  cursor: ns-resize;
  left: 0;
  height: 16px;
  width: 100%;

  &::before {
    width: 100%;
    height: 2px;
  }
`

export const VerticalStartResizerInner = VerticalResizerInner.extend`
  top: -16px;

  &::before {
    bottom: -1px;
  }
`

export const VerticalEndResizerInner = VerticalResizerInner.extend`
  bottom: -16px;

  &::before {
    top: -1px;
  }
`
