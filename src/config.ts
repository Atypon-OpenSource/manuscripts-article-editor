interface Config {
  url: string
  environment: string
  serviceworker: boolean
  api: {
    url: string
    headers: object
  }
  discourse: {
    host: string
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
    environment: string
    release: string | undefined
  }
  support: {
    email: string
    url: string | undefined
  }
  wayf: {
    key?: string
    url?: string
  }
  git: {
    version: string
    commit: string
  }
  buckets: {
    projects: string
  }
}

const normalizeURL = (url: string | undefined) => {
  return url && url.replace(/\/$/, '')
}

export interface WayfConfiguration {
  key?: string
  url?: string
}

const config = {
  url: normalizeURL(process.env.BASE_URL),
  environment: process.env.NODE_ENV,
  serviceworker: process.env.SERVICEWORKER_ENABLED === '1',
  api: {
    url: normalizeURL(process.env.API_BASE_URL),
    headers: {
      'manuscripts-app-id': process.env.API_APPLICATION_ID,
    },
  },
  discourse: {
    host: normalizeURL(process.env.DISCOURSE_HOST),
  },
  gateway: {
    url: normalizeURL(process.env.SYNC_GATEWAY_URL),
  },
  data: {
    url: normalizeURL(process.env.DATA_URL),
  },
  pressroom: {
    key: process.env.PRESSROOM_KEY,
    url: normalizeURL(process.env.PRESSROOM_URL),
  },
  sentry: {
    dsn: normalizeURL(process.env.SENTRY_PUBLIC_DSN),
    environment: process.env.CI_ENVIRONMENT_NAME || 'manual-build',
    release: process.env.SENTRY_RELEASE,
  },
  support: {
    email: process.env.SUPPORT_EMAIL || 'support@manuscriptsapp.com',
    url: process.env.SUPPORT_URL,
  },
  wayf: {
    key: process.env.WAYF_KEY,
    url: normalizeURL(process.env.WAYF_URL),
  },
  git: {
    version: process.env.GIT_VERSION,
    commit: process.env.GIT_COMMIT_HASH,
  },
  buckets: {
    projects: process.env.PROJECTS_BUCKET,
  },
}

export default config as Config
