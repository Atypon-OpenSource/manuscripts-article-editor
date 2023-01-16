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
exports.init = void 0;
require("autotrack/lib/plugins/clean-url-tracker");
require("autotrack/lib/plugins/event-tracker");
require("autotrack/lib/plugins/impression-tracker");
require("autotrack/lib/plugins/media-query-tracker");
require("autotrack/lib/plugins/outbound-link-tracker");
require("autotrack/lib/plugins/page-visibility-tracker");
require("autotrack/lib/plugins/url-change-tracker");
const init = ({ id }) => {
    ga =
        ga ||
            function () {
                ga.q = ga.q || [];
                // eslint-disable-next-line prefer-rest-params
                ga.q.push(arguments);
            };
    ga.l = +new Date();
    ga('create', id, 'auto');
    ga('require', 'cleanUrlTracker');
    ga('require', 'eventTracker');
    ga('require', 'impressionTracker');
    ga('require', 'mediaQueryTracker');
    ga('require', 'outboundLinkTracker');
    ga('require', 'pageVisibilityTracker');
    ga('require', 'urlChangeTracker');
    ga('send', 'pageview');
};
exports.init = init;
//# sourceMappingURL=google-analytics.js.map