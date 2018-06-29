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

export default config as Config
