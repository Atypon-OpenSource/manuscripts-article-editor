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
exports.Presence = void 0;
const react_hooks_1 = require("@apollo/react-hooks");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const react_1 = __importStar(require("react"));
const use_debounce_1 = require("../../hooks/use-debounce");
const RECORD_ACTIVITY = graphql_tag_1.default `
  mutation RecordActivity(
    $containerId: String!
    $deviceId: String!
    $path: [String]
    $startPos: Int
    $endPos: Int
  ) {
    recordActivity(
      containerId: $containerId
      deviceId: $deviceId
      path: $path
      startPos: $startPos
      endPos: $endPos
    ) {
      containerId
      deviceId
      userId
    }
  }
`;
const RECORD_IDLENESS = graphql_tag_1.default `
  mutation RecordIdleness($containerId: String!, $deviceId: String!) {
    recordIdleness(containerId: $containerId, deviceId: $deviceId) {
      containerId
      deviceId
      userId
    }
  }
`;
const STOP_ACTIVITY = graphql_tag_1.default `
  mutation StopActivity($containerId: String!, $deviceId: String!) {
    stopActivity(containerId: $containerId, deviceId: $deviceId) {
      success
    }
  }
`;
exports.Presence = react_1.default.memo(({ deviceId, containerId, manuscriptId, selectedElementId }) => {
    const [activity, setActivity] = react_1.useState();
    const [idle, setIdle] = react_1.useState(document.hidden);
    const debouncedActivity = use_debounce_1.useDebounce(activity, 1000);
    const debouncedIdle = use_debounce_1.useDebounce(idle, 30000);
    const [recordActivity] = react_hooks_1.useMutation(RECORD_ACTIVITY);
    const [recordIdleness] = react_hooks_1.useMutation(RECORD_IDLENESS);
    const [stopActivity] = react_hooks_1.useMutation(STOP_ACTIVITY);
    react_1.useEffect(() => {
        if (debouncedIdle) {
            recordIdleness({
                variables: {
                    containerId,
                    deviceId,
                },
            }).catch((error) => {
                console.error(error);
            });
        }
    }, [containerId, deviceId, debouncedIdle, recordIdleness]);
    react_1.useEffect(() => {
        if (debouncedActivity && !idle) {
            recordActivity({
                variables: debouncedActivity,
            }).catch((error) => {
                console.error(error);
            });
        }
    }, [debouncedActivity, idle, recordActivity]);
    react_1.useEffect(() => {
        const buildPath = () => {
            const path = [manuscriptId];
            if (selectedElementId) {
                path.push(selectedElementId);
            }
            return path;
        };
        setActivity({
            containerId,
            deviceId,
            path: buildPath(),
        });
    }, [containerId, deviceId, manuscriptId, selectedElementId]);
    react_1.useEffect(() => {
        // call stopActivity on unmount
        return () => {
            stopActivity({
                variables: {
                    containerId,
                    deviceId,
                },
            }).catch((error) => {
                console.error(error);
            });
        };
    }, [containerId, deviceId, stopActivity]);
    react_1.useEffect(() => {
        const handleVisibilityChange = () => {
            setIdle(document.hidden);
        };
        document.addEventListener('visibilitychange', handleVisibilityChange, false);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
    return null;
});
//# sourceMappingURL=Presence.js.map