import { Link } from 'react-router-dom'
import styled from 'styled-components'

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
  color: rgba(255, 255, 255, 0.51);
`

export const FormLink = styled(Link)`
  text-transform: uppercase;
  text-decoration: none;
  color: white;
  font-size: 90%;
`
