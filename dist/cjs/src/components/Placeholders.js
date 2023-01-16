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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectAphorismPlaceholder = exports.DataLoadingPlaceholder = exports.ProjectSyncingPlaceholder = exports.ProjectPlaceholder = exports.ManuscriptPlaceholder = void 0;
const aphorisms_json_1 = __importDefault(require("@manuscripts/data/dist/shared/aphorisms.json"));
const lodash_es_1 = require("lodash-es");
const react_1 = __importStar(require("react"));
const react_spring_1 = require("react-spring");
const styled_components_1 = __importDefault(require("styled-components"));
const Aphorism_1 = require("./Aphorism");
const ProgressIndicator_1 = require("./ProgressIndicator");
const PlaceholderContainer = styled_components_1.default.div `
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const ManuscriptPlaceholder = () => (react_1.default.createElement(PlaceholderContainer, null,
    react_1.default.createElement(ProgressIndicator_1.ProgressIndicator, { isDeterminate: false, size: ProgressIndicator_1.IndicatorSize.Large, symbols: ProgressIndicator_1.IndicatorKind.Project })));
exports.ManuscriptPlaceholder = ManuscriptPlaceholder;
const ProjectPlaceholder = () => (react_1.default.createElement(PlaceholderContainer, null,
    react_1.default.createElement(ProgressIndicator_1.ProgressIndicator, { isDeterminate: false, size: ProgressIndicator_1.IndicatorSize.Large, symbols: ProgressIndicator_1.IndicatorKind.Project })));
exports.ProjectPlaceholder = ProjectPlaceholder;
const ProgressGroup = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const ProgressMessage = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.font.size.xlarge};
  margin: ${(props) => props.theme.grid.unit * 4}px;
`;
const ProgressMessageSubtitle = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.font.size.normal};
  font-weight: ${(props) => props.theme.font.weight.light};
`;
const ProgressMessageContainer = ({ delay = 0, title, subtitle }) => {
    const [delayed, setDelayed] = react_1.useState(false);
    react_1.useEffect(() => {
        const timer = window.setTimeout(() => {
            setDelayed(true);
        }, delay);
        return () => window.clearTimeout(timer);
    }, [delay]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(ProgressMessage, null, title),
        delayed && react_1.default.createElement(ProgressMessageSubtitle, null, subtitle)));
};
const ProjectSyncingPlaceholder = () => (react_1.default.createElement(PlaceholderContainer, null,
    react_1.default.createElement(ProgressGroup, null,
        react_1.default.createElement(ProgressIndicator_1.ProgressIndicator, { isDeterminate: false, size: ProgressIndicator_1.IndicatorSize.Large, symbols: ProgressIndicator_1.IndicatorKind.Project }),
        react_1.default.createElement(ProgressMessageContainer, { delay: 5000, title: 'Syncing project data…', subtitle: 'This can take a while the first time.' }))));
exports.ProjectSyncingPlaceholder = ProjectSyncingPlaceholder;
const DataLoadingPlaceholder = () => (react_1.default.createElement(PlaceholderContainer, null,
    react_1.default.createElement(ProgressGroup, null,
        react_1.default.createElement(ProgressIndicator_1.ProgressIndicator, { isDeterminate: false, size: ProgressIndicator_1.IndicatorSize.Medium, symbols: ProgressIndicator_1.IndicatorKind.Project }),
        react_1.default.createElement(ProgressMessageContainer, { title: 'Loading...' }))));
exports.DataLoadingPlaceholder = DataLoadingPlaceholder;
const FixedPlaceholderContainer = styled_components_1.default.div `
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.colors.background.primary};
  opacity: 1;
  z-index: 10;
`;
const AnimatedFixedPlaceholderContainer = react_spring_1.animated(FixedPlaceholderContainer);
const ProjectAphorismPlaceholder = ({ duration }) => {
    const [aphorism] = react_1.useState(lodash_es_1.sample(aphorisms_json_1.default));
    const [loading, setLoading] = react_1.useState(true);
    react_1.useEffect(() => {
        const handle = window.setTimeout(() => {
            setLoading(false);
        }, duration);
        return () => {
            window.clearTimeout(handle);
        };
    });
    const transitions = react_spring_1.useTransition(loading, null, {
        from: { opacity: 1 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    });
    return (react_1.default.createElement(react_1.default.Fragment, null, transitions.map(({ item, key, props }) => item && (react_1.default.createElement(AnimatedFixedPlaceholderContainer, { key: key, style: props },
        react_1.default.createElement(ProgressIndicator_1.ProgressIndicator, { isDeterminate: false, size: ProgressIndicator_1.IndicatorSize.Large, symbols: ProgressIndicator_1.IndicatorKind.Project }),
        react_1.default.createElement(Aphorism_1.AphorismView, { aphorism: aphorism }))))));
};
exports.ProjectAphorismPlaceholder = ProjectAphorismPlaceholder;
//# sourceMappingURL=Placeholders.js.map