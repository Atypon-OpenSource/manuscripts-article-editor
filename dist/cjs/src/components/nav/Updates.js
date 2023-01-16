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
exports.Updates = exports.newestFirst = exports.oldestFirst = exports.IndividualTopic = exports.TopicItem = exports.Timestamp = exports.Heading = exports.Title = exports.Link = exports.Popup = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const theme_1 = require("../../theme/theme");
const RelativeDate_1 = require("../RelativeDate");
const TopicView_1 = require("./TopicView");
exports.Popup = styled_components_1.default.div `
  background: ${(props) => props.theme.colors.background.primary};
  border-radius: ${(props) => props.theme.grid.radius.default};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  font-family: ${(props) => props.theme.font.family.sans};
  font-size: 10pt;
  font-weight: ${(props) => props.theme.font.weight.normal};
  color: ${(props) => props.theme.colors.text.primary};
  max-width: 500px;
  overflow-x: hidden;
  overflow-y: auto;
  white-space: normal;

  & p {
    margin: 0;
  }

  & img {
    box-sizing: border-box;
    padding: 10pt;
    height: auto;
  }
`;
exports.Link = styled_components_1.default.a `
  color: inherit;
  display: block;
  text-decoration: none;
`;
const FooterLink = styled_components_1.default(exports.Link) `
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 6}px
    ${(props) => props.theme.grid.unit * 3}px;
  border-top: 1px solid ${(props) => props.theme.colors.border.secondary};
`;
exports.Title = styled_components_1.default.div `
  font-size: 1.1em;
  font-weight: ${(props) => props.theme.font.weight.medium};
  cursor: pointer;
  flex: 1;

  &:hover {
    text-decoration: underline;
  }
`;
const Container = styled_components_1.default.div ``;
const Header = styled_components_1.default.div `
  font-size: 1.6em;
  font-weight: ${(props) => props.theme.font.weight.xlight};
  padding: ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 6}px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.tertiary};
`;
exports.Heading = styled_components_1.default.div `
  font-size: 1.05em;
  font-weight: ${(props) => props.theme.font.weight.medium};
  margin-bottom: 2px;
  display: flex;
  justify-content: space-between;
`;
const UpdatesContent = styled_components_1.default.div `
  max-height: 70vh;
  overflow-y: auto;

  img.emoji {
    height: 1em;
    padding: 0;
  }
`;
exports.Timestamp = styled_components_1.default.span `
  color: ${(props) => props.theme.colors.text.tertiary};
  font-size: 8pt;
  font-weight: ${(props) => props.theme.font.weight.normal};
  border-radius: ${(props) => props.theme.grid.radius.default};
  border: 1px solid rgba(0, 197, 255, 0.12);
  background-color: rgba(0, 197, 255, 0.1);
  padding: 2pt 5pt;
  flex-shrink: 0;
  white-space: nowrap;
  margin-left: ${(props) => props.theme.grid.unit}px;
`;
exports.TopicItem = styled_components_1.default.div `
  cursor: pointer;
  font-weight: ${(props) => props.theme.font.weight.normal};
  padding: ${(props) => props.theme.grid.unit * 3}px
    ${(props) => props.theme.grid.unit * 6}px;

  &:not(:last-of-type) {
    border-bottom: 1px solid #eee;
  }

  & p {
    margin-top: 0.5em;
    margin-bottom: 0.8em;
  }

  & img {
    max-width: 70%;
    margin: 0;
    padding: 10pt;
  }

  & .lightbox-wrapper .meta {
    display: none;
  }
`;
exports.IndividualTopic = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 3}px
    ${(props) => props.theme.grid.unit * 6}px;

  & ${exports.TopicItem} {
    padding: 0;
  }
`;
const Back = styled_components_1.default.div `
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
const Message = styled_components_1.default.div `
  padding: 0 24px;
`;
const LoginLink = ({ host }) => (react_1.default.createElement(FooterLink, { href: `${host}/login` },
    react_1.default.createElement("span", { role: "img", "aria-label": "Link emoji" }, "\uD83D\uDD17"),
    ' ',
    "Manuscripts.io community"));
const oldestFirst = (a, b) => {
    if (a.created_at === b.created_at) {
        return 0;
    }
    return a.created_at > b.created_at ? 1 : -1;
};
exports.oldestFirst = oldestFirst;
const newestFirst = (a, b) => {
    if (a.created_at === b.created_at) {
        return 0;
    }
    return a.created_at > b.created_at ? -1 : 1;
};
exports.newestFirst = newestFirst;
class Updates extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {};
        this.renderTopics = () => {
            const { error, loaded, posts, topics } = this.props;
            if (error) {
                return react_1.default.createElement(Message, null, error);
            }
            if (!loaded) {
                return react_1.default.createElement(Message, null, "Loading\u2026");
            }
            if (!topics || !topics.length) {
                return react_1.default.createElement(Message, null, "No topics.");
            }
            if (!posts || !posts.length) {
                return react_1.default.createElement(Message, null, "No posts.");
            }
            return topics.sort(exports.newestFirst).map((topic) => (react_1.default.createElement(exports.TopicItem, { key: topic.id, onClick: (event) => {
                    event.preventDefault();
                    this.selectTopic(topic);
                } },
                react_1.default.createElement(exports.Heading, null,
                    react_1.default.createElement(exports.Title, null, topic.title),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(exports.Timestamp, null,
                            react_1.default.createElement(RelativeDate_1.RelativeDate, { createdAt: Date.parse(topic.created_at) })))))));
        };
        this.selectTopic = (selectedTopic) => {
            this.setState({ selectedTopic });
        };
    }
    render() {
        const { host } = this.props;
        const { selectedTopic } = this.state;
        return (react_1.default.createElement(Container, null,
            selectedTopic ? (react_1.default.createElement(UpdatesContent, null,
                react_1.default.createElement(Header, { onClick: () => this.selectTopic(undefined) },
                    react_1.default.createElement(Back, null,
                        react_1.default.createElement(style_guide_1.BackArrowIcon, { size: 15, color: theme_1.theme.colors.text.tertiary }),
                        ' ',
                        "Back to Latest Updates")),
                react_1.default.createElement(TopicView_1.TopicView, { topic: selectedTopic, host: host }))) : (react_1.default.createElement(UpdatesContent, null,
                react_1.default.createElement(Header, null, "Latest Updates"),
                this.renderTopics())),
            react_1.default.createElement(LoginLink, { host: host })));
    }
}
exports.Updates = Updates;
//# sourceMappingURL=Updates.js.map