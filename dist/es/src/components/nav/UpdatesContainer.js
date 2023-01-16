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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatesContainer = void 0;
const BellNormal_1 = __importDefault(require("@manuscripts/assets/react/BellNormal"));
const axios_1 = __importDefault(require("axios"));
const react_1 = __importDefault(require("react"));
const react_popper_1 = require("react-popper");
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../../config"));
const Updates_1 = require("./Updates");
const Wrapper = styled_components_1.default.div `
  position: relative;
  margin: 0 ${(props) => props.theme.grid.unit * 3}px;
`;
const Bubble = styled_components_1.default.div `
  width: ${(props) => props.theme.grid.unit * 3}px;
  height: ${(props) => props.theme.grid.unit * 3}px;
  border-radius: 50%;
  position: absolute;
  top: -2px;
  right: -2px;
  cursor: pointer;
  background: ${(props) => props.theme.colors.brand.medium};
  border: 2px solid white;
`;
const StyledBellIcon = styled_components_1.default(BellNormal_1.default) ``;
const Icon = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  ${StyledBellIcon} g {
    fill: ${(props) => props.isOpen
    ? props.theme.colors.brand.medium
    : props.theme.colors.text.secondary};
  }

  &:hover ${StyledBellIcon} g {
    fill: ${(props) => props.theme.colors.brand.medium};
  }
`;
// eslint-disable-next-line @typescript-eslint/ban-types
class UpdatesContainer extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isOpen: false,
            loaded: false,
            hasUpdates: false,
        };
        this.cancelSource = axios_1.default.CancelToken.source();
        this.nodeRef = react_1.default.createRef();
        this.fetchData = () => __awaiter(this, void 0, void 0, function* () {
            if (!config_1.default.discourse.host) {
                return;
            }
            const response = yield axios_1.default.get(`${config_1.default.discourse.host}/search.json`, {
                params: {
                    q: 'category:updates order:latest_topic',
                },
                cancelToken: this.cancelSource.token,
            });
            if (response.data) {
                const { posts, topics } = response.data;
                const hasUpdates = this.hasUpdates(topics);
                this.setState({ posts, topics, loaded: true, hasUpdates });
            }
            else {
                this.setState({ error: 'No response' });
            }
        });
        this.hasUpdates = (topics) => {
            const topic = this.latestTopic(topics);
            if (!topic) {
                return false;
            }
            const latest = window.localStorage.getItem('changelog');
            if (!latest) {
                return true;
            }
            return latest < topic.created_at;
        };
        this.latestTopic = (topics) => {
            if (!topics || !topics.length) {
                return null;
            }
            return topics.sort(Updates_1.newestFirst)[0];
        };
        this.handleClickOutside = (event) => {
            if (this.state.isOpen &&
                this.nodeRef.current &&
                !this.nodeRef.current.contains(event.target)) {
                this.setState({
                    isOpen: false,
                });
            }
        };
        this.toggleOpen = () => {
            const { isOpen } = this.state;
            if (!isOpen) {
                const topic = this.latestTopic(this.state.topics);
                if (topic) {
                    window.localStorage.setItem('changelog', topic.created_at);
                }
            }
            this.setState({
                isOpen: !isOpen,
                hasUpdates: false,
            });
        };
    }
    componentDidCatch(error) {
        console.error(error);
    }
    componentDidMount() {
        this.fetchData().catch(() => {
            // ignore fetch errors
        });
        this.requestInterval = window.setInterval(this.fetchData, 1000 * 60 * 5);
        this.addClickListener();
    }
    componentWillUnmount() {
        window.clearInterval(this.requestInterval);
        this.removeClickListener();
        this.cancelSource.cancel();
    }
    render() {
        const { isOpen, loaded, error, topics, posts, hasUpdates } = this.state;
        if (!config_1.default.discourse.host) {
            return null;
        }
        return (react_1.default.createElement("div", { ref: this.nodeRef },
            react_1.default.createElement(react_popper_1.Manager, null,
                react_1.default.createElement(react_popper_1.Reference, null, ({ ref }) => (react_1.default.createElement(Wrapper, { ref: ref, onClick: this.toggleOpen },
                    hasUpdates && react_1.default.createElement(Bubble, null),
                    react_1.default.createElement(Icon, { isOpen: isOpen },
                        react_1.default.createElement(StyledBellIcon, { width: 32, height: 32 }))))),
                isOpen && (react_1.default.createElement(react_popper_1.Popper, { placement: 'right' }, ({ ref, style, placement }) => (react_1.default.createElement("div", { ref: ref, style: Object.assign(Object.assign({}, style), { zIndex: 2 }), "data-placement": placement },
                    react_1.default.createElement(Updates_1.Popup, null,
                        react_1.default.createElement(Updates_1.Updates, { host: config_1.default.discourse.host, error: error, loaded: loaded, posts: posts, topics: topics })))))))));
    }
    addClickListener() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    removeClickListener() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
}
exports.UpdatesContainer = UpdatesContainer;
UpdatesContainer.getDerivedStateFromError = () => ({
    error: 'The latest updates could not be displayed.',
});
//# sourceMappingURL=UpdatesContainer.js.map