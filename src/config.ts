import * as yup from 'yup'

interface Config {
  environment: string
  api: {
    url: string
    headers: object
  }
  gateway: {
    url: string
  }
  csl: {
    url: string
  }
  sentry: {
    dsn: string | undefined
  }
  wayf: {
    key: string | undefined
    url: string | undefined
  }
}

const config = {
  environment: process.env.NODE_ENV,
  api: {
    url: process.env.API_BASE_URL,
    headers: {
      'manuscripts-app-id': process.env.API_APPLICATION_ID,
    },
  },
  gateway: {
    url: process.env.SYNC_GATEWAY_URL,
  },
  csl: {
    url: process.env.CSL_DATA_URL,
  },
  sentry: {
    dsn: process.env.SENTRY_PUBLIC_DSN,
  },
  wayf: {
    key: process.env.WAYF_KEY,
    url: process.env.WAYF_URL,
  },
}

const schema = yup.object().shape({
  environment: yup.string().oneOf(['development', 'production', 'test']),
  api: yup.object().shape({
    url: yup
      .string()
      .url()
      .required(),
    headers: yup.object().shape({
      'manuscripts-app-id': yup.string().required(),
    }),
  }),
  gateway: yup.object().shape({
    url: yup
      .string()
      .url()
      .required(),
  }),
  csl: yup.object().shape({
    url: yup
      .string()
      .url()
      .required(),
  }),
  sentry: yup.object().shape({
    dsn: yup.string().url(),
  }),
  wayf: yup.object().shape({
    key: yup.string(),
    url: yup.string().url(),
  }),
})

if (config.environment !== 'test') {
  schema.validateSync(config)
}

export default config as Config
