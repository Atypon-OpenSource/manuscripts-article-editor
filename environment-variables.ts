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
  'DISABLE_ATTACH_CODE',
  'DISCOURSE_HOST',
  'ENABLE_CONNECT_LOGIN_OPTION',
  'FEATURE_FILE_MANAGEMENT',
  'FEATURE_PRODUCTION_NOTES',
  'FEATURE_PROJECT_MANAGEMENT',
  'FEATURE_QUALITY_CONTROL',
  'FEATURE_SWITCH_TEMPLATE',
  'FEATURE_HEADER_IMAGE',
  'FEATURE_FIGURE_ALIGNMENT',
  'FEATURE_NODE_INSPECTOR',
  'FEATURE_DOI',
  'FEATURE_RUNNING_TITLE',
  'FEATURE_PROJECT_MENU',
  'FOOTNOTES_ENABLED',
  'REQUIREMENTS_ENABLED',
  'FRONTMATTER_URI',
  'IAM_BASE_URL',
  'LEAN_WORKFLOW',
  'LEAN_WORKFLOW_MANAGER_URL',
  'LEAN_WORKFLOW_GRAPHQL_ENDPOINT',
  'LOG_SYNC_EVENTS',
  'NATIVE',
  'NODE_ENV',
  'PICKER_ORIGINS',
  'PRESSROOM_URL',
  'PRODUCTION',
  'PUBLISH_TEMPLATES',
  'QUARTERBACK_ENABLED',
  'QUARTERBACK_URL',
  'SERVICEWORKER_ENABLED',
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
  'DISABLE_ATTACH_CODE',
  'ENABLE_CONNECT_LOGIN_OPTION',
  'FEATURE_FILE_MANAGEMENT',
  'FEATURE_PRODUCTION_NOTES',
  'FEATURE_PROJECT_MANAGEMENT',
  'FEATURE_QUALITY_CONTROL',
  'FEATURE_SWITCH_TEMPLATE',
  'FEATURE_HEADER_IMAGE',
  'FEATURE_FIGURE_ALIGNMENT',
  'FEATURE_NODE_INSPECTOR',
  'FEATURE_DOI',
  'FEATURE_RUNNING_TITLE',
  'FEATURE_PROJECT_MENU',
  'REQUIREMENTS_ENABLED',
  'LEAN_WORKFLOW_MANAGER_URL',
  'LEAN_WORKFLOW_GRAPHQL_ENDPOINT',
  'FRONTMATTER_URI',
  'GOOGLE_ANALYTICS_ID',
  'LEAN_WORKFLOW',
  'NATIVE',
  'PICKER_ORIGINS',
  'PRODUCTION',
  'PUBLISH_TEMPLATES',
  'SERVICEWORKER_ENABLED',
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
