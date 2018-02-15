import * as yup from 'yup'

// TODO: warn about password strength?

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required()
    .matches(/^.+@.+\..+$/),
  password: yup.string().required(),
})

export const passwordSchema = yup.object().shape({
  password: yup.string().required(),
})

export const recoverSchema = yup.object().shape({
  email: yup
    .string()
    .required()
    .matches(/^.+@.+\..+$/),
})

export const signupSchema = yup.object().shape({
  email: yup
    .string()
    .required()
    .matches(/^.+@.+\..+$/),
  password: yup
    .string()
    .required()
    .min(3),
  name: yup
    .string()
    .required()
    .min(1),
  surname: yup
    .string()
    .required()
    .min(2),
})
