interface Config {
  url: string
  environment: string
  native: boolean
  serviceworker: boolean
  api: {
    url: string
    headers: object
  }
  discourse: {
    host: string
  }
  data: {
    url: string
  }
  gateway: {
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

const isTrue = (value: string | undefined) => {
  return value === '1' || value === 'true'
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
  native: isTrue(process.env.NATIVE),
  serviceworker: isTrue(process.env.SERVICEWORKER_ENABLED),
  api: {
    url: normalizeURL(process.env.API_BASE_URL),
    headers: {
      'manuscripts-app-id': process.env.API_APPLICATION_ID,
    },
  },
  data: {
    url: normalizeURL(process.env.DATA_URL),
  },
  discourse: {
    host: normalizeURL(process.env.DISCOURSE_HOST),
  },
  gateway: {
    url: normalizeURL(process.env.SYNC_GATEWAY_URL),
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
