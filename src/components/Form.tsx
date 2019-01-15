import { Form } from 'formik'
import { Link } from 'react-router-dom'
import { styled, ThemedProps } from '../theme'

type ThemedDivProps = ThemedProps<HTMLDivElement>

export const CenteredForm = styled(Form)`
  width: 100%;
  max-width: 450px;
`

export const FormHeader = styled.div`
  padding: 40px;
  text-align: center;
  @media (max-width: 450px) {
    padding: 40px 0;
  }
`

export const FormActions = styled.div`
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
  color: ${props => props.theme.colors.global.text.link};
  font-size: 90%;
`

export const FormError = styled.div`
  background: ${(props: ThemedDivProps) =>
    props.theme.colors.global.background.error};
  color: ${(props: ThemedDivProps) => props.theme.colors.global.text.secondary};
  border-radius: 2px;
  margin-top: 5px;
  margin-bottom: 5px;
  position: relative;
  padding: 12px;
`

export interface FormErrors {
  submit?: string
}

export interface ErrorProps {
  error?: string | null | object
}

export const submitEvent = {
  preventDefault: () => {
    // NOOP
  },
}
