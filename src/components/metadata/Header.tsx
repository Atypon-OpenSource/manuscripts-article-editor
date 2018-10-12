import { styled } from '../../theme'

export const HeaderContainer = styled.header`
  padding: 0 32px;
`

export const Header = styled.div`
  font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: 18px;
  color: #353535;
  border-bottom: 1px solid #e2e2e2;
  padding: 16px 0;
  margin-bottom: 16px;

  & .ProseMirror {
    font-size: 27px;
    font-weight: 600;
  }
`
