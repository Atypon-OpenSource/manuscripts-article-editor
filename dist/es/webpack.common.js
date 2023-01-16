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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_webpack_plugin_1 = require("clean-webpack-plugin");
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const webpack_1 = __importDefault(require("webpack"));
const workbox_webpack_plugin_1 = require("workbox-webpack-plugin");
const worker_plugin_1 = __importDefault(require("worker-plugin"));
const environment_variables_1 = require("./environment-variables");
const config_helpers_1 = require("./src/lib/config-helpers");
const configuration = {
    entry: './src/index.tsx',
    output: {
        publicPath: '/',
    },
    plugins: (() => {
        const plugins = [
            new clean_webpack_plugin_1.CleanWebpackPlugin(),
            new webpack_1.default.EnvironmentPlugin(environment_variables_1.environmentVariables),
            new copy_webpack_plugin_1.default(['public/screenshot.png', 'public/modernizr.js']),
            new html_webpack_plugin_1.default({
                template: 'public/index.html',
                title: 'Manuscripts.io',
                url: config_helpers_1.normalizeURL(process.env.BASE_URL),
                featureTest: !process.env.NATIVE,
                crisp: process.env.CRISP_WEBSITE_ID,
                analytics: process.env.GOOGLE_ANALYTICS_ID,
            }),
            new webpack_1.default.ContextReplacementPlugin(/react-intl[/\\]locale-data$/, /en/ // TODO: all the locales needed for the locale switcher
            ),
            new webpack_1.default.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
            new worker_plugin_1.default(),
        ];
        if (config_helpers_1.isTrue(process.env.SERVICEWORKER_ENABLED)) {
            plugins.push(new workbox_webpack_plugin_1.GenerateSW({
                cacheId: 'manuscripts-io',
                // dontCacheBustURLsMatching: /\.\w{8}\./, // hash in filename
                // TODO: cache locales as they're loaded?
                importWorkboxFrom: 'local',
                navigateFallback: '/index.html',
                navigateFallbackBlacklist: [
                    /^\/data\//,
                    /^\/about/, // landing page is under /about
                ],
                offlineGoogleAnalytics: true,
            }));
        }
        return plugins;
    })(),
    resolve: {
        extensions: ['.tsx', '.ts', '.mjs', '.js', '.json'],
    },
    node: {
        fs: 'empty',
        path: 'empty',
    },
};
exports.default = configuration;
//# sourceMappingURL=webpack.common.js.map