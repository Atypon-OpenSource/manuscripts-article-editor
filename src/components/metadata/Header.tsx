import { styled } from '../../theme/styled-components'

export const HeaderContainer = styled.header`
  padding: 0 32px;
`

export const Header = styled.div`
  font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: 18px;
  color: ${props => props.theme.colors.global.text.primary};
  border-bottom: 1px solid ${props => props.theme.colors.metadata.border};
  padding: 16px 0;
  margin-bottom: 16px;

  & .ProseMirror {
    font-size: 27px;
    font-weight: 600;
  }
`
