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
  features: {
    projectManagement: boolean
    productionNotes: boolean
    qualityControl: boolean
    footnotes: boolean
    fileManagement: boolean
    commenting: boolean
    switchTemplate: boolean
    headerImage: boolean
    nodeInspector: boolean
    DOI: boolean
    runningTitle: boolean
    figureAlignment: boolean
    projectMenu: boolean
    requirements: boolean
  }
  pressroom: {
    url: string
  }
  production: boolean
  support: {
    email: string
  }
  jupyter: {
    url: string
    token: string
    disabled: boolean
  }
  quarterback: {
    enabled: boolean
    url: string
  }
  connect: {
    enabled: boolean
    frontmatterUri: string
  }
  leanWorkflow: {
    enabled: boolean
    url: string
    graphqlEndpoint: string
    dashboardUrl: string
  }
  iam: {
    url: string
  }
  logSyncEvents: boolean
  backupReplication: {
    path?: string
  }
  picker: {
    origins: string[]
  }
  templates: {
    publish?: boolean
  }
  keywordsCategories: boolean
  version: string
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
      'manuscripts-app-secret': process.env.API_APPLICATION_SECRET,
    },
  },
  beacon: {
    http: process.env.BEACON_HTTP_URL,
    ws: process.env.BEACON_WS_URL,
  },
  discourse: {
    host: normalizeURL(process.env.DISCOURSE_HOST),
  },
  features: {
    projectManagement: isTrue(process.env.FEATURE_PROJECT_MANAGEMENT),
    productionNotes: isTrue(process.env.FEATURE_PRODUCTION_NOTES),
    qualityControl: isTrue(process.env.FEATURE_QUALITY_CONTROL),
    footnotes: isTrue(process.env.FOOTNOTES_ENABLED),
    fileManagement: isTrue(process.env.FEATURE_FILE_MANAGEMENT),
    commenting: isTrue(process.env.COMMENTING),
    switchTemplate: isTrue(process.env.FEATURE_SWITCH_TEMPLATE),
    headerImage: isTrue(process.env.FEATURE_HEADER_IMAGE),
    nodeInspector: isTrue(process.env.FEATURE_NODE_INSPECTOR),
    DOI: isTrue(process.env.FEATURE_DOI),
    runningTitle: isTrue(process.env.FEATURE_RUNNING_TITLE),
    figureAlignment: isTrue(process.env.FEATURE_FIGURE_ALIGNMENT),
    projectMenu: isTrue(process.env.FEATURE_PROJECT_MENU),
    requirements: isTrue(process.env.REQUIREMENTS_ENABLED),
  },
  pressroom: {
    url: normalizeURL(process.env.PRESSROOM_URL),
  },
  production: isTrue(process.env.PRODUCTION),
  support: {
    email: process.env.SUPPORT_EMAIL || 'support@manuscriptsapp.com',
  },
  jupyter: {
    url: normalizeURL(process.env.JUPYTER_URL),
    token: process.env.JUPYTER_TOKEN,
    disabled: isTrue(process.env.DISABLE_ATTACH_CODE),
  },
  quarterback: {
    enabled: isTrue(process.env.QUARTERBACK_ENABLED),
    url: normalizeURL(process.env.QUARTERBACK_URL) || '',
  },
  connect: {
    enabled: isTrue(process.env.ENABLE_CONNECT_LOGIN_OPTION),
    frontmatterUri: process.env.FRONTMATTER_URI || '/about',
  },
  leanWorkflow: {
    enabled: isTrue(process.env.LEAN_WORKFLOW),
    url: normalizeURL(process.env.LEAN_WORKFLOW_MANAGER_URL),
    graphqlEndpoint: process.env.LEAN_WORKFLOW_GRAPHQL_ENDPOINT,
    dashboardUrl: normalizeURL(process.env.DASHBOARD_URL),
  },
  iam: {
    url: normalizeURL(process.env.IAM_BASE_URL),
  },
  logSyncEvents: isTrue(process.env.LOG_SYNC_EVENTS),
  backupReplication: {
    path: process.env.BACKUP_REPLICATION_PATH,
  },
  picker: {
    origins: splitArray(process.env.PICKER_ORIGINS),
  },
  templates: {
    publish: isTrue(process.env.PUBLISH_TEMPLATES),
  },
  keywordsCategories: isTrue(process.env.FEATURE_KEYWORDS_CATEGORIES),
  version: process.env.VERSION ? process.env.VERSION : '1',
}

export default config as Config
