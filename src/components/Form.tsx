import { Form } from 'formik'
import { Link } from 'react-router-dom'
import { styled } from '../theme'

export const CenteredForm = styled(Form)`
  width: 450px;
`

export const FormHeader = styled.div`
  padding: 40px;
  text-align: center;
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
  color: #5e8fcf;
  font-size: 90%;
`

export const FormError = styled.div`
  width: 795px;
  height: 50px;
  background: #fdf2f0;
  color: #cd593c;
  border-radius: 2px;
  margin-top: 5px;
  margin-bottom: 5px;
  position: relative;
  padding: 12px;
`
export const FormSuccess = styled.div`
  width: 795px;
  height: 50px;
  background: #dff0d7;
  color: #3a773a;
  border-radius: 3px;
  margin-top: 5px;
  margin-bottom: 5px;
  position: relative;
`
export const FormMessage = styled.div`
  display: inline-flex;
  padding: 12px;
`

export const CloseIcon = styled.button`
  display: inline-flex;
  background: transparent;
  border-width: 0px;
  float: right;
  padding-top: 15px;
  padding-right: 15px;
  cursor: pointer;
`
export const InformativeIcon = styled.div`
  display: inline-flex;
  float: left;
  padding-top: 10px;
  padding-left: 15px;
`

export interface FormErrors {
  submit?: string
}

export interface ErrorProps {
  error?: string | null
}

export const buildError = (dirty: boolean, touched: boolean, error: string) =>
  dirty && touched && error ? error : null

export const submitEvent = {
  preventDefault: () => {
    // NOOP
  },
}
