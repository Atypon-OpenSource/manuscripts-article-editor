import { Link } from 'react-router-dom'
import { styled } from '../theme'

export const CenteredForm = styled('form')`
  text-align: center;
  width: 450px;
`

export const FormHeader = styled('div')`
  padding: 40px;
  text-align: center;
`

export const FormActions = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.51);
`

export const FormLink = styled(Link)`
  text-transform: uppercase;
  text-decoration: none;
  color: #5e8fcf;
  font-size: 90%;
`

export const FormPage = styled.div`
  padding: 40px;
`

export const FormGroup = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 20px;
  }
`
