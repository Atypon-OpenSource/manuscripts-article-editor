interface Config {
  url: string
  environment: string
  serviceworker: boolean
  api: {
    url: string
    headers: object
  }
  gateway: {
    url: string
  }
  data: {
    url: string
  }
  pressroom: {
    key: string
    url: string
  }
  sentry: {
    dsn: string | undefined
  }
  wayf: {
    key: string | undefined
    url: string | undefined
  }
  git: {
    version: string
    commit: string
  }
}

const config = {
  url: process.env.BASE_URL,
  environment: process.env.NODE_ENV,
  serviceworker: process.env.SERVICEWORKER_ENABLED === '1',
  api: {
    url: process.env.API_BASE_URL,
    headers: {
      'manuscripts-app-id': process.env.API_APPLICATION_ID,
    },
  },
  gateway: {
    url: process.env.SYNC_GATEWAY_URL,
  },
  data: {
    url: process.env.DATA_URL,
  },
  pressroom: {
    key: process.env.PRESSROOM_KEY,
    url: process.env.PRESSROOM_URL,
  },
  sentry: {
    dsn: process.env.SENTRY_PUBLIC_DSN,
  },
  wayf: {
    key: process.env.WAYF_KEY,
    url: process.env.WAYF_URL,
  },
  git: {
    version: process.env.GIT_VERSION,
    commit: process.env.GIT_COMMIT_HASH,
  },
}

export default config as Config
