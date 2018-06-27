import * as yup from 'yup'

// TODO: warn about password strength?

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string().required(),
})

export const passwordSchema = yup.object().shape({
  password: yup.string().required(),
})

export const recoverSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
})

export const signupSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .required()
    .min(8),
  name: yup
    .string()
    .required()
    .min(1),
})

export const accountSchema = yup.object().shape({
  password: yup.string().required(),
})

export const changePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required('Please enter the current password'),
  newPassword: yup
    .string()
    .min(8, 'The new password must be at least 8 characters long')
    .required('Please enter a new password'),
})

export const profileSchema = yup.object().shape({
  bibliographicName: yup.object().shape({
    givenName: yup
      .string()
      .required()
      .min(1),
    familyName: yup
      .string()
      .required()
      .min(2),
  }),
  title: yup.string(),
  // email: yup.string().email(),
  phone: yup.string(), // TODO: pattern
})

export const preferencesSchema = yup.object().shape({
  locale: yup
    .string()
    .required()
    .min(2), // TODO: valid locales
})

export const manuscriptSchema = yup.object().shape({
  title: yup
    .string()
    .required()
    .min(10),
  authors: yup.object().shape({}),
})
