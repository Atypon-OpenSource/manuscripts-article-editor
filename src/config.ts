/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { version } from '../package.json'
import { isTrue, normalizeURL, splitArray } from './lib/config-helpers'

interface Config {
  url: string
  environment: string
  native: boolean
  local: boolean
  serviceworker: boolean
  analytics: {
    id?: string
  }
  api: {
    url: string
    headers: Record<string, unknown>
  }
  beacon: {
    http: string
    ws: string
  }
  discourse: {
    host: string
  }
  eeo: {
    deposit_journals_url: string
  }
  extyles: {
    arc: {
      secret?: string
    }
  }
  features: {
    projectManagement: boolean
  }
  gateway: {
    url: string
  }
  pressroom: {
    url: string
  }
  sentry: {
    dsn?: string
    environment: string
    release?: string
  }
  support: {
    email: string
  }
  git: {
    version: string
    commit: string
  }
  buckets: {
    derived_data: string
    projects: string
  }
  jupyter: {
    url: string
    token: string
  }
  shackles: {
    enabled: boolean
    url: string
  }
  crisp: {
    id?: string
  }
  connect: {
    enabled: boolean
    frontmatterUri: string
  }
  leanWorkflow: {
    enabled: boolean
  }
  iam: {
    url: string
  }
  logSyncEvents: boolean
  backupReplication: {
    path?: string
  }
  translation_server: {
    url: string
  }
  export: {
    prince: boolean
    literatum: boolean
    sts: boolean
    to_review: boolean
  }
  production_notes: {
    enabled: boolean
  }
  quality_control: {
    enabled: boolean
  }
  submission: {
    series_code?: string
    group_doi?: string
  }
  picker: {
    origins: string[]
  }
  templates: {
    publish?: boolean
  }
  leanWorkflowManager: {
    url: string
  }
  footnotes: {
    enabled: boolean
  }
  version: string

  file_management: {
    enabled: boolean
  }
}

const config = {
  url: normalizeURL(process.env.BASE_URL),
  environment: process.env.NODE_ENV,
  native: isTrue(process.env.NATIVE),
  // the local config value is for projects loaded by the native app from
  // the local filesystem. It is designed to disable remote syncing features
  // where applicable.
  local:
    isTrue(process.env.NATIVE) && window.location.hostname.endsWith('.local'),
  serviceworker: isTrue(process.env.SERVICEWORKER_ENABLED),
  analytics: {
    id: process.env.GOOGLE_ANALYTICS_ID,
  },
  api: {
    url: normalizeURL(process.env.API_BASE_URL),
    headers: {
      'manuscripts-app-id': process.env.API_APPLICATION_ID,
    },
  },
  beacon: {
    http: process.env.BEACON_HTTP_URL,
    ws: process.env.BEACON_WS_URL,
  },
  discourse: {
    host: normalizeURL(process.env.DISCOURSE_HOST),
  },
  extyles: {
    arc: {
      secret: process.env.EXTYLES_ARC_SECRET,
    },
  },
  features: {
    projectManagement: isTrue(process.env.FEATURE_PROJECT_MANAGEMENT),
  },
  gateway: {
    url: normalizeURL(process.env.SYNC_GATEWAY_URL),
  },
  pressroom: {
    url: normalizeURL(process.env.PRESSROOM_URL),
  },
  sentry: {
    dsn: normalizeURL(process.env.SENTRY_PUBLIC_DSN),
    environment: process.env.CI_ENVIRONMENT_NAME || 'manual-build',
    release: process.env.SENTRY_RELEASE,
  },
  support: {
    email: process.env.SUPPORT_EMAIL || 'support@manuscriptsapp.com',
  },
  git: {
    version: process.env.GIT_VERSION,
    commit: process.env.GIT_COMMIT_HASH,
  },
  buckets: {
    derived_data: process.env.DERIVED_DATA_BUCKET,
    projects: process.env.PROJECTS_BUCKET,
  },
  jupyter: {
    url: normalizeURL(process.env.JUPYTER_URL),
    token: process.env.JUPYTER_TOKEN,
  },
  shackles: {
    enabled: isTrue(process.env.SHACKLES_ENABLED),
    url: normalizeURL(process.env.SHACKLES_URL),
  },
  crisp: {
    id: process.env.CRISP_WEBSITE_ID,
  },
  connect: {
    enabled: isTrue(process.env.ENABLE_CONNECT_LOGIN_OPTION),
    frontmatterUri: process.env.FRONTMATTER_URI || '/about',
  },
  leanWorkflow: {
    enabled: isTrue(process.env.LEAN_WORKFLOW),
  },
  iam: {
    url: normalizeURL(process.env.IAM_BASE_URL),
  },
  logSyncEvents: isTrue(process.env.LOG_SYNC_EVENTS),
  backupReplication: {
    path: process.env.BACKUP_REPLICATION_PATH,
  },
  translation_server: {
    url: normalizeURL(process.env.ZOTERO_TRANSLATION_SERVER),
  },
  export: {
    prince: isTrue(process.env.EXPORT_PRINCE),
    literatum: isTrue(process.env.EXPORT_LITERATUM),
    sts: isTrue(process.env.EXPORT_STS),
    to_review: isTrue(process.env.EXPORT_TO_REVIEW),
  },
  eeo: {
    deposit_journals_url: normalizeURL(process.env.EEO_DEPOSIT_JOURNALS_URL),
  },
  production_notes: {
    enabled: isTrue(process.env.FEATURE_PRODUCTION_NOTES),
  },
  quality_control: {
    enabled: isTrue(process.env.FEATURE_QUALITY_CONTROL),
  },
  submission: {
    series_code: process.env.SUBMISSION_SERIES_CODE,
    group_doi: process.env.SUBMISSION_GROUP_DOI,
  },
  picker: {
    origins: splitArray(process.env.PICKER_ORIGINS),
  },
  templates: {
    publish: isTrue(process.env.PUBLISH_TEMPLATES),
  },
  leanWorkflowManager: {
    url: normalizeURL(process.env.LEAN_WORKFLOW_MANAGER_URL),
  },
  footnotes: {
    enabled: isTrue(process.env.FOOTNOTES_ENABLED),
  },
  version,
  file_management: {
    enabled: isTrue(process.env.FEATURE_PRODUCTION_NOTES),
  },
}

export default config as Config
