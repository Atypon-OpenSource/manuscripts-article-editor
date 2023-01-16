"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const config_helpers_1 = require("./lib/config-helpers");
const config = {
    url: config_helpers_1.normalizeURL(process.env.BASE_URL),
    environment: process.env.NODE_ENV,
    native: config_helpers_1.isTrue(process.env.NATIVE),
    // the local config value is for projects loaded by the native app from
    // the local filesystem. It is designed to disable remote syncing features
    // where applicable.
    local: config_helpers_1.isTrue(process.env.NATIVE) && window.location.hostname.endsWith('.local'),
    serviceworker: config_helpers_1.isTrue(process.env.SERVICEWORKER_ENABLED),
    analytics: {
        id: process.env.GOOGLE_ANALYTICS_ID,
    },
    api: {
        url: config_helpers_1.normalizeURL(process.env.API_BASE_URL),
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
        host: config_helpers_1.normalizeURL(process.env.DISCOURSE_HOST),
    },
    extyles: {
        arc: {
            secret: process.env.EXTYLES_ARC_SECRET,
        },
    },
    features: {
        projectManagement: config_helpers_1.isTrue(process.env.FEATURE_PROJECT_MANAGEMENT),
        productionNotes: config_helpers_1.isTrue(process.env.FEATURE_PRODUCTION_NOTES),
        qualityControl: config_helpers_1.isTrue(process.env.FEATURE_QUALITY_CONTROL),
        footnotes: config_helpers_1.isTrue(process.env.FOOTNOTES_ENABLED),
        fileManagement: config_helpers_1.isTrue(process.env.FEATURE_FILE_MANAGEMENT),
        commenting: config_helpers_1.isTrue(process.env.COMMENTING),
        switchTemplate: config_helpers_1.isTrue(process.env.FEATURE_SWITCH_TEMPLATE),
        headerImage: config_helpers_1.isTrue(process.env.FEATURE_HEADER_IMAGE),
        nodeInspector: config_helpers_1.isTrue(process.env.FEATURE_NODE_INSPECTOR),
        DOI: config_helpers_1.isTrue(process.env.FEATURE_DOI),
        runningTitle: config_helpers_1.isTrue(process.env.FEATURE_RUNNING_TITLE),
        figureAlignment: config_helpers_1.isTrue(process.env.FEATURE_FIGURE_ALIGNMENT),
        projectMenu: config_helpers_1.isTrue(process.env.FEATURE_PROJECT_MENU),
        requirements: config_helpers_1.isTrue(process.env.REQUIREMENTS_ENABLED),
    },
    gateway: {
        url: config_helpers_1.normalizeURL(process.env.SYNC_GATEWAY_URL),
    },
    pressroom: {
        url: config_helpers_1.normalizeURL(process.env.PRESSROOM_URL),
    },
    production: config_helpers_1.isTrue(process.env.PRODUCTION),
    sentry: {
        dsn: config_helpers_1.normalizeURL(process.env.SENTRY_PUBLIC_DSN),
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
        url: config_helpers_1.normalizeURL(process.env.JUPYTER_URL),
        token: process.env.JUPYTER_TOKEN,
        disabled: config_helpers_1.isTrue(process.env.DISABLE_ATTACH_CODE),
    },
    quarterback: {
        enabled: config_helpers_1.isTrue(process.env.QUARTERBACK_ENABLED),
        url: config_helpers_1.normalizeURL(process.env.QUARTERBACK_URL) || '',
    },
    shackles: {
        enabled: config_helpers_1.isTrue(process.env.SHACKLES_ENABLED),
        url: config_helpers_1.normalizeURL(process.env.SHACKLES_URL),
    },
    crisp: {
        id: process.env.CRISP_WEBSITE_ID,
    },
    connect: {
        enabled: config_helpers_1.isTrue(process.env.ENABLE_CONNECT_LOGIN_OPTION),
        frontmatterUri: process.env.FRONTMATTER_URI || '/about',
    },
    leanWorkflow: {
        enabled: config_helpers_1.isTrue(process.env.LEAN_WORKFLOW),
        url: config_helpers_1.normalizeURL(process.env.LEAN_WORKFLOW_MANAGER_URL),
        graphqlEndpoint: process.env.LEAN_WORKFLOW_GRAPHQL_ENDPOINT,
        dashboardUrl: config_helpers_1.normalizeURL(process.env.DASHBOARD_URL),
    },
    iam: {
        url: config_helpers_1.normalizeURL(process.env.IAM_BASE_URL),
    },
    logSyncEvents: config_helpers_1.isTrue(process.env.LOG_SYNC_EVENTS),
    backupReplication: {
        path: process.env.BACKUP_REPLICATION_PATH,
    },
    translation_server: {
        url: config_helpers_1.normalizeURL(process.env.ZOTERO_TRANSLATION_SERVER),
    },
    export: {
        literatum: config_helpers_1.isTrue(process.env.EXPORT_LITERATUM),
        sts: config_helpers_1.isTrue(process.env.EXPORT_STS),
        to_review: config_helpers_1.isTrue(process.env.EXPORT_TO_REVIEW),
    },
    eeo: {
        deposit_journals_url: config_helpers_1.normalizeURL(process.env.EEO_DEPOSIT_JOURNALS_URL),
    },
    submission: {
        series_code: process.env.SUBMISSION_SERIES_CODE,
        group_doi: process.env.SUBMISSION_GROUP_DOI,
        id: process.env.SUBMISSION_ID,
    },
    picker: {
        origins: config_helpers_1.splitArray(process.env.PICKER_ORIGINS),
    },
    templates: {
        publish: config_helpers_1.isTrue(process.env.PUBLISH_TEMPLATES),
    },
    keywordsCategories: config_helpers_1.isTrue(process.env.FEATURE_KEYWORDS_CATEGORIES),
    rxdb: {
        enabled: config_helpers_1.isTrue(process.env.RXDB),
    },
    version: process.env.VERSION ? process.env.VERSION : '1',
};
exports.default = config;
//# sourceMappingURL=config.js.map