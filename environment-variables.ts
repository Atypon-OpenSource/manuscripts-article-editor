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

export const environmentVariables = [
  'API_APPLICATION_ID',
  'API_BASE_URL',
  'BACKUP_REPLICATION_PATH',
  'BASE_URL',
  'BEACON_HTTP_URL',
  'BEACON_WS_URL',
  'CI_ENVIRONMENT_NAME',
  'COMMENTING',
  'CRISP_WEBSITE_ID',
  'DERIVED_DATA_BUCKET',
  'DISCOURSE_HOST',
  'EEO_DEPOSIT_JOURNALS_URL',
  'ENABLE_CONNECT_LOGIN_OPTION',
  'EXPORT_LITERATUM',
  'EXPORT_STS',
  'EXPORT_TO_REVIEW',
  'EXTYLES_ARC_SECRET',
  'FEATURE_FILE_MANAGEMENT',
  'FEATURE_PRODUCTION_NOTES',
  'FEATURE_PROJECT_MANAGEMENT',
  'FEATURE_QUALITY_CONTROL',
  'FEATURE_SWITCH_TEMPLATE',
  'FOOTNOTES_ENABLED',
  'FEATURE_MEDIA_ALTERNATIVES',
  'FRONTMATTER_URI',
  'GIT_COMMIT_HASH',
  'GIT_VERSION',
  'GOOGLE_ANALYTICS_ID',
  'IAM_BASE_URL',
  'JUPYTER_TOKEN',
  'JUPYTER_URL',
  'LEAN_WORKFLOW',
  'LEAN_WORKFLOW_MANAGER_URL',
  'LEAN_WORKFLOW_GRAPHQL_ENDPOINT',
  'DASHBOARD_URL',
  'LOG_SYNC_EVENTS',
  'NATIVE',
  'NODE_ENV',
  'PICKER_ORIGINS',
  'PRESSROOM_URL',
  'PRODUCTION',
  'PROJECTS_BUCKET',
  'PUBLISH_TEMPLATES',
  'SENTRY_PUBLIC_DSN',
  'SENTRY_RELEASE',
  'SERVICEWORKER_ENABLED',
  'SHACKLES_ENABLED',
  'SHACKLES_URL',
  'SUBMISSION_SERIES_CODE',
  'SUBMISSION_GROUP_DOI',
  'SUBMISSION_ID',
  'SUPPORT_EMAIL',
  'SYNC_GATEWAY_URL',
  'ZOTERO_TRANSLATION_SERVER',
  'FOOTNOTES_ENABLED',
  'FEATURE_FILE_MANAGEMENT',
  'FEATURE_KEYWORDS_CATEGORIES',
]

// Optional variables that are only used if they're set
const optionalVariables = [
  'BACKUP_REPLICATION_PATH',
  'BEACON_HTTP_URL',
  'BEACON_WS_URL',
  'CI_ENVIRONMENT_NAME',
  'COMMENTING',
  'CRISP_WEBSITE_ID',
  'EEO_DEPOSIT_JOURNALS_URL',
  'ENABLE_CONNECT_LOGIN_OPTION',
  'EXPORT_LITERATUM',
  'EXPORT_STS',
  'EXPORT_TO_REVIEW',
  'EXTYLES_ARC_SECRET',
  'FEATURE_FILE_MANAGEMENT',
  'FEATURE_PRODUCTION_NOTES',
  'FEATURE_PROJECT_MANAGEMENT',
  'FEATURE_QUALITY_CONTROL',
  'FEATURE_SWITCH_TEMPLATE',
  'FEATURE_MEDIA_ALTERNATIVES',
  'LEAN_WORKFLOW_MANAGER_URL',
  'LEAN_WORKFLOW_GRAPHQL_ENDPOINT',
  'FRONTMATTER_URI',
  'GIT_COMMIT_HASH',
  'GIT_VERSION',
  'GOOGLE_ANALYTICS_ID',
  'LEAN_WORKFLOW',
  'DASHBOARD_URL',
  'LOG_SYNC_EVENTS',
  'NATIVE',
  'PICKER_ORIGINS',
  'PRODUCTION',
  'PUBLISH_TEMPLATES',
  'SENTRY_PUBLIC_DSN',
  'SENTRY_RELEASE',
  'SERVICEWORKER_ENABLED',
  'SHACKLES_ENABLED',
  'SHACKLES_URL',
  'SUBMISSION_SERIES_CODE',
  'SUBMISSION_GROUP_DOI',
  'SUBMISSION_ID',
  'ZOTERO_TRANSLATION_SERVER',
  'FEATURE_KEYWORDS_CATEGORIES',
]

if (
  process.env.NODE_ENV === 'production' &&
  !process.env.ALLOW_MISSING_VARIABLES
) {
  const missing = environmentVariables.filter((key) => {
    if (optionalVariables.includes(key)) {
      return false
    }

    return process.env[key] === undefined || process.env[key] === ''
  })

  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`)
  }
}
