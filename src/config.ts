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

const isTrue = (value: string | undefined) => {
  return value === '1' || value === 'true'
}

const normalizeURL = (url: string | undefined) => {
  return url && url.replace(/\/$/, '')
}

interface Config {
  environment: string
  analytics: {
    id?: string
  }
  api: {
    url: string
    headers: Record<string, unknown>
  }
  features: {
    footnotes: boolean
    fileManagement: boolean
    commenting: boolean
    DOI: boolean
    runningTitle: boolean
    tableEditing: boolean
    pullQuotes: boolean
  }
  support: {
    email: string
  }
  quarterback: {
    enabled: boolean
    url: string
  }
  keywordsCategories: boolean
}

const config = {
  environment: process.env.NODE_ENV,
  analytics: {
    id: process.env.GOOGLE_ANALYTICS_ID,
  },
  api: {
    url: normalizeURL(process.env.MANUSCRIPTS_API_URL),
    headers: {},
  },
  features: {
    footnotes: isTrue(process.env.FEATURE_FOOTNOTES),
    fileManagement: isTrue(process.env.FEATURE_FILE_MANAGEMENT),
    commenting: isTrue(process.env.FEATURE_COMMENTS),
    DOI: isTrue(process.env.FEATURE_DOI),
    runningTitle: isTrue(process.env.FEATURE_RUNNING_TITLE),
    tableEditing: isTrue(process.env.FEATURE_TABLE_EDITING),
    pullQuotes: isTrue(process.env.FEATURE_PULL_QUOTES),
  },
  support: {
    email: process.env.SUPPORT_EMAIL || 'support@manuscriptsapp.com',
  },
  quarterback: {
    enabled: isTrue(process.env.QUARTERBACK_ENABLED),
    url: normalizeURL(process.env.QUARTERBACK_URL) || '',
  },
  keywordsCategories: isTrue(process.env.FEATURE_KEYWORDS_CATEGORIES),
}

export default config as Config
