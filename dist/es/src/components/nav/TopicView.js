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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicView = void 0;
const dompurify_1 = __importStar(require("dompurify"));
const react_1 = __importStar(require("react"));
const sanitize_1 = require("../../lib/sanitize");
const RelativeDate_1 = require("../RelativeDate");
const Updates_1 = require("./Updates");
const ALLOWED_TAGS = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'div',
    'span',
    'img',
    'ul',
    'ol',
    'li',
    'br',
    'a',
];
const sanitizedContent = (html, max) => {
    const content = max && html.length > max ? html.substring(0, max) + '…' : html;
    dompurify_1.default.addHook('afterSanitizeAttributes', sanitize_1.sanitizeLink);
    const output = dompurify_1.sanitize(content, { ALLOWED_TAGS });
    dompurify_1.default.removeHook('afterSanitizeAttributes');
    return react_1.default.createElement("div", { dangerouslySetInnerHTML: { __html: output } });
};
const TopicView = ({ host, topic, }) => {
    const [post, setPost] = react_1.useState();
    const [error, setError] = react_1.useState();
    react_1.useEffect(() => {
        if (topic) {
            fetch(`${host}/t/${topic.id}.json`)
                .then((response) => response.json())
                .then((data) => {
                const post = data.post_stream.posts.sort(Updates_1.oldestFirst)[0];
                setPost(post);
            })
                .catch((error) => {
                setError(error.message);
            });
        }
        else {
            setPost(undefined);
        }
    }, [host, topic]);
    if (!topic) {
        return null;
    }
    return (react_1.default.createElement(Updates_1.IndividualTopic, null,
        react_1.default.createElement(Updates_1.Heading, null,
            react_1.default.createElement(Updates_1.Title, null,
                react_1.default.createElement(Updates_1.Link, { href: `${host}/t/${topic.id}`, title: `Read more about "${topic.title}" at ${host}`, target: '_blank' }, topic.title)),
            react_1.default.createElement("div", null,
                react_1.default.createElement(Updates_1.Timestamp, null,
                    react_1.default.createElement(RelativeDate_1.RelativeDate, { createdAt: Date.parse(topic.created_at) })))),
        react_1.default.createElement(Updates_1.TopicItem, null, error ? (react_1.default.createElement("div", null, "There was an error loading this post.")) : post ? (sanitizedContent(post.cooked)) : ('Loading…'))));
};
exports.TopicView = TopicView;
//# sourceMappingURL=TopicView.js.map