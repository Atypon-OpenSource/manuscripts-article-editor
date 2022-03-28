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
interface Config {
    url: string;
    environment: string;
    native: boolean;
    local: boolean;
    serviceworker: boolean;
    analytics: {
        id?: string;
    };
    api: {
        url: string;
        headers: Record<string, unknown>;
    };
    beacon: {
        http: string;
        ws: string;
    };
    discourse: {
        host: string;
    };
    eeo: {
        deposit_journals_url: string;
    };
    extyles: {
        arc: {
            secret?: string;
        };
    };
    features: {
        projectManagement: boolean;
        productionNotes: boolean;
        qualityControl: boolean;
        footnotes: boolean;
        fileManagement: boolean;
        commenting: boolean;
        switchTemplate: boolean;
    };
    gateway: {
        url: string;
    };
    pressroom: {
        url: string;
    };
    production: boolean;
    sentry: {
        dsn?: string;
        environment: string;
        release?: string;
    };
    support: {
        email: string;
    };
    git: {
        version: string;
        commit: string;
    };
    buckets: {
        derived_data: string;
        projects: string;
    };
    jupyter: {
        url: string;
        token: string;
        disabled: boolean;
    };
    shackles: {
        enabled: boolean;
        url: string;
    };
    crisp: {
        id?: string;
    };
    connect: {
        enabled: boolean;
        frontmatterUri: string;
    };
    leanWorkflow: {
        enabled: boolean;
        url: string;
        graphqlEndpoint: string;
        dashboardUrl: string;
    };
    iam: {
        url: string;
    };
    logSyncEvents: boolean;
    backupReplication: {
        path?: string;
    };
    translation_server: {
        url: string;
    };
    export: {
        literatum: boolean;
        sts: boolean;
        to_review: boolean;
    };
    submission: {
        series_code?: string;
        group_doi?: string;
        id?: string;
    };
    picker: {
        origins: string[];
    };
    templates: {
        publish?: boolean;
    };
    rxdb: {
        enabled?: boolean;
    };
    keywordsCategories: boolean;
    version: string;
}
declare const _default: Config;
export default _default;
