import yup from 'yup'

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
  givenName: yup
    .string()
    .required()
    .min(1),
  familyName: yup
    .string()
    .required()
    .min(2),
  title: yup.string(),
  email: yup.string().email(),
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
